import json
import logging
import typing as t

import pandas
import pandasdmx
import pandasdmx.message
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from colorfield import fields as colorfield_models
from sophon.permissions import SophonGroupModel, SophonUserType

log = logging.getLogger(__name__)


class DataSource(models.Model):
    """
    A :class:`.DataSource` is a web service which provides access to statistical information sourced by multiple data
    providers.

    PandaSDMX supports natively multiple data sources, listed
    `here <https://pandasdmx.readthedocs.io/en/v1.0/sources.html#data-sources>`_ .

    They are duplicated in the database to allow for custom sources to be added through the :meth:`pandasdmx.add_source`
    method.
    """

    id = models.CharField(
        "PandaSDMX id",
        help_text="Internal id used by PandaSDMX to reference the source.",
        max_length=16,
        primary_key=True,
    )

    name = models.CharField(
        "Name",
        help_text="Full length name of the data source.",
        max_length=512,
    )

    description = models.TextField(
        "Description",
        help_text="Long description of the data source.",
        blank=True,
    )

    url = models.URLField(
        "API URL",
        help_text="The base URL of the SDMX endpoint of the data source."
    )

    documentation = models.URLField(
        "Documentation URL",
        help_text="Documentation URL of the data source.",
        null=True,
    )

    data_content_type = models.CharField(
        "API type",
        help_text="The format in which the API returns its data.",
        choices=[
            ("JSON", "JSON"),
            ("XML", "XML"),
        ],
        default="XML",
        max_length=16,
    )

    headers = models.JSONField(
        "HTTP Headers",
        help_text="HTTP headers to attach to every request, as a JSON object.",
        default=dict,
    )

    resources = models.JSONField(
        "Resources",
        help_text="Unknown and undocumented JSON object.",
        default=dict,
    )

    supports_agencyscheme = models.BooleanField(
        "Supports AgencyScheme",
        help_text='Whether the data source supports '
                  '<a href="https://pandasdmx.readthedocs.io/en/latest/api.html#pandasdmx.model.AgencyScheme">'
                  'AgencyScheme '
                  '</a> or not.',
        default=True,
    )

    supports_categoryscheme = models.BooleanField(
        "Supports CategoryScheme",
        help_text='Whether the data source supports '
                  '<a href="https://pandasdmx.readthedocs.io/en/latest/api.html#pandasdmx.model.CategoryScheme">'
                  'CategoryScheme '
                  '</a> or not.',
        default=True,
    )

    supports_codelist = models.BooleanField(
        "Supports CodeList",
        help_text='Whether the data source supports '
                  '<a href="https://pandasdmx.readthedocs.io/en/latest/api.html#pandasdmx.model.CodeList">'
                  'CodeList '
                  '</a> or not.',
        default=True,
    )

    supports_conceptscheme = models.BooleanField(
        "Supports ConceptScheme",
        help_text='Whether the data source supports '
                  '<a href="https://pandasdmx.readthedocs.io/en/latest/api.html#pandasdmx.model.ConceptScheme">'
                  'ConceptScheme '
                  '</a> or not.',
        default=True,
    )

    supports_data = models.BooleanField(
        "Supports DataSet",
        help_text='Whether the data source supports '
                  '<a href="https://pandasdmx.readthedocs.io/en/latest/api.html#pandasdmx.model.DataSet">'
                  'DataSet '
                  '</a> or not.',
        default=True,
    )

    supports_dataflow = models.BooleanField(
        "Supports DataflowDefinition",
        help_text='Whether the data source supports '
                  '<a href="https://pandasdmx.readthedocs.io/en/latest/api.html#pandasdmx.model.DataflowDefinition">'
                  'DataflowDefinition '
                  '</a> or not.',
        default=True,
    )

    supports_datastructure = models.BooleanField(
        "Supports DataStructureDefinition",
        help_text='Whether the data source supports '
                  '<a href="https://pandasdmx.readthedocs.io/en/latest/api.html#pandasdmx.model.DataStructureDefinition">'
                  'CategoryScheme '
                  '</a> or not.',
        default=True,
    )

    supports_provisionagreement = models.BooleanField(
        "Supports ProvisionAgreement",
        help_text='Whether the data source supports '
                  '<a href="https://pandasdmx.readthedocs.io/en/latest/api.html#pandasdmx.model.ProvisionAgreement">'
                  'CategoryScheme '
                  '</a> or not.',
        default=True,
    )

    supports_preview = models.BooleanField(
        "Supports previews",
        help_text='Whether the data source supports '
                  '<a href="https://pandasdmx.readthedocs.io/en/latest/api.html#pandasdmx.Request.preview_data">'
                  'previews of data '
                  '</a> or not.',
        default=False,
    )

    supports_structurespecific_data = models.BooleanField(
        "Supports structure-specific data messages",
        help_text='Whether the data source returns '
                  '<a href="https://pandasdmx.readthedocs.io/en/latest/api.html#pandasdmx.source.Source">'
                  'structure-specific data messages '
                  '</a> or not.',
        default=False,
    )

    def supports_dict(self) -> dict:
        return {
            "agencyscheme": self.supports_agencyscheme,
            "categoryscheme": self.supports_categoryscheme,
            "codelist": self.supports_codelist,
            "conceptscheme": self.supports_conceptscheme,
            "data": self.supports_data,
            "dataflow": self.supports_dataflow,
            "datastructure": self.supports_datastructure,
            "provisionagreement": self.supports_provisionagreement,
            "preview": self.supports_preview,
            "structure-specific data": self.supports_structurespecific_data,
        }

    def info_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "data_content_type": self.data_content_type,
            "url": self.url,
            "documentation": self.documentation,
            "supports": self.supports_dict(),
            "headers": self.headers,
            "resources": self.resources,
        }

    builtin = models.BooleanField(
        "Builtin",
        help_text="Whether the source is built-in in PandaSDMX or not.",
    )

    @classmethod
    def create_from_sources_json(cls, file: t.TextIO):
        j_sources: list = json.load(file)

        for j_source in j_sources:

            # Flatten supports
            if supports := j_source.get("supports"):
                del j_source["supports"]
                for key, value in supports.items():
                    if key == "structure-specific data":
                        j_source["supports_structurespecific_data"] = value
                    else:
                        j_source[f"supports_{key}"] = value

            cls.objects.update_or_create(
                id=j_source["id"],
                defaults={
                    **j_source,
                    "builtin": True,
                }
            )

    def to_pandasdmx_source(self) -> pandasdmx.source.Source:
        """
        Convert the :class:`.DataSource` to a :class:`pandasdmx.source.Source`\\ .

        :return: The :class:`pandasdmx.source.Source`\\ .

        .. todo:: :func:`.to_pandasdmx` does not currently support non :attr:`.builtin` sources.
        """
        return pandasdmx.source.sources[self.id]

    def to_pandasdmx_request(self) -> pandasdmx.Request:
        """
        Convert the :class:`.DataSource` to a :class:`pandasdmx.Request` client.

        :return: The :class:`pandasdmx.Request`\\ .
        """
        return pandasdmx.Request(source=self.to_pandasdmx_source().id)

    last_sync = models.DateTimeField(
        "Last updated",
        help_text="The datetime at which the data flows of this source were last syncronized.",
        null=True,
    )

    def request_flows(self) -> tuple[pandas.Series, pandas.Series]:
        """
        Retrieve all available dataflows and datastructures as two :class:`pandas.Series`\\ .

        :return: A :class:`tuple` containing all dataflows and all datastructures.

        .. note:: This seems to be an expensive operation, as it may take a few minutes to execute.

        .. todo:: This function assumes both ``dataflow`` and ``structure`` will always be available.
                  Can something happen to make at least one of them :data:`None` ?
        """
        source = self.to_pandasdmx_request()
        message: pandasdmx.message.Message = source.dataflow()
        data: dict[str, pandas.Series] = message.to_pandas()
        flows = data["dataflow"]
        structs = data["structure"]
        return flows, structs

    def sync_flows(self) -> None:
        """
        Create :class:`.DataFlow` objects for every dataflow returned by :meth:`.request_flows`, and update the ones
        that already exist.

        .. warning:: This function does not delete any :class:`.DataFlow`, even if it doesn't exist anymore!
        """

        log.debug(f"Requesting dataflows of {self!r}...")
        flows, structs = self.request_flows()

        log.info(f"Syncing DataFlows of {self!r}...")
        for description, sdmx_id in zip(flows, flows.index):
            db_flow, _created = DataFlow.objects.update_or_create(
                **{
                    "datasource": self,
                    "sdmx_id": sdmx_id,
                },
                defaults={
                    "description": description,
                }
            )
            db_flow.save()
            log.debug(f"Synced {db_flow}!")

        log.debug(f"Updating last_sync value of {self!r}")
        self.last_sync = timezone.now()
        self.save()
        log.info(f"Finished syncing DataFlows of {self!r}")

    def __str__(self):
        return self.id


class DataFlow(models.Model):
    """
    A :class:`.DataFlow` is a object containing the metadata of a SDMX data set.

    See `this page <https://ec.europa.eu/eurostat/online-help/redisstat-admin/en/TECH_A_main/>`_ for more details.
    """

    surrogate_id = models.BigAutoField(
        "Surrogate id",
        help_text="Internal id used by Django to identify this DataFlow.",
        primary_key=True,
    )

    datasource = models.ForeignKey(
        DataSource,
        help_text="The DataSource this object belongs to.",
        on_delete=models.RESTRICT,
    )

    sdmx_id = models.CharField(
        "SDMX id",
        help_text="Internal string used in SDMX communication to identify the DataFlow.",
        max_length=64,
    )

    description = models.TextField(
        "Description",
        help_text="Natural language description of the DataFlow.",
        blank=True,
    )

    def __str__(self):
        return f"[{self.datasource}] {self.sdmx_id}"


class ResearchGroup(SophonGroupModel):
    """
    A :class:`.ResearchGroup` is a group of users which collectively own :class:`.ResearchProjects`.
    """

    slug = models.SlugField(
        "Slug",
        help_text="Unique alphanumeric string which identifies the group.",
        max_length=64,
        primary_key=True,
    )

    name = models.CharField(
        "Name",
        help_text="The display name of the group.",
        max_length=512,
    )

    description = models.TextField(
        "Description",
        help_text="A brief description of what the group is about, to be displayed in the overview.",
        blank=True,
    )

    owner = models.ForeignKey(
        User,
        help_text="The user who created the group, and therefore can add other users to it.",
        on_delete=models.CASCADE,
    )

    members = models.ManyToManyField(
        User,
        help_text="The users who belong to this group, including the owner.",
        related_name="is_a_member_of",
        blank=True,
    )

    access = models.CharField(
        "Access",
        help_text="A setting specifying how can users join this group.",
        choices=[
            ("MANUAL", "⛔️ Collaborators must be added manually"),
            ("OPEN", "❇️ Users can join the group freely"),
        ],
        default="MANUAL",
        max_length=16,
    )

    def get_group(self):
        return self

    @classmethod
    def get_public_fields(cls) -> set[str]:
        return {
            "slug",
            "name",
            "description",
            "owner",
            "members",
            "access",
        }

    @classmethod
    def get_view_fields(cls) -> set[str]:
        return set()

    @classmethod
    def get_edit_fields(cls) -> set[str]:
        return {
            "name",
            "description",
        }

    @classmethod
    def get_admin_fields(cls) -> set[str]:
        return {
            "members",
            "access",
        }

    def get_access_level(self, user) -> SophonUserType:
        if user.is_superuser:
            return SophonUserType.SUPERUSER
        elif user == self.owner:
            return SophonUserType.OWNER
        elif user in self.members:
            return SophonUserType.MEMBER
        elif not user.is_anonymous():
            return SophonUserType.REGISTERED
        else:
            return SophonUserType.NONE

    def __str__(self):
        return f"{self.slug}"


class ResearchTag(SophonGroupModel):
    """
    A :class:`.ResearchTag` is a keyword that :class:`.ResearchProject`\\ s can be associated with.
    """

    slug = models.SlugField(
        "Slug",
        help_text="Unique alphanumeric string which identifies the tag.",
        max_length=64,
        primary_key=True,
    )

    name = models.CharField(
        "Name",
        help_text="The name of the tag.",
        max_length=512,
    )

    description = models.TextField(
        "Description",
        help_text="Additional information about the tag.",
    )

    color = colorfield_models.ColorField(
        "Color",
        help_text="The color that the tag should have when displayed.",
        default="#FF7F00",
    )

    group = models.ForeignKey(
        ResearchGroup,
        help_text="The group this project belongs to.",
        on_delete=models.CASCADE,
    )

    def get_group(self):
        return self.group

    def __str__(self):
        return f"[{self.name}]"


class ResearchProject(SophonGroupModel):
    """
    A :class:`.ResearchProject` is a work which may use zero or more :class:`.DataSource`\\ s to prove or disprove an
    hypothesis.
    """

    slug = models.SlugField(
        "Slug",
        help_text="Unique alphanumeric string which identifies the project.",
        max_length=64,
        primary_key=True,
    )

    name = models.CharField(
        "Name",
        help_text="The display name of the project.",
        max_length=512,
    )

    description = models.TextField(
        "Description",
        help_text="A brief description of the project, to be displayed in the overview.",
        blank=True,
    )

    visibility = models.CharField(
        "Visibility",
        help_text="A setting specifying who can view the project contents.",
        choices=[
            ("PUBLIC", "🌍 Public"),
            ("INTERNAL", "🏭 Internal"),
            ("PRIVATE", "🔒 Private"),
        ],
        default="INTERNAL",
        max_length=16,
    )

    group = models.ForeignKey(
        ResearchGroup,
        help_text="The group this project belongs to.",
        on_delete=models.CASCADE,
    )

    tags = models.ManyToManyField(
        ResearchTag,
        help_text="The tags this project has been tagged with.",
        related_name="tagged",
        blank=True,
    )

    flows = models.ManyToManyField(
        DataFlow,
        help_text="The DataFlows used in this project.",
        related_name="used_in",
        blank=True,
    )

    def get_group(self):
        return self.group

    def __str__(self):
        return f"{self.slug}"

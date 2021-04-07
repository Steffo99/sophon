from django.db import models
import pandas
import pandasdmx
import pandasdmx.message


class DataSource(models.Model):
    """
    A :class:`.DataSource` is a web service which provides access to statistical information sourced by multiple data
    providers.

    PandaSDMX supports natively multiple data sources, listed
    `here <https://pandasdmx.readthedocs.io/en/v1.0/sources.html#data-sources>`_ .

    They are duplicated in the database to allow for custom sources to be added through the :meth:`pandasdmx.add_source`
    method.
    """

    pandasdmx_id = models.CharField(
        "PandaSDMX id",
        help_text="Internal id used by PandaSDMX to reference the source.",
        max_length=16,
        primary_key=True,
    )

    builtin = models.BooleanField(
        "Builtin",
        help_text="Whether the source is builtin in PandaSDMX or not.",
    )
    settings = models.JSONField(
        "Settings",
        help_text="Info parameter to pass to pandasdmx.add_source if the source is not builtin "
                  "(see https://pandasdmx.readthedocs.io/en/latest/api.html#pandasdmx.add_source).",
        null=True
    )

    def to_pandasdmx_source(self) -> pandasdmx.source.Source:
        """
        Convert the :class:`.DataSource` to a :class:`pandasdmx.source.Source`\\ .

        :return: The :class:`pandasdmx.source.Source`\\ .

        .. todo:: :func:`.to_pandasdmx` does not currently support non :attr:`.builtin` sources.
        """
        return pandasdmx.source.sources[self.pandasdmx_id]

    def to_pandasdmx_request(self) -> pandasdmx.Request:
        """
        Convert the :class:`.DataSource` to a :class:`pandasdmx.Request` client.

        :return: The :class:`pandasdmx.Request`\\ .
        """
        return pandasdmx.Request(source=self.to_pandasdmx_source().id)

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

    def __str__(self):
        return self.pandasdmx_id


class DataFlow(models.Model):
    """
    A :class:`.DataFlow` is a object containing the metadata of a SDMX data set.

    See `this page <https://ec.europa.eu/eurostat/online-help/redisstat-admin/en/TECH_A_main/>`_ for more details.
    """

    datasource_id = models.ForeignKey(
        DataSource,
        help_text="The DataSource this object belongs to.",
        on_delete=models.RESTRICT,
    )
    sdmx_id = models.CharField(
        "SDMX id",
        help_text="Internal string used in SDMX communication to identify the DataFlow.",
        max_length=64,
    )
    last_update = models.DateTimeField(
        "Last updated",
        help_text="The datetime at which the properties of this DataFlow were last updated.",
        auto_now=True,
    )

    description = models.CharField(
        "DataFlow description",
        help_text="Natural language description of the DataFlow.",
        max_length=8192,
    )

    def __str__(self):
        return f"{self.datasource_id} | {self.sdmx_id} | {self.description}"


class Project(models.Model):
    """
    A research :class:`.Project` is a work which may use zero or more :class:`.DataSource`\\ s to prove or disprove an
    hypothesis.
    """

    name = models.CharField(
        "Project name",
        help_text="The display name of the project.",
        max_length=512,
    )
    description = models.CharField(
        "Project description",
        help_text="A brief description of the project, to be displayed inthe overview.",
        max_length=8192,
    )

    sources = models.ManyToManyField(
        DataSource,
        help_text="The sources used by this project.",
        related_name="used_in",
        blank=True,
    )

    def __str__(self):
        return self.name

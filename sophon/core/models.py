from django.db import models


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

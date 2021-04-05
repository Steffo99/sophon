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
        null=True,
    )

    def __str__(self):
        return self.name

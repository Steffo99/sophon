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

    pandasdmx_id = models.CharField("Internal pandasdmx source id", max_length=16, primary_key=True)
    builtin = models.BooleanField("If the source is builtin in pandasdmx")

    settings = models.JSONField("Source info to pass to pandasdmx if the source is not builtin")


class Project(models.Model):
    """
    A research :class:`.Project` is a work which may use zero or more :class:`.DataSource`\\ s to prove or disprove an
    hypothesis.
    """
    name = models.CharField("Project name", max_length=512)
    description = models.CharField("Project description", max_length=8192)

    sources = models.ManyToManyField(DataSource, related_name="used_in")

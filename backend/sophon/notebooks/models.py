from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from sophon.core.models import SophonGroupModel, ResearchGroup
from sophon.projects.models import ResearchProject


class Notebook(SophonGroupModel):
    """
    A :class:`.Notebook` is a database representation of a Docker container running a JupyterLab instance.
    """

    slug = models.SlugField(
        "Slug",
        help_text="Unique alphanumeric string which identifies the project.",
        max_length=64,
        primary_key=True,
    )

    project = models.ForeignKey(
        ResearchProject,
        help_text="The project this notebook belongs to.",
        on_delete=models.CASCADE,
    )

    name = models.CharField(
        "Name",
        help_text="The display name of the notebook.",
        max_length=512,
    )

    locked_by = models.ForeignKey(
        User,
        help_text="The user who locked this notebook. If null, the notebook is unlocked.",
        on_delete=models.SET_NULL,
        null=True,
    )

    container_image = models.CharField(
        "Container image",
        help_text="The Docker image to run for this notebook.",
        choices=(
            ("jupyter/base-notebook", "Base"),
            ("jupyter/minimal-notebook", "Python"),
            ("jupyter/scipy-notebook", "Python (Scientific)"),
            ("jupyter/tensorflow-notebook", "Python (Tensorflow)"),
            ("jupyter/r-notebook", "Python + R"),
            ("jupyter/pyspark-notebook", "Python (Scientific) + Apache Spark"),
            ("jupyter/all-spark-notebook", "Python (Scientific) + Scala + R + Apache Spark"),
        ),
        max_length=256,
    )

    container_id = models.CharField(
        "Container ID",
        help_text="The id of the Docker container running this notebook. If null, the notebook is not running.",
        null=True,
        max_length=256,
    )

    volume_id = models.CharField(
        "Volume ID",
        help_text="The id of the Docker volume containing the data of this notebook. If null, the notebook doesn't currently have a volume, and will be created"
                  " the next time the container is started.",
        null=True,
        max_length=256,
    )

    port = models.IntegerField(
        "Local port number",
        help_text="The port number of the local machine at which the container is available. If null, the notebook is not running.",
        null=True,
        validators=[
            MinValueValidator(49152),
            MaxValueValidator(65535),
        ]
    )

    def get_group(self) -> ResearchGroup:
        return self.project.group

    @classmethod
    def get_fields(cls) -> set[str]:
        return {
            "slug",
            "project",
            "name",
            "locked_by",
            "container_image",
        }

    @classmethod
    def get_editable_fields(cls) -> set[str]:
        return {
            "name",
            "locked_by",
        }

    @classmethod
    def get_administrable_fields(cls) -> set[str]:
        return {
            "project",
            "container_image",
        }

    @classmethod
    def get_creation_fields(cls) -> set[str]:
        return {
            "slug",
            "project",
            "name",
            "container_image",
        }

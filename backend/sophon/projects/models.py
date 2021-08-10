from django.db import models
from sophon.core.models import SophonGroupModel, ResearchGroup


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

    group = models.ForeignKey(
        ResearchGroup,
        help_text="The group this project belongs to.",
        on_delete=models.CASCADE,
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

    def get_group(self) -> ResearchGroup:
        return self.group

    @classmethod
    def get_fields(cls) -> set[str]:
        return {
            "slug",
            "group",
            "name",
            "description",
            "visibility",
        }

    @classmethod
    def get_editable_fields(cls) -> set[str]:
        return {
            "name",
            "description",
        }

    @classmethod
    def get_administrable_fields(cls) -> set[str]:
        return {
            "group",
            "visibility",
        }

    @classmethod
    def get_creation_fields(cls) -> set[str]:
        return {
            "slug",
            "group",
            "name",
            "description",
            "visibility",
        }

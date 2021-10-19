from django.core.validators import ValidationError
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _


@deconstructible
class DisallowedValuesValidator:
    def __init__(self, values):
        self.values = values

    def __call__(self, value):
        if value in self.values:
            raise ValidationError(
                _("%(value)s is a disallowed value."),
                params={"value": value},
            )

from django.db import models
from django.utils.translation import gettext_lazy as _

from ..subjects.models import Subjects


class SubjectSet(models.Model):
    title = models.CharField(_("Subject Set Name"), max_length=255, unique=True)
    subjects = models.ManyToManyField(Subjects, related_name='subject_sets', verbose_name=_("Subjects"))

    class Meta:
        verbose_name = _("Сборник Предметов")
        verbose_name_plural = _("Сборники Предметов")

    def __str__(self):
        return self.title



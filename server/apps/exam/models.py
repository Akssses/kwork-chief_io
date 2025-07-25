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


class Student(models.Model):
    parents_names = models.CharField(_("ФИО родителя"), max_length=255, blank=True, null=True)
    student_name = models.CharField(_("Имя ученика"), max_length=255, blank=True, null=True)
    phone_number = models.CharField(_("Номер телефона"), max_length=255, blank=True, null=True)
    school_class = models.CharField(_("Класс"), max_length=255, blank=True, null=True)
    region = models.CharField(_("Регион"), max_length=255, blank=True, null=True)
    language = models.CharField(_("Язык"), max_length=255, blank=True, null=True)
    points = models.IntegerField(_("Баллы"), blank=True, null=True)

    class Meta:
        verbose_name = _("Ученик")
        verbose_name_plural = _("Ученики")

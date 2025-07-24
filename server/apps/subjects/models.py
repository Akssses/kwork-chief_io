from django.db import models
from django.utils.translation import gettext_lazy as _

class Subjects(models.Model):
    class TypeChoices(models.TextChoices):
        EXACT = 'Exact', _('Точная наука')
        NATURAL = 'Natural', _('Естественная наука')

    class SubjectTypeChoices(models.TextChoices):
        BASIC = 'Основной', _('Основной предмет')
        PROFILE = 'Профильный', _('Профильный предмет')

    title = models.CharField(
        verbose_name=_("Название предмета"),
        max_length=255
    )
    type = models.CharField(
        verbose_name=_("Тип"),
        max_length=10,
        choices=TypeChoices.choices
    )
    subject_type = models.CharField(
        verbose_name=_("Тип предмета"),
        max_length=20,
        choices=SubjectTypeChoices.choices
    )

    class Meta:
        verbose_name = _("Предмет")
        verbose_name_plural = _("Предметы")
        ordering = ['title']

    def __str__(self):
        return f"{self.title} ({self.get_type_display()})"

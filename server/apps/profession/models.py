from django.db import models

from ..exam.models import SubjectSet


class Profession(models.Model):
    subject_set = models.ForeignKey(SubjectSet, verbose_name="Направление", max_length=255, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, null = True, blank = True, verbose_name="Название")
    cutoff = models.IntegerField(null=True, blank=True, verbose_name="Минимум для поступления")

    class Meta:
        verbose_name = "Профессия"
        verbose_name_plural = "Профессии"
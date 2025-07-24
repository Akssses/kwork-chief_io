from django.db import models
from django.utils.translation import gettext_lazy as _
from ..subjects.models import Subjects

class Question(models.Model):
    question_ru = models.TextField(
        verbose_name=_("Вопрос (рус)"),
        blank=True,
        null=True
    )
    question_kz = models.TextField(
        verbose_name=_("Сұрақ (қаз)"),
        blank=True,
        null=True
    )
    question_image_ru = models.ImageField(
        verbose_name=_("Изображение (рус)"),
        upload_to='images/questions/ru/',
        blank=True,
        null=True
    )
    question_image_kz = models.ImageField(
        verbose_name=_("Сурет (қаз)"),
        upload_to='images/questions/kz/',
        blank=True,
        null=True
    )
    subject = models.ForeignKey(Subjects,
        on_delete=models.CASCADE,
        related_name='questions',
        verbose_name=_("Предмет")
    )

    class Meta:
        verbose_name = _("Вопрос")
        verbose_name_plural = _("Вопросы")
        ordering = ['id']

    def __str__(self):
        return self.question_ru[:50] + "..."

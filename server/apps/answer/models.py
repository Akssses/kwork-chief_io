from django.db import models
from django.utils.translation import gettext_lazy as _
from ..question.models import Question

class Answer(models.Model):
    answer_ru = models.TextField(
        verbose_name=_("Ответ (рус)"),
        blank=True,
        null=True
    )
    answer_kz = models.TextField(
        verbose_name=_("Жауап (қаз)"),
        blank=True,
        null=True
    )
    answer_image_ru = models.ImageField(
        verbose_name=_("Изображение (рус)"),
        upload_to='images/answers/ru/',
        blank=True,
        null=True
    )
    answer_image_kz = models.ImageField(
        verbose_name=_("Сурет (қаз)"),
        upload_to='images/answers/kz/',
        blank=True,
        null=True
    )
    is_correct = models.BooleanField(
        verbose_name=_("Правильный ответ"),
        default=False
    )
    question = models.ForeignKey(Question,
        on_delete=models.CASCADE,
        related_name='answers',
        verbose_name=_("Вопрос")
    )

    class Meta:
        verbose_name = _("Ответ")
        verbose_name_plural = _("Ответы")
        ordering = ['id']

    def __str__(self):
        return self.answer_ru[:50] + "..."

from django.contrib import admin
from .models import Question
from ..answer.models import Answer

class AnswerInline(admin.StackedInline):
    model = Answer
    extra = 0
    max_num = 10
    verbose_name = "Ответ"
    verbose_name_plural = "Ответы"
    fk_name = "question"


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "question_ru", "subject")
    search_fields = ("question_ru", "question_kz")
    list_filter = ("subject",)
    inlines = [AnswerInline]

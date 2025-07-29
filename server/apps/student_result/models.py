from django.db import models
from django.utils.timezone import now

class StudentResult(models.Model):
    parent_name = models.CharField("Имя родителя", max_length=255)
    student_name = models.CharField("Имя ученика", max_length=255)
    phone_number = models.CharField("Номер телефона", max_length=20)
    language = models.CharField("Язык", max_length=50)

    history_score = models.IntegerField("Баллы по Истории")
    math_literacy_score = models.IntegerField("Баллы по Математической грамотности")
    reading_literacy_score = models.IntegerField("Баллы по Грамотности чтения")

    profile_subject_1_name = models.CharField("Название профильного предмета 1", max_length=100)
    profile_subject_1_score = models.IntegerField("Баллы по профильному предмету 1")
    profile_subject_2_name = models.CharField("Название профильного предмета 2", max_length=100)
    profile_subject_2_score = models.IntegerField("Баллы по профильному предмету 2")

    direction = models.CharField("Направление", max_length=255)
    score = models.IntegerField("Общий балл")
    score_percentage = models.IntegerField("Процент от максимального балла", editable=False)

    date_time = models.DateTimeField("Дата и время", default=now)
    result_url = models.URLField("Ссылка на результат", max_length=300, editable=False, blank=True, null=True)

    def save(self, *args, **kwargs):
        self.score_percentage = round((self.score / 140) * 100)
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.result_url = f"http://localhost:3000/result/{self.pk}"
            super().save(update_fields=['result_url'])

    def __str__(self):
        return f"{self.student_name} ({self.parent_name}) - {self.score} баллов"

    class Meta:
        verbose_name = "Результат ученика"
        verbose_name_plural = "Результаты учеников"

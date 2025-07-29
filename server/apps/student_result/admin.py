from django.contrib import admin
from .models import StudentResult
import pytz

@admin.register(StudentResult)
class StudentResultAdmin(admin.ModelAdmin):
    list_display = (
        "student_name",
        "parent_name",
        "score",
        "score_percentage",
        "formatted_date_time",
        "get_result_url",
    )
    readonly_fields = ("score_percentage", "date_time", "get_result_url")

    def formatted_date_time(self, obj):
        local_time = obj.date_time.astimezone(pytz.timezone("Asia/Almaty"))
        return local_time.strftime("%d.%m.%Y, %H:%M:%S")

    def get_result_url(self, obj):
        return obj.result_url
    get_result_url.short_description = "Ссылка на результат"

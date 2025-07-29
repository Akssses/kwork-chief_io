from django.contrib import admin
from .models import StudentResult

@admin.register(StudentResult)
class StudentResultAdmin(admin.ModelAdmin):
    list_display = ("student_name", "parent_name", "score", "score_percentage", "formatted_date_time")
    readonly_fields = ("score_percentage", "date_time")

    def formatted_date_time(self, obj):
        return obj.date_time.strftime("%d.%m.%Y, %H:%M:%S")
    formatted_date_time.short_description = "Дата и время"

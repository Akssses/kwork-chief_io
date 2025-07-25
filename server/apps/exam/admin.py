from django.contrib import admin
from .models import SubjectSet, Student

admin.site.register(SubjectSet)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("student_name", "parents_names", "phone_number", "school_class", "region", "language", "points")
    search_fields = ("student_name", "parents_names", "phone_number")
    list_filter = ("region", "language", "school_class")
    fieldsets = (
        ("Информация о студенте", {
            "fields": ("student_name", "school_class", "language", "points")
        }),
        ("Контактные данные", {
            "fields": ("parents_names", "phone_number", "region")
        }),
    )

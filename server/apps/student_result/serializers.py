from rest_framework import serializers
from .models import StudentResult


class StudentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentResult
        fields = "__all__"
        read_only_fields = ("score_percentage", "date_time", "result_url")


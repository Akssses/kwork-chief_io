from rest_framework import serializers
from .models import StudentResult
from ..exam.serializers import SubjectSetSerializer


class StudentResultSerializer(serializers.ModelSerializer):
    subject_set = SubjectSetSerializer(read_only=True)

    class Meta:
        model = StudentResult
        fields = "__all__"
        read_only_fields = ("score_percentage", "date_time", "result_url")



class StudentResultCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentResult
        fields = "__all__"
        read_only_fields = ("score_percentage", "date_time", "result_url")

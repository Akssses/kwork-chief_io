from django.urls import path
from .views import QuestionsBySubjectSetAPIView, SubjectSetListAPIView, StudentCreateAPIView

urlpatterns = [
    path('questions/', QuestionsBySubjectSetAPIView.as_view(), name='questions-by-subject-set'),
    path('subject_set_list/', SubjectSetListAPIView.as_view(), name='subject-set-list'),

    path("students/create/", StudentCreateAPIView.as_view(), name="student-create"),
]

from django.urls import path
from .views import QuestionsBySubjectSetAPIView

urlpatterns = [
    path('questions/', QuestionsBySubjectSetAPIView.as_view(), name='questions-by-subject-set'),
]

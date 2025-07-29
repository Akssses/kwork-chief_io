from django.urls import path
from .views import StudentResultCreateView

urlpatterns = [
    path('create/', StudentResultCreateView.as_view(), name='student-result-create'),
]

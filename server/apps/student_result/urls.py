from django.urls import path
from .views import StudentResultCreateView, StudentResultDetailView

urlpatterns = [
    path('create/', StudentResultCreateView.as_view(), name='student-result-create'),
    path('result/<int:pk>/', StudentResultDetailView.as_view(), name='student-result-detail'),

]

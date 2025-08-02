from django.urls import path
from .views import AdmissionChanceView

urlpatterns = [
    path('admission_chance/', AdmissionChanceView.as_view(), name='admission-chance')
]

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import StudentResultSerializer, StudentResultCreateSerializer
from .models import StudentResult
from django.shortcuts import get_object_or_404


class StudentResultCreateView(APIView):
    serializer_class = StudentResultCreateSerializer

    def post(self, request):
        serializer = StudentResultCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentResultDetailView(APIView):
    def get(self, request, pk):
        result = get_object_or_404(StudentResult, pk=pk)
        serializer = StudentResultSerializer(result)
        return Response(serializer.data, status=status.HTTP_200_OK)

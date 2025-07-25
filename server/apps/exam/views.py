from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import SubjectSet
from .serializers import SubjectWithQuestionsSerializer, SubjectSetSerializer, StudentSerializer


class QuestionsBySubjectSetAPIView(APIView):
    def get(self, request):
        subject_set_id = request.query_params.get('subject_set')
        lang = request.query_params.get('lang', 'ru')

        if not subject_set_id or lang not in ['ru', 'kz']:
            return Response({'detail': 'Неверные параметры запроса'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            subject_set = SubjectSet.objects.prefetch_related('subjects__questions__answers').get(id=subject_set_id)
        except SubjectSet.DoesNotExist:
            return Response({'detail': 'Сборник не найден'}, status=status.HTTP_404_NOT_FOUND)

        subjects = subject_set.subjects.all()
        serializer = SubjectWithQuestionsSerializer(subjects, many=True, context={'lang': lang})
        return Response(serializer.data, status=status.HTTP_200_OK)


class SubjectSetListAPIView(ListAPIView):
    queryset = SubjectSet.objects.all()
    serializer_class = SubjectSetSerializer


class StudentCreateAPIView(APIView):
    serializer_class = StudentSerializer

    def post(self, request):
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

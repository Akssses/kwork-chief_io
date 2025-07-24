from rest_framework import serializers
from ..question.models import Question
from ..answer.models import Answer
from ..subjects.models import Subjects


class AnswerSerializer(serializers.ModelSerializer):
    text = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = ['id', 'text', 'image', 'is_correct']

    def get_text(self, obj):
        lang = self.context.get('lang', 'ru')
        return getattr(obj, f'answer_{lang}', '')

    def get_image(self, obj):
        lang = self.context.get('lang', 'ru')
        image = getattr(obj, f'answer_image_{lang}', None)
        return image.url if image else None


class QuestionWithAnswersSerializer(serializers.ModelSerializer):
    text = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'image', 'answers']

    def get_text(self, obj):
        lang = self.context.get('lang', 'ru')
        return getattr(obj, f'question_{lang}', '')

    def get_image(self, obj):
        lang = self.context.get('lang', 'ru')
        image = getattr(obj, f'question_image_{lang}', None)
        return image.url if image else None


class SubjectWithQuestionsSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Subjects
        fields = ['id', 'title', 'type', 'subject_type', 'questions']

    def get_questions(self, subject):
        questions = subject.questions.all().prefetch_related('answers')
        return QuestionWithAnswersSerializer(questions, many=True, context=self.context).data

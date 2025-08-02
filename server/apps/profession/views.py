from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import random

from .models import Profession
from ..exam.models import SubjectSet

class AdmissionChanceView(APIView):
    def get(self, request):
        try:
            subject_set_id = request.query_params.get("subject_set_id")
            score = float(request.query_params.get("score"))

            if not subject_set_id or not score:
                return Response({"error": "subject_set_id и score обязательны"}, status=status.HTTP_400_BAD_REQUEST)

            professions = Profession.objects.filter(subject_set_id=subject_set_id)
            result = []

            for profession in professions:
                if not profession.cutoff:
                    continue

                cutoff = profession.cutoff
                chance = (score / cutoff) * 100
                chance = min(max(chance, 1), 94)

                boost_percent = random.uniform(0.3, 0.4)
                boosted_score = score * (1 + boost_percent)
                boosted_chance = (boosted_score / cutoff) * 100
                boosted_chance = min(max(boosted_chance, 1), 94)

                result.append({
                    "profession": profession.title,
                    "chance_without_preparation": {
                        "percent": round(chance),
                        "level": self.get_level(chance)
                    },
                    "chance_with_preparation": {
                        "percent": round(boosted_chance),
                        "level": self.get_level(boosted_chance)
                    }
                })

            return Response(result)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_level(self, chance):
        if chance < 40:
            return "Низкий шанс"
        elif chance < 70:
            return "Средний шанс"
        return "Высокий шанс"

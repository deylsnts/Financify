from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Transaction
from .serializers import TransactionSerializer
from rest_framework.permissions import IsAuthenticated

class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        income = Transaction.objects.filter(
            user=request.user,
            type="income"
        ).aggregate(total=Sum('amount'))['total'] or 0

        expenses = Transaction.objects.filter(
            user=request.user,
            type="expense"
        ).aggregate(total=Sum('amount'))['total'] or 0

        return Response({
            "income": income,
            "expenses": expenses,
            "balance": income - expenses
        })

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import openai

class AIInsightsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Make sure to set OPENAI_API_KEY in your settings.py
            openai.api_key = settings.OPENAI_API_KEY
            
            data = request.data
            
            # Construct a prompt using the data sent from the frontend
            prompt = f"""
            Analyze this financial data and give 1 short paragraph of personalized, actionable advice:
            - Total Income: {data.get('total_income')}
            - Total Expenses: {data.get('total_expense')}
            - Top Spending Category: {data.get('top_category')}
            
            Recent Transactions:
            {data.get('recent_transactions')}
            
            Focus on specific ways to save money based on the top category. Keep it friendly.
            """

            # Call OpenAI API (using GPT-3.5-turbo or GPT-4)
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful financial advisor."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150
            )
            
            insight = response.choices[0].message.content
            return Response({"insight": insight})

        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=500)


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
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import re

# For email verification
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.shortcuts import redirect
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
import os

# Security: Limit login/register attempts to 10 per minute per IP
class AuthRateThrottle(AnonRateThrottle):
    rate = '10/min'

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([AuthRateThrottle])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    
    # 1. Check for required fields
    if not all([username, email, password]):
        return Response({'error': 'Username, email, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    # 2. Username validation
    if len(username) < 4:
        return Response({'error': 'Username must be at least 4 characters long.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'A user with that username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    # 3. Email validation
    if not re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email):
        return Response({'error': 'Please enter a valid email address.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email__iexact=email).exists():
        return Response({'error': 'A user with that email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        
    # 4. Password strength validation
    if len(password) < 8:
        return Response({'error': 'Password must be at least 8 characters long.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Create user but set as inactive
        user = User.objects.create_user(username=username, email=email, password=password, is_active=False)

        # Email verification logic
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Build activation link
        frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
        activation_link = f'{frontend_url}/api/activate/{uid}/{token}/'

        # Email content
        mail_subject = 'Activate your Financify account.'
        message = render_to_string('account_activation_email.html', {
            'user': user,
            'activation_link': activation_link,
        })
        
        email_message = EmailMessage(mail_subject, message, to=[email])
        email_message.send()

        return Response({'message': 'Registration successful! Please check your email to activate your account.'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Error during email sending: {e}")
        return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
@throttle_classes([AuthRateThrottle])
def activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    # For production, use an environment variable for the frontend URL
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        # Redirect to frontend login page with a success message
        return redirect(f'{frontend_url}/?activated=true')
    else:
        # Redirect to an invalid link page on the frontend
        return redirect(f'{frontend_url}/?activated=false')

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import anthropic

# Security: Limit AI requests to 5 per minute per user to save costs
class AIRateThrottle(UserRateThrottle):
    rate = '5/min'

class AIInsightsView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AIRateThrottle]

    def post(self, request):
        try:
            client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

            data = request.data

            # Security: Sanitize and truncate input to prevent large context attacks
            # Limit the size of transactions string to ~2000 chars
            raw_transactions = str(data.get('recent_transactions', ''))[:2000]

            # Construct a prompt using the data sent from the frontend
            prompt = f"""
            Analyze this financial data and give 1 short paragraph of personalized, actionable advice:
            - Total Income: {data.get('total_income')}
            - Total Expenses: {data.get('total_expense')}
            - Top Spending Category: {data.get('top_category')}

            Recent Transactions:
            {raw_transactions}

            Focus on specific ways to save money based on the top category. Keep it friendly.
            """

            response = client.messages.create(
                model="claude-opus-5",
                max_tokens=300,
                system="You are a helpful financial advisor.",
                messages=[{"role": "user", "content": prompt}],
            )

            insight = next(
                (block.text for block in response.content if block.type == "text"),
                "",
            )
            return Response({"insight": insight})

        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=500)

from django.urls import path
from .views import TransactionListCreateView, TransactionDetailView
from .views import DashboardSummaryView
from .views import AIInsightsView
from . import views

urlpatterns = [
    path('transactions/', TransactionListCreateView.as_view()),
    path('transactions/<int:pk>/', TransactionDetailView.as_view()),
    path('dashboard/', DashboardSummaryView.as_view()),
    path('register/', views.register, name='register'),
    path('ai-insights/', AIInsightsView.as_view(), name='ai-insights'),
]

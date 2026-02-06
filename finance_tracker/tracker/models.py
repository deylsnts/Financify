from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    CATEGORY_CHOICES = [
        ("income", "Income"),
        ("housing_shelter", "Housing/Shelter"),
        ("transportation", "Transportation"),
        ("shopping_personal_care", "Shopping/Personal Care"),
        ("health_medical", "Health & Medical"),
        ("entertainment", "Entertainment"),
        ("debt_finance", "Debt & Finance"),
        ("savings_investments", "Savings & Investments"),
    ]

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default="income"
    )
    type = models.CharField(max_length=10)
    date = models.DateField()

    def __str__(self):
        return self.title

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from .models import Wallet


User = get_user_model()


@receiver(post_save, sender=User)
def create_student_wallet(sender, instance, created, **kwargs):
    if created and instance.role == "STUDENT":
        Wallet.objects.create(
            student=instance,
            balance=0,
        )
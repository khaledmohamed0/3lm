from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        TEACHER = "TEACHER", "Teacher"
        STUDENT = "STUDENT", "Student"

    class GradeLevel(models.TextChoices):
        PRIMARY = "PRIMARY", "Primary"
        PREP = "PREP", "Preparatory"
        SECONDARY = "SECONDARY", "Secondary"
        UNIVERSITY = "UNIVERSITY", "University"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT,
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )

    grade_level = models.CharField(
        max_length=20,
        choices=GradeLevel.choices,
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"{self.username} ({self.role})"
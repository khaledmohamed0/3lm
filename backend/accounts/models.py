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
    
    class AcademicYear(models.TextChoices):

        
        GRADE_1_PRIMARY = "GRADE_1_PRIMARY", "أولى ابتدائي"
        GRADE_2_PRIMARY = "GRADE_2_PRIMARY", "تانية ابتدائي"
        GRADE_3_PRIMARY = "GRADE_3_PRIMARY", "تالتة ابتدائي"
        GRADE_4_PRIMARY = "GRADE_4_PRIMARY", "رابعة ابتدائي"
        GRADE_5_PRIMARY = "GRADE_5_PRIMARY", "خامسة ابتدائي"
        GRADE_6_PRIMARY = "GRADE_6_PRIMARY", "سادسة ابتدائي"

        GRADE_1_PREPARATORY = "GRADE_1_PREPARATORY", "أولى إعدادي"
        GRADE_2_PREPARATORY = "GRADE_2_PREPARATORY", "تانية إعدادي"
        GRADE_3_PREPARATORY = "GRADE_3_PREPARATORY", "تالتة إعدادي"

        GRADE_1_SECONDARY = "GRADE_1_SECONDARY", "أولى ثانوي"
        GRADE_2_SECONDARY = "GRADE_2_SECONDARY", "تانية ثانوي"
        GRADE_3_SECONDARY = "GRADE_3_SECONDARY", "تالتة ثانوي"

        UNIVERSITY = "UNIVERSITY", "جامعة"



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

    academic_year = models.CharField(
        max_length=30,
        choices=AcademicYear.choices,
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"{self.username} ({self.role})" 
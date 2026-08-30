from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "role",
        "academic_year",
        "grade_level",
        "is_active",
    )

    list_filter = (
        "role",
        "grade_level",
        "academic_year",
        "is_active",
    )

    search_fields = (
        "username",
        "email",
        "first_name",
        "last_name",
        "phone_number",
    )

    fieldsets = UserAdmin.fieldsets + (
        (
            "KMG Information",
            {
                "fields": (
                    "phone_number",
                    "role",
                    "grade_level",
                    "academic_year",
                ),
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "KMG Information",
            {
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "phone_number",
                    "role",
                    "grade_level",
                    "academic_year",
                ),
            },
        ),
    )
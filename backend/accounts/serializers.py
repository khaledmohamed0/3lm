from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):

    fullName = serializers.CharField(write_only=True)

    phone = serializers.CharField(
        write_only=True,
        required=True,
        max_length=20
    )

    gradeLevel = serializers.ChoiceField(
        choices=[
            ("primary", "Primary"),
            ("prep", "Preparatory"),
            ("secondary", "Secondary"),
            ("university", "University"),
        ],
        write_only=True,
        required=False,
        allow_null=True,
    )

    role = serializers.ChoiceField(
        choices=[
            ("student", "Student"),
            ("teacher", "Teacher"),
        ],
        write_only=True,
        required=True,
    )

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User

        fields = [
            "fullName",
            "email",
            "phone",
            "password",
            "gradeLevel",
            "role",
        ]

    def validate_email(self, value):
        value = value.lower().strip()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "This email is already registered."
            )

        return value


    def validate_username(self, value):
        value = value.strip()

        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )

        return value

    def validate(self, attrs):

        role = attrs.get("role")
        grade_level = attrs.get("gradeLevel")

        # Student must select a grade level
        if role == "student" and not grade_level:
            raise serializers.ValidationError({
                "gradeLevel": "Grade level is required for students."
            })

        # Teacher doesn't need a grade level
        if role == "teacher":
            attrs["gradeLevel"] = None

        return attrs

    def create(self, validated_data):

        full_name = validated_data.pop("fullName").strip()
        phone = validated_data.pop("phone")
        grade_level = validated_data.pop("gradeLevel", None)
        role = validated_data.pop("role")
        password = validated_data.pop("password")

        name_parts = full_name.split()

        first_name = name_parts[0]
        last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=first_name,
            last_name=last_name,
            phone_number=phone,
            password=password,
            role=(
                User.Role.STUDENT
                if role == "student"
                else User.Role.TEACHER
            ),
            grade_level=(
                User.GradeLevel.PRIMARY
                if grade_level == "primary"
                else User.GradeLevel.PREP
                if grade_level == "prep"
                else User.GradeLevel.SECONDARY
                if grade_level == "secondary"
                else User.GradeLevel.UNIVERSITY
                if grade_level == "university"
                else None
            ),
        )

        return user




class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "role",
            "grade_level",
        ]
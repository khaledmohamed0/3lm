from rest_framework import serializers

from .models import (
    Course,
    Lesson,
    Enrollment,
    LessonProgress,
    Exam,
    ExamAttempt,
    ExamQuestion,
    LessonQuestion,
)

class LessonSerializer(serializers.ModelSerializer):

    exam_id = serializers.IntegerField(
        source="exam.id",
        read_only=True,
        allow_null=True,
    )

    lesson_pdf = serializers.URLField(
        source="lesson_pdf_url",
        read_only=True,
        allow_null=True,
    )

    assignment_pdf = serializers.URLField(
        source="assignment_pdf_url",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = Lesson

        fields = [
            "id",
            "course",
            "title",
            "description",

            "video_url",
            "bunny_video_id",
            "bunny_solution_video_id",

            "lesson_pdf",
            "assignment_pdf",

            "order",
            "is_published",
            "exam_id",
        ]

        read_only_fields = [
            "bunny_video_id",
            "bunny_solution_video_id",
            "lesson_pdf",
            "assignment_pdf",
        ]


class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    teacher_name = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()

    category_display = serializers.CharField(
        source="get_category_display",
        read_only=True
    )

    academic_year_display = serializers.CharField(
        source="get_academic_year_display",
        read_only=True
    )

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "thumbnail",
            "price",
            "category",
            "category_display",
            "academic_year",
            "academic_year_display",
            "teacher_name",
            "is_published",
            "lessons",
            "created_at",
            "updated_at",
            "is_enrolled",
        ]

    def get_is_enrolled(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return False

        return obj.enrollments.filter(
            student=request.user
        ).exists()

    def get_teacher_name(self, obj):
        if obj.teacher:
            return obj.teacher.get_full_name() or obj.teacher.username
        return "مدرس المنصة"




class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student",
            "course",
            "enrolled_at",
        ]
        read_only_fields = ["student"]


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = [
            "id",
            "lesson",
            "video_completed",
            "lesson_pdf_downloaded",
            "assignment_downloaded",
            "lesson_completed",
            "completed_at",
        ]
        read_only_fields = [
            "completed_at",
        ]




class ExamAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamAttempt
        fields = [
            "id",
            "exam",
            "score",
            "passed",
            "completed_at",
        ]
        read_only_fields = [
            "passed",
            "completed_at",
        ]

class ExamQuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExamQuestion

        fields = [
            "id",
            "question",
            "question_image",
            "option_a",
            "option_b",
            "option_c",
            "option_d",
            "correct_answer",
            "order",
        ]


class TeacherExamCreateSerializer(serializers.ModelSerializer):

    questions = ExamQuestionSerializer(
        many=True,
        required=False
    )

    class Meta:
        model = Exam
        fields = [
            "id",
            "lesson",
            "title",
            "passing_score",
            "time_limit",
            "is_published",
            "questions",
        ]

    def create(self, validated_data):

        questions_data = validated_data.pop(
            "questions",
            []
        )

        exam = Exam.objects.create(
            **validated_data
        )

        for question_data in questions_data:

            ExamQuestion.objects.create(
                exam=exam,
                **question_data
            )

        return exam


class ExamSerializer(serializers.ModelSerializer):

    questions = ExamQuestionSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Exam

        fields = [
            "id",
            "lesson",
            "title",
            "passing_score",
            "time_limit",
            "is_published",
            "questions",
        ]

class TeacherCourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = [
            "id",
            "teacher",
            "title",
            "description",
            "price",
            "thumbnail",
            "is_published",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "teacher",
            "created_at",
            "updated_at",
        ]


class LessonQuestionSerializer(serializers.ModelSerializer):

    student_name = serializers.SerializerMethodField()

    class Meta:
        model = LessonQuestion

        fields = [
            "id",
            "lesson",
            "student",
            "student_name",
            "question",
            "answer",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "lesson",
            "student",
            "student_name",
            "answer",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj):
        return (
            obj.student.get_full_name()
            or obj.student.username
        )
from rest_framework import serializers

from .models import (
    Course,
    Lesson,
    Enrollment,
    LessonProgress,
    Exam,
    ExamAttempt,
    ExamQuestion,
)

class LessonSerializer(serializers.ModelSerializer):

    exam_id = serializers.IntegerField(
        source="exam.id",
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
            "lesson_pdf",
            "assignment_pdf",
            "order",
            "is_published",
            "exam_id",
        ]

        read_only_fields = [
            "bunny_video_id",
        ]


class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "thumbnail",
            "price",
            "is_published",
            "lessons",
            "created_at",
            "updated_at",
        ]





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
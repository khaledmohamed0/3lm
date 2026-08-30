from django.contrib import admin

from .models import (
    Course,
    Lesson,
    Enrollment,
    LessonProgress,
    Exam,
    ExamAttempt,
    Wallet,
    WalletTransaction,
    ExamQuestion,
    TodoItem,
    TeacherNews,
    LiveLesson,
)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "is_published",
        "created_at",
    )

    list_filter = (
        "is_published",
    )

    search_fields = (
        "title",
        "description",
    )


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "course",
        "order",
        "is_published",
    )

    list_filter = (
        "course",
        "is_published",
    )

    search_fields = (
        "title",
        "description",
        "course__title",
    )

    ordering = (
        "course",
        "order",
    )


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "course",
        "enrolled_at",
    )

    list_filter = (
        "course",
    )

    search_fields = (
        "student__username",
        "student__email",
        "course__title",
    )


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "lesson",
        "video_completed",
        "lesson_pdf_downloaded",
        "assignment_downloaded",
        "lesson_completed",
        "completed_at",
    )

    list_filter = (
        "video_completed",
        "lesson_pdf_downloaded",
        "assignment_downloaded",
        "lesson_completed",
    )

    search_fields = (
        "student__username",
        "student__email",
        "lesson__title",
    )


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "lesson",
        "passing_score",
        "time_limit",
        "is_published",
    )

    list_filter = (
        "is_published",
    )

    search_fields = (
        "title",
        "lesson__title",
    )


@admin.register(ExamAttempt)
class ExamAttemptAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "exam",
        "score",
        "passed",
        "completed_at",
    )

    list_filter = (
        "passed",
        "exam",
    )

    search_fields = (
        "student__username",
        "student__email",
        "exam__title",
    )

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "balance",
        "updated_at",
    )

    search_fields = (
        "student__username",
        "student__email",
    )

    ordering = (
        "-updated_at",
    )


@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "wallet",
        "transaction_type",
        "amount",
        "course",
        "created_at",
    )

    list_filter = (
        "transaction_type",
        "created_at",
    )

    search_fields = (
        "wallet__student__username",
        "wallet__student__email",
        "course__title",
    )

    ordering = (
        "-created_at",
    )


@admin.register(ExamQuestion)
class ExamQuestionAdmin(admin.ModelAdmin):
    list_display = (
        "exam",
        "order",
        "question",
        "correct_answer",
    )

    list_filter = (
        "exam",
    )

    search_fields = (
        "question",
        "exam__title",
    )

    ordering = (
        "exam",
        "order",
    )




admin.site.register(TodoItem)
admin.site.register(TeacherNews)
admin.site.register(LiveLesson)
from django.conf import settings
from django.db import models

class Course(models.Model):
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teaching_courses",
        limit_choices_to={"role": "TEACHER"},
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=0,
    null=True,
    blank=True,
)
    thumbnail = models.ImageField(
        upload_to="courses/thumbnails/",
        blank=True,
        null=True,
    )
    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return self.title




class Lesson(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="lessons",
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    video_url = models.URLField(
        blank=True,
        null=True,
    )

    lesson_pdf = models.FileField(
        upload_to="lessons/pdfs/",
        blank=True,
        null=True,
    )

    assignment_pdf = models.FileField(
        upload_to="lessons/assignments/",
        blank=True,
        null=True,
    )

    order = models.PositiveIntegerField(default=1)

    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order"]
        constraints = [
            models.UniqueConstraint(
                fields=["course", "order"],
                name="unique_lesson_order_per_course",
            )
        ]

    def __str__(self):
        return f"{self.course.title} - {self.title}"





class LessonProgress(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lesson_progress",
    )

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="student_progress",
    )

    video_completed = models.BooleanField(default=False)

    lesson_pdf_downloaded = models.BooleanField(default=False)

    assignment_downloaded = models.BooleanField(default=False)

    lesson_completed = models.BooleanField(default=False)

    completed_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "lesson"],
                name="unique_student_lesson_progress",
            )
        ]

    def __str__(self):
        return f"{self.student.username} - {self.lesson.title}"



class Exam(models.Model):
    lesson = models.OneToOneField(
        Lesson,
        on_delete=models.CASCADE,
        related_name="exam",
    )

    title = models.CharField(max_length=200)

    passing_score = models.PositiveIntegerField(
        default=50
    )

    time_limit = models.PositiveIntegerField(
        default=30,
        help_text="Time limit in minutes",
    )

    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.lesson.title} - {self.title}"



class ExamAttempt(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="exam_attempts",
    )

    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name="attempts",
    )

    score = models.PositiveIntegerField(default=0)

    passed = models.BooleanField(default=False)

    completed_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return (
            f"{self.student.username} - "
            f"{self.exam.title} - "
            f"{self.score}%"
        )





class Wallet(models.Model):
    student = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wallet",
    )

    balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.username} Wallet"

class WalletTransaction(models.Model):
    TRANSACTION_TYPES = (
        ("DEPOSIT", "Deposit"),
        ("COURSE_PURCHASE", "Course Purchase"),
        ("REFUND", "Refund"),
    )

    wallet = models.ForeignKey(
        Wallet,
        on_delete=models.CASCADE,
        related_name="transactions",
    )

    transaction_type = models.CharField(
        max_length=30,
        choices=TRANSACTION_TYPES,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions",
    )

    description = models.CharField(
        max_length=255,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.wallet.student.username} - {self.amount}"


class Enrollment(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )

    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "course"],
                name="unique_student_course",
            )
        ]

    def __str__(self):
        return f"{self.student.username} - {self.course.title}"

class ExamQuestion(models.Model):

    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name="questions",
    )

    question = models.TextField()

    question_image = models.ImageField(
        upload_to="exams/questions/",
        blank=True,
        null=True,
    )

    option_a = models.CharField(max_length=500)

    option_b = models.CharField(max_length=500)

    option_c = models.CharField(
        max_length=500,
        blank=True,
    )

    option_d = models.CharField(
        max_length=500,
        blank=True,
    )

    correct_answer = models.CharField(
        max_length=1,
        choices=[
            ("A", "A"),
            ("B", "B"),
            ("C", "C"),
            ("D", "D"),
        ],
    )

    order = models.PositiveIntegerField(
        default=1
    )

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.exam.title} - Question {self.order}"

class ExamAttemptAnswer(models.Model):
    attempt = models.ForeignKey(
        ExamAttempt,
        on_delete=models.CASCADE,
        related_name="answers",
    )

    question = models.ForeignKey(
        ExamQuestion,
        on_delete=models.CASCADE,
        related_name="attempt_answers",
    )

    selected_answer = models.CharField(
        max_length=1,
        blank=True,
    )

    is_correct = models.BooleanField(
        default=False,
    )

    def __str__(self):
        return (
            f"{self.attempt.student.username} - "
            f"{self.question} - "
            f"{self.selected_answer}"
        )
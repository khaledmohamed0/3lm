from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from datetime import timedelta
from rest_framework.response import Response
from django.db import transaction
from django.conf import settings
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from django.db.models import Count, Q
from django.contrib.auth import get_user_model
from accounts.models import User
from .services import *


from rest_framework import status


from .storage import upload_file


from .models import (
    Course,
    Lesson,
    Enrollment,
    LessonProgress,
    Exam,
    ExamAttempt,
    ExamQuestion,
    ExamAttemptAnswer,
    Wallet,
    WalletTransaction,
    TodoItem,
    TeacherNews,
    LiveLesson,
    LessonQuestion
)
from .serializers import (
    CourseSerializer,
    LessonSerializer,
    ExamSerializer,
    TeacherCourseSerializer,
    TeacherExamCreateSerializer,
    ExamQuestionSerializer,
    LessonQuestionSerializer

    
)


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


class CourseDetailView(generics.RetrieveAPIView):

    queryset = Course.objects.filter(is_published=True).select_related("teacher")
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        course = self.get_object()

        is_enrolled = course.enrollments.filter(
            student=request.user
        ).exists()

        serializer = self.get_serializer(course)

        data = serializer.data

        data["is_enrolled"] = is_enrolled

        data["teacher"] = {
            "id": course.teacher.id if course.teacher else None,
            "username": course.teacher.username if course.teacher else None,
            "first_name": course.teacher.first_name if course.teacher else "",
            "last_name": course.teacher.last_name if course.teacher else "",
        }

        if course.thumbnail:
            data["thumbnail"] = request.build_absolute_uri(
                course.thumbnail.url
            )
        else:
            data["thumbnail"] = None

        return Response(data)


        

class LessonDetailView(generics.RetrieveAPIView):
    queryset = Lesson.objects.filter(
        is_published=True
    ).select_related(
        "course"
    ).prefetch_related(
        "exam__questions"
    )

    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        lesson = self.get_object()

        if not is_lesson_unlocked(
            request.user,
            lesson
        ):
            raise PermissionDenied(
                "This lesson is locked. "
                "Complete and pass the previous lesson exam first."
            )

        lesson_serializer = self.get_serializer(lesson)

        exam = getattr(lesson, "exam", None)

        exam_data = None

        if exam and exam.is_published:

            exam_data = ExamSerializer(
                exam
            ).data

            exam_passed = ExamAttempt.objects.filter(
                student=request.user,
                exam=exam,
                passed=True,
            ).exists()

            

        return Response({
            "lesson": lesson_serializer.data,
            "exam": exam_data,
            "exam_passed": exam_passed,

        })

class EnrollCourseView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, course_id):
        course = get_object_or_404(
            Course,
            id=course_id,
            is_published=True,
        )

        if Enrollment.objects.filter(
            student=request.user,
            course=course,
        ).exists():
            return Response(
                {
                    "detail": "You are already enrolled in this course."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        wallet = Wallet.objects.select_for_update().filter(
            student=request.user
        ).first()

        if not wallet:
            return Response(
                {
                    "detail": "Wallet not found."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if wallet.balance < course.price:
            return Response(
                {
                    "detail": "Insufficient wallet balance.",
                    "course_price": str(course.price),
                    "wallet_balance": str(wallet.balance),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        wallet.balance -= course.price
        wallet.save(update_fields=["balance", "updated_at"])

        enrollment = Enrollment.objects.create(
            student=request.user,
            course=course,
        )

        WalletTransaction.objects.create(
            wallet=wallet,
            transaction_type="COURSE_PURCHASE",
            amount=course.price,
            course=course,
            description=f"Purchase of {course.title}",
        )

        return Response(
            {
                "message": "Course enrolled successfully.",
                "course": course.title,
                "amount_paid": str(course.price),
                "remaining_balance": str(wallet.balance),
                "enrollment_id": enrollment.id,
            },
            status=status.HTTP_201_CREATED,
        )

class CompleteLessonView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id):
        lesson = get_object_or_404(
            Lesson,
            id=lesson_id,
            is_published=True,
        )

        # Student must be enrolled
        if not Enrollment.objects.filter(
            student=request.user,
            course=lesson.course,
        ).exists():
            return Response(
                {
                    "detail": "You are not enrolled in this course."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        progress, created = LessonProgress.objects.get_or_create(
            student=request.user,
            lesson=lesson,
        )

        progress.video_completed = True
        progress.lesson_pdf_downloaded = True
        progress.assignment_downloaded = True
        progress.lesson_completed = True
        progress.completed_at = timezone.now()

        progress.save()

        return Response(
            {
                "message": "Lesson completed successfully.",
                "lesson_id": lesson.id,
                "lesson_completed": True,
            },
            status=status.HTTP_200_OK,
        )

class SubmitExamView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, exam_id):

        exam = get_object_or_404(
            Exam,
            id=exam_id,
            is_published=True,
        )

        # Must be enrolled
        if not Enrollment.objects.filter(
            student=request.user,
            course=exam.lesson.course,
        ).exists():

            return Response(
                {
                    "detail": "You are not enrolled in this course."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Must complete lesson first
        

        answers = request.data.get(
            "answers",
            {}
        )

        questions = exam.questions.all()

        if not questions.exists():

            return Response(
                {
                    "detail": "This exam has no questions."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        correct = 0
        total = questions.count()

        # Create attempt first
        attempt = ExamAttempt.objects.create(
            student=request.user,
            exam=exam,
            score=0,
            passed=False,
        )

        # Store every answer
        for question in questions:

            student_answer = answers.get(
                str(question.id),
                ""
            )

            is_correct = (
                student_answer.upper()
                == question.correct_answer
            )

            if is_correct:
                correct += 1

            ExamAttemptAnswer.objects.create(
                attempt=attempt,
                question=question,
                selected_answer=student_answer.upper(),
                is_correct=is_correct,
            )

        score = round(
            (correct / total) * 100
        )

        passed = (
            score >= exam.passing_score
        )

        # Update attempt
        attempt.score = score
        attempt.passed = passed
        attempt.save(
            update_fields=[
                "score",
                "passed",
            ]
        )

        return Response(
            {
                "message": (
                    "Exam passed!"
                    if passed
                    else "Exam failed."
                ),

                "exam_id": exam.id,

                "attempt_id": attempt.id,

                "score": score,

                "passing_score": (
                    exam.passing_score
                ),

                "passed": passed,
            },
            status=status.HTTP_200_OK,
        )



class StudentDashboardView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = request.user

        # Get all courses the student is enrolled in
        enrollments = Enrollment.objects.filter(
            student=student
        ).select_related("course")

        courses_data = []

        for enrollment in enrollments:
            course = enrollment.course

            # Total published lessons
            total_lessons = course.lessons.filter(
                is_published=True
            ).count()

            # Completed lessons
            completed_lessons = LessonProgress.objects.filter(
                student=student,
                lesson__course=course,
                lesson_completed=True,
            ).count()

            # Calculate progress percentage
            if total_lessons > 0:
                progress = round(
                    (completed_lessons / total_lessons) * 100
                )
            else:
                progress = 0

            # Find the next incomplete lesson
            completed_lesson_ids = LessonProgress.objects.filter(
                student=student,
                lesson__course=course,
                lesson_completed=True,
            ).values_list(
                "lesson_id",
                flat=True,
            )

            next_lesson = course.lessons.filter(
                is_published=True,
            ).exclude(
                id__in=completed_lesson_ids
            ).order_by(
                "order"
            ).first()

            courses_data.append({
                "id": course.id,
                "title": course.title,
                "image": request.build_absolute_uri(course.thumbnail.url)
                    if course.thumbnail else None,
                "progress": progress,
                "total_lessons": total_lessons,
                "completed_lessons": completed_lessons,

                "next_lesson": (
                    {
                        "id": next_lesson.id,
                        "title": next_lesson.title,
                        "order": next_lesson.order,
                    }
                    if next_lesson
                    else None
                ),

                "enrolled_at": enrollment.enrolled_at,
            })

        # Get student's wallet
        wallet = Wallet.objects.filter(
            student=student
        ).first()

        return Response({
            "student": {
                "id": student.id,
                "username": student.username,
                "email": student.email,
                "role": student.role,
            },

            "wallet": {
                "balance": (
                    str(wallet.balance)
                    if wallet
                    else "0.00"
                ),
            },

            "courses": courses_data,
        })


class StudentExamResultsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        attempts = (
            ExamAttempt.objects
            .filter(student=request.user)
            .select_related(
                "exam",
                "exam__lesson",
                "exam__lesson__course",
            )
            .order_by("-completed_at")
        )

        results = []

        for attempt in attempts:
            results.append({
                "attempt_id": attempt.id,
                "exam_id": attempt.exam.id,
                "exam_title": attempt.exam.title,
                "lesson_id": attempt.exam.lesson.id,
                "lesson_title": attempt.exam.lesson.title,
                "course_id": attempt.exam.lesson.course.id,
                "course_title": attempt.exam.lesson.course.title,
                "score": attempt.score,
                "passing_score": attempt.exam.passing_score,
                "passed": attempt.passed,
                "created_at": attempt.completed_at,
            })

        return Response({
            "results": results
        })

class StudentWalletTransactionsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet = Wallet.objects.filter(
            student=request.user
        ).first()

        if not wallet:
            return Response({
                "balance": "0.00",
                "transactions": [],
            })

        transactions = (
            wallet.transactions
            .select_related("course")
            .order_by("-created_at")
        )

        transaction_data = []

        for transaction in transactions:
            transaction_data.append({
                "id": transaction.id,
                "type": transaction.transaction_type,
                "amount": str(transaction.amount),
                "course": (
                    transaction.course.title
                    if transaction.course
                    else None
                ),
                "description": transaction.description,
                "created_at": transaction.created_at,
            })

        return Response({
            "balance": str(wallet.balance),
            "transactions": transaction_data,
        })

class TeacherDashboardView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Only teachers
        if request.user.role != User.Role.TEACHER:
            return Response(
                {
                    "detail": "Only teachers can access this dashboard."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        courses = (
            Course.objects
            .filter(teacher=request.user)
            .prefetch_related("lessons")
        )

        total_courses = courses.count()

        published_courses = courses.filter(
            is_published=True
        ).count()

        total_lessons = Lesson.objects.filter(
            course__teacher=request.user
        ).count()

        total_exams = Exam.objects.filter(
            lesson__course__teacher=request.user
        ).count()

        total_students = (
            Enrollment.objects
            .filter(course__teacher=request.user)
            .values("student")
            .distinct()
            .count()
        )

        courses_data = []

        for course in courses:

            published_lessons = course.lessons.filter(
                is_published=True
            )

            total_course_lessons = published_lessons.count()

            enrollments = (
                Enrollment.objects
                .filter(course=course)
                .select_related("student")
            )

            students_data = []

            for enrollment in enrollments:

                student = enrollment.student

                completed_lessons = (
                    LessonProgress.objects
                    .filter(
                        student=student,
                        lesson__course=course,
                        lesson_completed=True,
                        lesson__is_published=True,
                    )
                    .count()
                )

                if total_course_lessons > 0:
                    progress = round(
                        (
                            completed_lessons
                            / total_course_lessons
                        ) * 100
                    )
                else:
                    progress = 0

                exam_attempts = (
                    ExamAttempt.objects
                    .filter(
                        student=student,
                        exam__lesson__course=course,
                    )
                    .select_related(
                        "exam",
                        "exam__lesson",
                    )
                    .order_by("-completed_at")
                )

                exams_data = []

                for attempt in exam_attempts:

                    exams_data.append({
                        "exam_id": attempt.exam.id,
                        "exam_title": attempt.exam.title,
                        "lesson_id": attempt.exam.lesson.id,
                        "lesson_title": attempt.exam.lesson.title,
                        "score": attempt.score,
                        "passing_score": (
                            attempt.exam.passing_score
                        ),
                        "passed": attempt.passed,
                        "created_at": attempt.completed_at,
                    })

                students_data.append({
                    "student_id": student.id,
                    "username": student.username,
                    "email": student.email,
                    "progress": progress,
                    "completed_lessons": completed_lessons,
                    "total_lessons": total_course_lessons,
                    "exam_results": exams_data,
                    "enrolled_at": enrollment.enrolled_at,
                })

            courses_data.append({
                "course_id": course.id,
                "course_title": course.title,
                "description": course.description,
                "price": str(course.price),
                "is_published": course.is_published,
                "total_lessons": total_course_lessons,
                "students_count": len(students_data),
                "students": students_data,
            })

        return Response({
            "teacher": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
                "role": request.user.role,
            },

            "stats": {
                "total_courses": total_courses,
                "published_courses": published_courses,
                "total_students": total_students,
                "total_lessons": total_lessons,
                "total_exams": total_exams,
            },

            "courses": courses_data,
        })

class ExamDetailView(generics.RetrieveAPIView):

    queryset = Exam.objects.filter(
        is_published=True
    )

    serializer_class = ExamSerializer

    permission_classes = [
        IsAuthenticated
    ]

class StudentExamAnalysisView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, attempt_id):

        attempt = get_object_or_404(
            ExamAttempt.objects.select_related(
                "exam",
                "exam__lesson",
                "exam__lesson__course",
            ),
            id=attempt_id,
            student=request.user,
        )

        exam = attempt.exam

        questions = exam.questions.all()

        total_questions = questions.count()

        correct_count = attempt.answers.filter(
            is_correct=True
        ).count()

        wrong_count = attempt.answers.filter(
            is_correct=False
        ).count()

        # -----------------------------------------
        # QUESTIONS ANALYSIS
        # -----------------------------------------

        questions_data = []

        for question in questions:

            try:
                answer = attempt.answers.get(
                    question=question
                )
            except ExamAttemptAnswer.DoesNotExist:
                answer = None

            question_image = None

            if question.question_image:
                question_image = request.build_absolute_uri(
                    question.question_image.url
                )

            questions_data.append(
                {
                    "id": question.id,

                    "order": question.order,

                    "question": question.question,

                    "question_image": question_image,

                    "options": {
                        "A": question.option_a,
                        "B": question.option_b,
                        "C": question.option_c,
                        "D": question.option_d,
                    },

                    "selected_answer": (
                        answer.selected_answer
                        if answer
                        else None
                    ),

                    "correct_answer": (
                        question.correct_answer
                    ),

                    "is_correct": (
                        answer.is_correct
                        if answer
                        else False
                    ),

                    "explanation": (
                        question.explanation
                        or ""
                    ),
                }
            )

        # -----------------------------------------
        # RESPONSE
        # -----------------------------------------

        return Response(
            {
                "attempt_id": attempt.id,

                "exam_id": exam.id,

                "exam_title": exam.title,

                "lesson_title": (
                    exam.lesson.title
                ),

                "course_title": (
                    exam.lesson.course.title
                ),

                "score": attempt.score,

                "passing_score": exam.passing_score,

                "passed": attempt.passed,

                "total_questions": total_questions,

                "correct_answers": correct_count,

                "wrong_answers": wrong_count,

                "completed_at": (
                    attempt.completed_at
                ),

                "time_limit": exam.time_limit,

                "questions": questions_data,
            }
        )

class TeacherCourseListCreateView(
    generics.ListCreateAPIView
):

    permission_classes = [IsAuthenticated]
    serializer_class = TeacherCourseSerializer

    def get_queryset(self):

        if self.request.user.role != "TEACHER":
            return Course.objects.none()

        return Course.objects.filter(
            teacher=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):

        if self.request.user.role != "TEACHER":
            raise PermissionDenied(
                "Only teachers can create courses."
            )

        serializer.save(
            teacher=self.request.user
        )


class TeacherCourseDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    permission_classes = [IsAuthenticated]
    serializer_class = TeacherCourseSerializer

    def get_queryset(self):

        if self.request.user.role != "TEACHER":
            return Course.objects.none()

        return Course.objects.filter(
            teacher=self.request.user
        )

class TeacherCourseDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    permission_classes = [IsAuthenticated]
    serializer_class = TeacherCourseSerializer

    def get_queryset(self):

        if self.request.user.role != "TEACHER":
            return Course.objects.none()

        return Course.objects.filter(
            teacher=self.request.user
        )


class TeacherLessonListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LessonSerializer

    def get_queryset(self):

        if self.request.user.role != "TEACHER":
            return Lesson.objects.none()

        course_id = self.request.query_params.get("course")

        return Lesson.objects.filter(
            course__id=course_id,
            course__teacher=self.request.user,
        ).order_by("order")

    def perform_create(self, serializer):

        if self.request.user.role != "TEACHER":
            raise PermissionDenied(
                "Only teachers can create lessons."
            )

        course_id = self.request.data.get("course")

        course = get_object_or_404(
            Course,
            id=course_id,
            teacher=self.request.user,
        )

        serializer.save(course=course)

class TeacherLessonDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    permission_classes = [IsAuthenticated]
    serializer_class = LessonSerializer

    def get_queryset(self):
        if self.request.user.role != "TEACHER":
            return Lesson.objects.none()

        return Lesson.objects.filter(
            course__teacher=self.request.user
        )

class TeacherCreateExamView(
    generics.CreateAPIView
):

    permission_classes = [IsAuthenticated]

    serializer_class = TeacherExamCreateSerializer

    def perform_create(self, serializer):

        if self.request.user.role != "TEACHER":
            raise PermissionDenied(
                "Only teachers can create exams."
            )

        lesson_id = self.request.data.get(
            "lesson"
        )

        lesson = get_object_or_404(
            Lesson,
            id=lesson_id,
            course__teacher=self.request.user,
        )

        serializer.save(
            lesson=lesson
        )

class TeacherCreateExamQuestionView(
    generics.CreateAPIView
):

    permission_classes = [IsAuthenticated]

    serializer_class = ExamQuestionSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def perform_create(self, serializer):

        if self.request.user.role != "TEACHER":
            raise PermissionDenied(
                "Only teachers can add questions."
            )

        exam_id = self.request.data.get("exam")

        exam = get_object_or_404(
            Exam,
            id=exam_id,
            lesson__course__teacher=self.request.user,
        )

        serializer.save(exam=exam)



class TeacherExamQuestionsView(
    generics.ListAPIView
):
    permission_classes = [IsAuthenticated]
    serializer_class = ExamQuestionSerializer

    def get_queryset(self):

        exam_id = self.kwargs["exam_id"]

        return ExamQuestion.objects.filter(
            exam__id=exam_id,
            exam__lesson__course__teacher=self.request.user,
        ).order_by("order")


class TeacherExamQuestionDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = ExamQuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return ExamQuestion.objects.filter(
            exam__lesson__course__teacher=self.request.user
        )


class TeacherExamManagementView(
    generics.GenericAPIView
):
    permission_classes = [IsAuthenticated]

    serializer_class = ExamSerializer

    def get(self, request, lesson_id):

        if request.user.role != "TEACHER":
            raise PermissionDenied(
                "Only teachers can access exam management."
            )

        lesson = get_object_or_404(
            Lesson,
            id=lesson_id,
            course__teacher=request.user,
        )

        exam = Exam.objects.filter(
            lesson=lesson
        ).prefetch_related(
            "questions"
        ).first()

        if not exam:

            return Response({
                "exists": False,
                "lesson": lesson.id,
                "message": "This lesson has no exam.",
            })

        serializer = self.get_serializer(exam)

        return Response({
            "exists": True,
            "exam": serializer.data,
        })

User = get_user_model()


class AdminDashboardView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "ADMIN":
            return Response(
                {
                    "detail": "Only admins can access this dashboard."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        students_count = User.objects.filter(
            role="STUDENT"
        ).count()

        teachers_count = User.objects.filter(
            role="TEACHER"
        ).count()

        courses_count = Course.objects.count()

        published_courses_count = Course.objects.filter(
            is_published=True
        ).count()

        lessons_count = Lesson.objects.count()

        exams_count = Exam.objects.count()

        published_exams_count = Exam.objects.filter(
            is_published=True
        ).count()

        return Response({

            "students": students_count,

            "teachers": teachers_count,

            "courses": courses_count,

            "published_courses": published_courses_count,

            "lessons": lessons_count,

            "exams": exams_count,

            "published_exams": published_exams_count,

        })






User = get_user_model()

class AdminStudentListView(
    generics.ListAPIView
):

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        if self.request.user.role != "ADMIN":
            raise PermissionDenied(
                "Only admins can access students."
            )

        queryset = User.objects.filter(
            role="STUDENT"
        ).order_by("-id")

        search = self.request.query_params.get(
            "search"
        )

        if search:

            queryset = queryset.filter(
                username__icontains=search
            ) | queryset.filter(
                email__icontains=search
            )

        return queryset

    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()

        data = []

        for student in queryset:

            data.append({

                "id": student.id,

                "username": student.username,

                "email": student.email,

                "is_active": student.is_active,

            })

        return Response(data)

class AdminStudentDetailView(
    generics.RetrieveUpdateAPIView
):

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        if self.request.user.role != "ADMIN":
            raise PermissionDenied(
                "Only admins can manage students."
            )

        return User.objects.filter(
            role="STUDENT"
        )

    def retrieve(self, request, *args, **kwargs):

        student = self.get_object()

        enrollments = Enrollment.objects.filter(
            student=student
        ).select_related("course")

        courses = []

        for enrollment in enrollments:

            course = enrollment.course

            total_lessons = Lesson.objects.filter(
                course=course,
                is_published=True
            ).count()

            completed_lessons = LessonProgress.objects.filter(
                student=student,
                lesson__course=course,
                lesson__is_published=True,
                lesson_completed=True
            ).count()

            if total_lessons > 0:

                progress = round(
                    (
                        completed_lessons
                        / total_lessons
                    ) * 100
                )

            else:

                progress = 0


            courses.append({

                "id": course.id,

                "title": course.title,

                "enrolled_at":
                    enrollment.enrolled_at,

                "total_lessons":
                    total_lessons,

                "completed_lessons":
                    completed_lessons,

                "progress":
                    progress,

            })


        attempts = ExamAttempt.objects.filter(
            student=student
        ).select_related("exam")


        exam_results = []

        for attempt in attempts:

            exam_results.append({

                "id": attempt.id,

                "exam_id":
                    attempt.exam.id,

                "exam_title":
                    attempt.exam.title,

                "score":
                    attempt.score,

                "passed":
                    attempt.passed,

                "completed_at":
                    attempt.completed_at,

            })


        return Response({

            "id": student.id,

            "username": student.username,

            "email": student.email,

            "is_active":
                student.is_active,

            "courses":
                courses,

            "exam_results":
                exam_results,

        })


    def update(
        self,
        request,
        *args,
        **kwargs
    ):

        student = self.get_object()

        if "is_active" in request.data:

            student.is_active = (
                request.data["is_active"]
            )

            student.save(
                update_fields=[
                    "is_active"
                ]
            )

        return Response({

            "id": student.id,

            "username": student.username,

            "email": student.email,

            "is_active":
                student.is_active,

        })

class AdminTeachersView(generics.ListAPIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != User.Role.ADMIN:
            return Response(
                {
                    "detail": "Only admins can access teachers."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        teachers = User.objects.filter(
            role=User.Role.TEACHER
        ).order_by("-id")

        data = []

        for teacher in teachers:

            courses = Course.objects.filter(
                teacher=teacher
            )

            data.append({
                "id": teacher.id,
                "username": teacher.username,
                "email": teacher.email,
                "is_active": teacher.is_active,

                "courses_count": courses.count(),

                "published_courses": courses.filter(
                    is_published=True
                ).count(),

                "students_count": (
                    Enrollment.objects
                    .filter(course__teacher=teacher)
                    .values("student")
                    .distinct()
                    .count()
                ),

                "lessons_count": Lesson.objects.filter(
                    course__teacher=teacher
                ).count(),

                "exams_count": Exam.objects.filter(
                    lesson__course__teacher=teacher
                ).count(),
            })

        return Response(data)

class AdminTeacherDetailView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        if request.user.role != User.Role.ADMIN:
            return Response(
                {
                    "detail": "Only admins can access teacher details."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        teacher = get_object_or_404(
            User,
            id=pk,
            role=User.Role.TEACHER,
        )

        courses = (
            Course.objects
            .filter(teacher=teacher)
            .prefetch_related("lessons")
        )

        courses_data = []

        total_students = 0
        total_lessons = 0
        total_exams = 0

        for course in courses:

            lessons = course.lessons.all()

            students = (
                Enrollment.objects
                .filter(course=course)
                .select_related("student")
            )

            exams = Exam.objects.filter(
                lesson__course=course
            )

            total_lessons += lessons.count()
            total_exams += exams.count()

            total_students += (
                students.values("student")
                .distinct()
                .count()
            )

            courses_data.append({

                "id": course.id,

                "title": course.title,

                "description": course.description,

                "price": str(course.price),

                "is_published": course.is_published,

                "lessons_count": lessons.count(),

                "published_lessons": lessons.filter(
                    is_published=True
                ).count(),

                "students_count": (
                    students.values("student")
                    .distinct()
                    .count()
                ),

                "exams_count": exams.count(),

            })

        return Response({

            "id": teacher.id,

            "username": teacher.username,

            "email": teacher.email,

            "is_active": teacher.is_active,

            "role": teacher.role,

            "courses_count": courses.count(),

            "published_courses": courses.filter(
                is_published=True
            ).count(),

            "students_count": total_students,

            "lessons_count": total_lessons,

            "exams_count": total_exams,

            "courses": courses_data,

        })

class AdminCourseDetailView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        if request.user.role != User.Role.ADMIN:
            return Response(
                {
                    "detail": "Only admins can access course details."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        course = get_object_or_404(
            Course.objects.select_related("teacher"),
            id=pk,
        )

        lessons = course.lessons.all()

        enrollments = (
            Enrollment.objects
            .filter(course=course)
            .select_related("student")
        )

        exams = Exam.objects.filter(
            lesson__course=course
        ).select_related("lesson")

        return Response({

            "id": course.id,

            "title": course.title,

            "description": course.description,

            "price": str(course.price),

            "is_published": course.is_published,

            "teacher": {
                "id": course.teacher.id,
                "username": course.teacher.username,
                "email": course.teacher.email,
            },

            "students_count": (
                enrollments
                .values("student")
                .distinct()
                .count()
            ),

            "students": [
                {
                    "id": enrollment.student.id,
                    "username": enrollment.student.username,
                    "email": enrollment.student.email,
                    "enrolled_at": enrollment.enrolled_at,
                }
                for enrollment in enrollments
            ],

            "lessons_count": lessons.count(),

            "lessons": [
                {
                    "id": lesson.id,
                    "title": lesson.title,
                    "is_published": lesson.is_published,
                }
                for lesson in lessons
            ],

            "exams_count": exams.count(),

            "exams": [
                {
                    "id": exam.id,
                    "title": exam.title,
                    "lesson_id": exam.lesson.id,
                    "lesson_title": exam.lesson.title,
                    "passing_score": exam.passing_score,
                    "time_limit": exam.time_limit,
                    "is_published": exam.is_published,
                }
                for exam in exams
            ],
        })

class AdminCoursesView(generics.ListAPIView):

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Course.objects
            .select_related("teacher")
            .all()
            .order_by("-id")
        )

    def list(self, request, *args, **kwargs):

        if request.user.role != User.Role.ADMIN:
            return Response(
                {
                    "detail": "Only admins can access courses."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        courses = self.get_queryset()

        data = []

        for course in courses:

            students_count = (
                Enrollment.objects
                .filter(course=course)
                .values("student")
                .distinct()
                .count()
            )

            lessons_count = Lesson.objects.filter(
                course=course
            ).count()

            exams_count = Exam.objects.filter(
                lesson__course=course
            ).count()

            data.append({
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "price": str(course.price),
                "is_published": course.is_published,

                "teacher": {
                    "id": course.teacher.id,
                    "username": course.teacher.username,
                    "email": course.teacher.email,
                },

                "students_count": students_count,
                "lessons_count": lessons_count,
                "exams_count": exams_count,
            })

        return Response(data)




class StudentAllCoursesView(generics.ListAPIView):

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return (
            Course.objects
            .filter(is_published=True)
            .select_related("teacher")
            .prefetch_related("lessons")
            .order_by("-id")
        )

    def list(self, request, *args, **kwargs):

        if request.user.role != "STUDENT":
            return Response(
                {
                    "detail": "Only students can access courses."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        courses = self.get_queryset()

        data = []

        for course in courses:

            lessons_count = course.lessons.filter(
                is_published=True
            ).count()

            enrolled = Enrollment.objects.filter(
                student=request.user,
                course=course
            ).exists()

            data.append({
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "price": str(course.price),

                "teacher": {
                    "id": course.teacher.id,
                    "username": course.teacher.username,
                },

                "lessons_count": lessons_count,

                "is_enrolled": enrolled,
            })

        return Response(data)






class StudentEnrollCourseView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, course_id):

        # =========================
        # STUDENT ONLY
        # =========================

        if request.user.role != "STUDENT":
            return Response(
                {
                    "detail": "Only students can enroll in courses."
                },
                status=status.HTTP_403_FORBIDDEN,
            )


        # =========================
        # GET COURSE
        # =========================

        course = get_object_or_404(
            Course,
            id=course_id,
            is_published=True,
        )


        # =========================
        # ALREADY ENROLLED?
        # =========================

        if Enrollment.objects.filter(
            student=request.user,
            course=course,
        ).exists():

            return Response(
                {
                    "detail": "You are already enrolled in this course."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


        # =========================
        # GET WALLET
        # =========================

        wallet, created = Wallet.objects.select_for_update().get_or_create(
            student=request.user
        )


        # =========================
        # COURSE PRICE
        # =========================

        course_price = Decimal(course.price)


        # =========================
        # CHECK BALANCE
        # =========================

        if wallet.balance < course_price:

            return Response(
                {
                    "detail": "Insufficient wallet balance.",
                    "course_price": str(course_price),
                    "wallet_balance": str(wallet.balance),
                    "required_amount": str(
                        course_price - wallet.balance
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


        # =========================
        # DEDUCT MONEY
        # =========================

        wallet.balance -= course_price

        wallet.save(
            update_fields=[
                "balance",
                "updated_at",
            ]
        )


        # =========================
        # CREATE TRANSACTION
        # =========================

        wallet_transaction = WalletTransaction.objects.create(

            wallet=wallet,

            transaction_type="COURSE_PURCHASE",

            amount=course_price,

            course=course,

            description=(
                f"Purchase of course: "
                f"{course.title}"
            ),
        )


        # =========================
        # CREATE ENROLLMENT
        # =========================

        enrollment = Enrollment.objects.create(

            student=request.user,

            course=course,
        )


        # =========================
        # RESPONSE
        # =========================

        return Response(

            {
                "message": "Course enrolled successfully.",

                "enrollment": {
                    "id": enrollment.id,

                    "course_id": course.id,

                    "course_title": course.title,

                    "enrolled_at": enrollment.enrolled_at,
                },

                "payment": {
                    "amount": str(course_price),

                    "transaction_id":
                        wallet_transaction.id,

                    "transaction_type":
                        wallet_transaction.transaction_type,
                },

                "wallet": {
                    "balance":
                        str(wallet.balance),
                },
            },

            status=status.HTTP_201_CREATED,
        )

class TeacherCourseStudentsView(
    generics.GenericAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, course_id):

        # Only teachers
        if request.user.role != User.Role.TEACHER:

            return Response(
                {
                    "detail":
                    "Only teachers can access this."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Only courses owned by this teacher
        course = get_object_or_404(
            Course,
            id=course_id,
            teacher=request.user,
        )

        # Students enrolled in this course
        enrollments = (
            Enrollment.objects
            .filter(course=course)
            .select_related("student")
            .order_by("-enrolled_at")
        )

        students = []

        for enrollment in enrollments:

            student = enrollment.student

            # Full name
            full_name = (
                f"{student.first_name} "
                f"{student.last_name}"
            ).strip()

            if not full_name:
                full_name = student.username


            # -------------------------------------------------
            # Exam attempts for this student
            # ONLY exams belonging to this course
            # -------------------------------------------------

            exam_attempts = (
                ExamAttempt.objects
                .filter(
                    student=student,
                    exam__lesson__course=course,
                )
                .select_related(
                    "exam",
                    "exam__lesson",
                )
                .order_by("-completed_at")
            )


            exam_results = []

            for attempt in exam_attempts:

                exam_results.append(
                    {
                        "attempt_id":
                            attempt.id,

                        "exam_id":
                            attempt.exam.id,

                        "exam_title":
                            attempt.exam.title,

                        "lesson_id":
                            attempt.exam.lesson.id,

                        "lesson_title":
                            attempt.exam.lesson.title,

                        "score":
                            attempt.score,

                        "passing_score":
                            attempt.exam.passing_score,

                        "passed":
                            attempt.passed,

                        "completed_at":
                            attempt.completed_at,
                    }
                )


            students.append(
                {
                    "id":
                        student.id,

                    "full_name":
                        full_name,

                    "phone_number":
                        student.phone_number,

                    "enrolled_at":
                        enrollment.enrolled_at,

                    "exam_results":
                        exam_results,

                    "exams_count":
                        len(exam_results),
                }
            )


        return Response(
            {
                "course": {
                    "id":
                        course.id,

                    "title":
                        course.title,
                },

                "students_count":
                    len(students),

                "students":
                    students,
            }
        )

class TeacherLessonVideoUploadView(
    generics.GenericAPIView
):




    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id):

        if request.user.role != "TEACHER":
            raise PermissionDenied(
                "Only teachers can upload videos."
            )

        lesson = get_object_or_404(
            Lesson,
            id=lesson_id,
            course__teacher=request.user,
        )

        title = request.data.get("title")

        if not title:
            return Response(
                {
                    "detail": "Video title is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create video object in Bunny
        bunny_video = create_bunny_video(title)

        video_id = bunny_video["guid"]

        # Generate temporary TUS signature
        upload_data = create_bunny_upload_signature(
            video_id
        )

        # Save Bunny video ID in our DB
        lesson.bunny_video_id = video_id
        lesson.video_url = (
            f"https://iframe.mediadelivery.net/embed/"
            f"{settings.BUNNY_LIBRARY_ID}/"
            f"{video_id}"
        )

        lesson.save(
            update_fields=[
                "bunny_video_id",
                "video_url",
            ]
        )

        return Response(
            {
                "message": "Bunny video created successfully.",

                "lesson_id": lesson.id,

                "video": {
                    "id": video_id,
                    "title": title,
                },

                "upload": upload_data,
            },
            status=status.HTTP_201_CREATED,
        )




class StudentTodoListView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        todos = TodoItem.objects.filter(
            user=request.user
        ).order_by("is_completed", "-created_at")

        data = []

        for todo in todos:
            data.append({
                "id": todo.id,
                "title": todo.title,
                "description": todo.description,
                "due_date": todo.due_date,
                "priority": todo.priority,
                "is_completed": todo.is_completed,
                "created_at": todo.created_at,
            })

        return Response({
            "todos": data
        })

        
    def post(self, request):
        todo = TodoItem.objects.create(
            user=request.user,
            title=request.data.get("title"),
            description=request.data.get("description", ""),
            due_date=request.data.get("due_date"),
            priority=request.data.get("priority", "MEDIUM"),
        )

        return Response({
            "message": "Task created successfully",
            "todo": {
                "id": todo.id,
                "title": todo.title,
                "description": todo.description,
                "due_date": todo.due_date,
                "priority": todo.priority,
                "is_completed": todo.is_completed,
                "created_at": todo.created_at,
            }
        }, status=201)


        


class StudentTodoDetailView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):
        return TodoItem.objects.filter(
            id=pk,
            user=request.user
        ).first()

    def patch(self, request, pk):
        todo = self.get_object(request, pk)

        if not todo:
            return Response(
                {"error": "Task not found"},
                status=404
            )

        if "title" in request.data:
            todo.title = request.data["title"]

        if "description" in request.data:
            todo.description = request.data["description"]

        if "due_date" in request.data:
            todo.due_date = request.data["due_date"]

        if "priority" in request.data:
            todo.priority = request.data["priority"]

        if "is_completed" in request.data:
            todo.is_completed = request.data["is_completed"]

        todo.save()

        return Response({
            "message": "Task updated successfully",
            "todo": {
                "id": todo.id,
                "title": todo.title,
                "description": todo.description,
                "due_date": todo.due_date,
                "priority": todo.priority,
                "is_completed": todo.is_completed,
                "created_at": todo.created_at,
            }
        })

    def delete(self, request, pk):
        todo = self.get_object(request, pk)

        if not todo:
            return Response(
                {"error": "Task not found"},
                status=404
            )

        todo.delete()

        return Response(
            {"message": "Task deleted successfully"},
            status=204
        )



class StudentTeacherNewsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        news = TeacherNews.objects.filter(
            is_published=True,
            course__isnull=True
        ).select_related(
            "teacher"
        ).order_by("-created_at")

        data = []

        for item in news:
            data.append({
                "id": item.id,
                "title": item.title,
                "content": item.content,
                "teacher": item.teacher.username,
                "created_at": item.created_at,
            })

        return Response({
            "news": data
        })



class StudentLiveLessonsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        now = timezone.localtime()
        today = now.date()

        live_lessons = (
            LiveLesson.objects
            .filter(
                course__enrollments__student=request.user,
                is_published=True,
                start_time__date=today,
            )
            .select_related(
                "course",
                "teacher",
            )
            .order_by("start_time")
            .distinct()
        )

        data = []

        for lesson in live_lessons:

            start_time = timezone.localtime(lesson.start_time)

            end_time = start_time + timezone.timedelta(
                minutes=lesson.duration_minutes
            )

            is_live = start_time <= now <= end_time

            data.append({
                "id": lesson.id,
                "title": lesson.title,
                "description": lesson.description,

                "course_id": lesson.course.id,
                "course_title": lesson.course.title,

                "teacher_id": lesson.teacher.id,
                "teacher_name": lesson.teacher.username,

                "start_time": start_time,
                "duration_minutes": lesson.duration_minutes,

                "meeting_url": lesson.meeting_url,

                "is_published": lesson.is_published,

                "status": "live" if is_live else "scheduled",
            })

        return Response({
            "today_count": len(data),
            "live_lessons": data,
        })


class StudentRecommendedCoursesView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        student = request.user

        enrolled_course_ids = Enrollment.objects.filter(
            student=student
        ).values_list("course_id", flat=True)

        courses = Course.objects.filter(
            is_published=True,
            academic_year=student.academic_year,
        ).exclude(
            id__in=enrolled_course_ids
        ).select_related(
            "teacher"
        )

        data = []

        for course in courses:

            data.append({
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "price": course.price,
                "category": course.category,
                "academic_year": course.academic_year,

                "teacher": {
                    "id": course.teacher.id if course.teacher else None,
                    "username": (
                        course.teacher.username
                        if course.teacher
                        else None
                    ),
                },

                "thumbnail": (
                    request.build_absolute_uri(
                        course.thumbnail.url
                    )
                    if course.thumbnail
                    else None
                ),

                "is_enrolled": False,
            })

        return Response({
            "courses": data
        })


class StudentNotificationsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        notifications = TeacherNews.objects.filter(
            is_published=True,
            course__isnull=False,
            course__enrollments__student=request.user,
        ).select_related(
            "teacher",
            "course",
        ).order_by("-created_at").distinct()

        data = []

        for item in notifications:
            data.append({
                "id": item.id,
                "title": item.title,
                "content": item.content,
                "teacher": item.teacher.username,
                "course_id": item.course.id,
                "course_title": item.course.title,
                "created_at": item.created_at,
            })

        return Response({
            "notifications": data
        })






class StudentLearningStatsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        student = request.user
        today = timezone.localdate()

        # ==========================================
        # Enrolled Courses
        # ==========================================

        enrolled_courses = Enrollment.objects.filter(
            student=student
        )

        total_courses = enrolled_courses.count()

        # ==========================================
        # Lessons
        # ==========================================

        total_lessons = Lesson.objects.filter(
            course__enrollments__student=student,
            is_published=True,
        ).distinct().count()

        completed_lessons = LessonProgress.objects.filter(
            student=student,
            lesson__course__enrollments__student=student,
            lesson__is_published=True,
            lesson_completed=True,
        ).distinct().count()

        # ==========================================
        # Overall Progress
        # ==========================================

        if total_lessons > 0:
            overall_progress = round(
                (completed_lessons / total_lessons) * 100
            )
        else:
            overall_progress = 0

        # ==========================================
        # Active Courses
        #
        # Courses that have at least one completed
        # lesson OR at least one progress record.
        # ==========================================

        active_courses = enrolled_courses.filter(
            course__lessons__student_progress__student=student
        ).distinct().count()

        # ==========================================
        # Exams
        # ==========================================

        exam_attempts = ExamAttempt.objects.filter(
            student=student
        )

        total_exam_attempts = exam_attempts.count()

        passed_exams = exam_attempts.filter(
            passed=True
        ).count()

        # ==========================================
        # Learning Streak
        # ==========================================

        completed_dates = (
            LessonProgress.objects
            .filter(
                student=student,
                lesson_completed=True,
                completed_at__isnull=False,
            )
            .values_list(
                "completed_at",
                flat=True,
            )
            .order_by("-completed_at")
        )

        dates = set()

        for completed_at in completed_dates:
            local_date = timezone.localtime(
                completed_at
            ).date()

            dates.add(local_date)

        streak = 0
        current_date = today

        while current_date in dates:
            streak += 1
            current_date -= timedelta(days=1)

        # ==========================================
        # Response
        # ==========================================

        return Response({

            "streak_days": streak,

            "courses": {
                "total": total_courses,
                "active": active_courses,
            },

            "lessons": {
                "total": total_lessons,
                "completed": completed_lessons,
            },

            "progress": {
                "overall_percentage": overall_progress,
            },

            "exams": {
                "total_attempts": total_exam_attempts,
                "passed": passed_exams,
            },

        })




class TestStorageUploadView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        file = request.FILES.get("file")

        if not file:
            return Response(
                {
                    "detail": "No file uploaded."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = upload_file(
            file,
            folder="test",
        )

        return Response(
            {
                "message": "File uploaded successfully.",
                "path": result["path"],
            },
            status=status.HTTP_201_CREATED,
        )

class SubmitAssignmentView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id):

        lesson = get_object_or_404(
            Lesson,
            id=lesson_id,
            is_published=True,
        )

        # Student must be enrolled
        if not Enrollment.objects.filter(
            student=request.user,
            course=lesson.course,
        ).exists():
            return Response(
                {
                    "detail": "You are not enrolled in this course."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Lesson must have started / video completed
        progress = LessonProgress.objects.filter(
            student=request.user,
            lesson=lesson,
        ).first()

        if not progress or not progress.video_completed:
            return Response(
                {
                    "detail": "Complete the lesson video first."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        file = request.FILES.get("file")

        if not file:
            return Response(
                {
                    "detail": "No assignment file uploaded."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Only PDF
        if file.content_type != "application/pdf":
            return Response(
                {
                    "detail": "Only PDF files are allowed."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Upload to Supabase Storage
        result = upload_file(
            file,
            folder=f"assignments/{request.user.id}/{lesson.id}",
        )

        # Save only the Supabase path in DB
        submission, created = AssignmentSubmission.objects.update_or_create(
            student=request.user,
            lesson=lesson,
            defaults={
                "file_path": result["path"],
            },
        )

        return Response(
            {
                "message": "Assignment submitted successfully.",
                "submission_id": submission.id,
                "file_path": submission.file_path,
                "submitted_at": submission.submitted_at,
            },
            status=status.HTTP_201_CREATED,
        )


class LessonQuestionListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = LessonQuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        lesson_id = self.kwargs["lesson_id"]

        return LessonQuestion.objects.filter(
            lesson_id=lesson_id,
            lesson__is_published=True,
        ).select_related(
            "student"
        )

    def perform_create(self, serializer):

        lesson = get_object_or_404(
            Lesson,
            id=self.kwargs["lesson_id"],
            is_published=True,
        )

        # لازم الطالب يكون enrolled
        if not Enrollment.objects.filter(
            student=self.request.user,
            course=lesson.course,
        ).exists():

            raise PermissionDenied(
                "You are not enrolled in this course."
            )

        serializer.save(
            lesson=lesson,
            student=self.request.user,
        )
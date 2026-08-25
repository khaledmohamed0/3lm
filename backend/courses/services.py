from .models import ExamAttempt, LessonProgress, Enrollment


def is_lesson_unlocked(student, lesson):

    if not Enrollment.objects.filter(
        student=student,
        course=lesson.course,
    ).exists():
        return False

    # First lesson is always unlocked
    if lesson.order == 1:
        return True

    previous_lesson = (
        lesson.course.lessons
        .filter(order=lesson.order - 1)
        .first()
    )

    if not previous_lesson:
        return False

    previous_progress = LessonProgress.objects.filter(
        student=student,
        lesson=previous_lesson,
        lesson_completed=True,
    ).first()

    if not previous_progress:
        return False

    try:
        previous_exam = previous_lesson.exam
    except Exception:
        return False

    return ExamAttempt.objects.filter(
        student=student,
        exam=previous_exam,
        passed=True,
    ).exists()
from .models import ExamAttempt, LessonProgress, Enrollment

import time
import hashlib
from django.conf import settings

import requests


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




BUNNY_API_BASE_URL = "https://video.bunnycdn.com"


def create_bunny_video(title):
    """
    Create an empty video object in Bunny Stream.
    Returns the Bunny video response.
    """

    url = (
        f"{BUNNY_API_BASE_URL}/library/"
        f"{settings.BUNNY_LIBRARY_ID}/videos"
    )

    headers = {
        "AccessKey": settings.BUNNY_API_KEY,
        "Content-Type": "application/json",
    }

    response = requests.post(
        url,
        headers=headers,
        json={
            "title": title,
        },
        timeout=30,
    )

    response.raise_for_status()

    return response.json()




def create_bunny_upload_signature(video_id):
    library_id = str(settings.BUNNY_LIBRARY_ID)
    api_key = settings.BUNNY_API_KEY

    expiration_time = int(time.time()) + 3600

    value = (
        library_id
        + api_key
        + str(expiration_time)
        + video_id
    )

    signature = hashlib.sha256(
        value.encode("utf-8")
    ).hexdigest()

    return {
        "endpoint": "https://video.bunnycdn.com/tusupload",
        "signature": signature,
        "expiration_time": expiration_time,
        "video_id": video_id,
        "library_id": library_id,
    }
import os
import uuid

from supabase import create_client


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
SUPABASE_BUCKET = os.getenv(
    "SUPABASE_BUCKET",
    "kmg-learning",
)


supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY,
)


def upload_file(file, folder="test"):
    """
    Upload a Django UploadedFile to Supabase Storage.
    """

    extension = os.path.splitext(file.name)[1]

    file_name = f"{uuid.uuid4()}{extension}"

    file_path = f"{folder}/{file_name}"

    file_bytes = file.read()

    response = supabase.storage.from_(
        SUPABASE_BUCKET
    ).upload(
        file_path,
        file_bytes,
        {
            "content-type": file.content_type,
            "upsert": "false",
        },
    )

    return {
        "path": file_path,
        "response": response,
    }
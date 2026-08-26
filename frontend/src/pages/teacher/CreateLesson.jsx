import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as tus from "tus-js-client";

import api from "../../api/axios";
import "../../styles/create-lesson.css";

function CreateLesson() {

    const { courseId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [order, setOrder] = useState("");
    const [isPublished, setIsPublished] = useState(false);

    const [lessonPdf, setLessonPdf] = useState(null);
    const [assignmentPdf, setAssignmentPdf] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [videoFile, setVideoFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [bunnyVideoId, setBunnyVideoId] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");
        setUploadProgress(0);

        try {

            const formData = new FormData();

            formData.append("course", courseId);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("order", order);
            formData.append(
                "is_published",
                isPublished
            );

            if (lessonPdf) {
                formData.append(
                    "lesson_pdf",
                    lessonPdf
                );
            }

            if (assignmentPdf) {
                formData.append(
                    "assignment_pdf",
                    assignmentPdf
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Create Lesson
            |--------------------------------------------------------------------------
            */

            const lessonResponse = await api.post(
                "/courses/teacher/lessons/",
                formData
            );

            const lesson = lessonResponse.data;

            /*
            |--------------------------------------------------------------------------
            | No video selected
            |--------------------------------------------------------------------------
            */

            if (!videoFile) {

                navigate(
                    `/teacher/courses/${courseId}`
                );

                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Create Bunny Video
            |--------------------------------------------------------------------------
            */

            setUploadingVideo(true);

            const bunnyResponse = await api.post(
                `/courses/teacher/lessons/${lesson.id}/video/`,
                {
                    title: title,
                }
            );

            const bunnyData = bunnyResponse.data;

            const upload = bunnyData.upload;

            /*
            |--------------------------------------------------------------------------
            | Upload directly to Bunny
            |--------------------------------------------------------------------------
            */

            await new Promise(
                (resolve, reject) => {

                    const uploadInstance = new tus.Upload(
                        videoFile,
                        {

                            endpoint:
                                upload.endpoint,

                            retryDelays: [
                                0,
                                3000,
                                5000,
                                10000,
                                20000,
                            ],

                            headers: {
                                AuthorizationSignature:
                                    upload.signature,

                                AuthorizationExpire:
                                    String(upload.expiration_time),

                                VideoId:
                                    upload.video_id,

                                LibraryId:
                                    String(upload.library_id),
                            },

                            metadata: {
                                filetype:
                                    videoFile.type,

                                filename:
                                    videoFile.name,
                            },

                            onError: (error) => {

                                console.error(
                                    "Bunny upload error:",
                                    error
                                );

                                reject(error);
                            },

                            onProgress: (
                                bytesUploaded,
                                bytesTotal
                            ) => {

                                const percentage =
                                    Math.floor(
                                        (
                                            bytesUploaded /
                                            bytesTotal
                                        ) * 100
                                    );

                                setUploadProgress(
                                    percentage
                                );
                            },

                            onSuccess: () => {

                                console.log(
                                    "Bunny upload completed."
                                );

                                resolve();
                            },

                        }
                    );

                    uploadInstance.start();

                }
            );

            /*
            |--------------------------------------------------------------------------
            | Save Bunny Video ID on Lesson
            |--------------------------------------------------------------------------
            */

            await api.patch(
                `/courses/teacher/lessons/${lesson.id}/`,
                {
                    bunny_video_id:
                        upload.video_id,
                }
            );

            /*
            |--------------------------------------------------------------------------
            | Done
            |--------------------------------------------------------------------------
            */

            setUploadProgress(100);

            navigate(
                `/teacher/courses/${courseId}`
            );

        } catch (error) {

            console.error(
                "Create lesson error:",
                error
            );

            setError(
                error.response?.data
                    ? JSON.stringify(
                        error.response.data
                    )
                    : error.message ||
                    "Unable to create lesson."
            );

        } finally {

            setLoading(false);
            setUploadingVideo(false);

        }

    };


    return (

        <div className="create-lesson-page">

            <div className="create-lesson-container">

                <button
                    className="create-lesson-back"
                    onClick={() =>
                        navigate(
                            `/teacher/courses/${courseId}`
                        )
                    }
                >
                    ← Back to Course
                </button>


                <div className="create-lesson-header">

                    <span>
                        COURSE CONTENT
                    </span>

                    <h1>
                        Add New Lesson
                    </h1>

                    <p>
                        Create a new lesson for your course.
                    </p>

                </div>


                {error && (

                    <div className="create-lesson-error">
                        {typeof error === "string"
                            ? error
                            : JSON.stringify(error)}
                    </div>

                )}


                <form
                    className="create-lesson-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            Lesson Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="Enter lesson title"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Enter lesson description"
                            rows="5"
                        />

                    </div>


                    

                    <div className="form-group">

                        <label>
                            Video URL
                        </label>

                        <input
                            type="url"
                            value={videoUrl}
                            onChange={(e) =>
                                setVideoUrl(e.target.value)
                            }
                            placeholder="https://..."
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Lesson Video
                        </label>

                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                                setVideoFile(
                                    e.target.files[0] || null
                                );
                            }}
                        />
                        {uploadingVideo && (
                            <div className="video-upload-progress">

                                <p>
                                    Uploading video... {uploadProgress}%
                                </p>

                                <div className="progress-bar">

                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${uploadProgress}%`,
                                        }}
                                    />

                                </div>

                            </div>
                        )}

                        

                        {videoFile && (
                            <p>
                                Selected: {videoFile.name}
                            </p>
                        )}



                    </div>


                    <div className="form-group">

                        <label>
                            Lesson Order
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={order}
                            onChange={(e) =>
                                setOrder(
                                    e.target.value
                                )
                            }
                            placeholder="1"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Lesson PDF
                        </label>

                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                                setLessonPdf(
                                    e.target.files[0]
                                )
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Assignment PDF
                        </label>

                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                                setAssignmentPdf(
                                    e.target.files[0]
                                )
                            }
                        />

                    </div>


                    <label className="publish-toggle">

                        <input
                            type="checkbox"
                            checked={isPublished}
                            onChange={(e) =>
                                setIsPublished(
                                    e.target.checked
                                )
                            }
                        />

                        Publish lesson immediately

                    </label>


                    <button
                            type="submit"
                            className="create-lesson-submit"
                            disabled={loading}
                        >
                        {uploadingVideo
                            ? `Uploading Video ${uploadProgress}%`
                            : loading
                                ? "Creating..."
                                : "Create Lesson"}
                    </button>

                </form>

            </div>

        </div>

    );
}

export default CreateLesson;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/edit-lesson.css";

function EditLesson() {

    const { lessonId } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [order, setOrder] = useState("");
    const [isPublished, setIsPublished] = useState(false);

    const [lessonPdf, setLessonPdf] = useState(null);
    const [assignmentPdf, setAssignmentPdf] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchLesson = async () => {

            try {

                const response = await api.get(
                    `/courses/teacher/lessons/${lessonId}/`
                );

                const data = response.data;

                console.log(
                    "EDIT LESSON:",
                    data
                );

                setLesson(data);

                setTitle(data.title || "");
                setDescription(
                    data.description || ""
                );
                setVideoUrl(
                    data.video_url || ""
                );
                setOrder(
                    data.order || ""
                );
                setIsPublished(
                    data.is_published || false
                );

            } catch (error) {

                console.error(
                    "Load lesson error:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Unable to load lesson."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchLesson();

    }, [lessonId]);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);
        setError("");

        try {

            const formData = new FormData();

            formData.append(
                "title",
                title
            );

            formData.append(
                "description",
                description
            );

            formData.append(
                "video_url",
                videoUrl
            );

            formData.append(
                "order",
                order
            );

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


            const response = await api.patch(
                `/courses/teacher/lessons/${lessonId}/`,
                formData
            );

            console.log(
                "UPDATED LESSON:",
                response.data
            );


            navigate(
                `/teacher/courses/${response.data.course}`
            );

        } catch (error) {

            console.error(
                "Update lesson error:",
                error
            );

            setError(
                error.response?.data ||
                "Unable to update lesson."
            );

        } finally {

            setSaving(false);

        }
    };


    if (loading) {

        return (
            <div className="edit-lesson-page">

                <div className="edit-lesson-loading">
                    Loading lesson...
                </div>

            </div>
        );

    }


    if (error && !lesson) {

        return (
            <div className="edit-lesson-page">

                <div className="edit-lesson-error">

                    <h2>
                        Unable to Load Lesson
                    </h2>

                    <p>
                        {typeof error === "string"
                            ? error
                            : JSON.stringify(error)}
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/teacher/dashboard"
                            )
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </div>
        );

    }


    return (

        <div className="edit-lesson-page">

            <div className="edit-lesson-container">

                <button
                    className="edit-lesson-back"
                    onClick={() =>
                        navigate(
                            `/teacher/courses/${lesson.course}`
                        )
                    }
                >
                    ← Back to Course
                </button>


                <div className="edit-lesson-header">

                    <span>
                        COURSE CONTENT
                    </span>

                    <h1>
                        Edit Lesson
                    </h1>

                    <p>
                        Update your lesson content and settings.
                    </p>

                </div>


                {error && (

                    <div className="edit-lesson-error">
                        {typeof error === "string"
                            ? error
                            : JSON.stringify(error)}
                    </div>

                )}


                <form
                    className="edit-lesson-form"
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
                                setVideoUrl(
                                    e.target.value
                                )
                            }
                            placeholder="https://..."
                        />

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
                            required
                        />

                    </div>


                    <div className="file-section">

                        <label>
                            Current Lesson PDF
                        </label>

                        {lesson.lesson_pdf ? (

                            <a
                                href={lesson.lesson_pdf}
                                target="_blank"
                                rel="noreferrer"
                                className="current-file"
                            >
                                📄 View Current Lesson PDF
                            </a>

                        ) : (

                            <p className="no-file">
                                No lesson PDF uploaded.
                            </p>

                        )}

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


                    <div className="file-section">

                        <label>
                            Current Assignment PDF
                        </label>

                        {lesson.assignment_pdf ? (

                            <a
                                href={lesson.assignment_pdf}
                                target="_blank"
                                rel="noreferrer"
                                className="current-file"
                            >
                                📄 View Current Assignment PDF
                            </a>

                        ) : (

                            <p className="no-file">
                                No assignment PDF uploaded.
                            </p>

                        )}

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

                        Publish lesson

                    </label>


                    <button
                        type="submit"
                        className="edit-lesson-submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </form>

            </div>

        </div>

    );
}

export default EditLesson;
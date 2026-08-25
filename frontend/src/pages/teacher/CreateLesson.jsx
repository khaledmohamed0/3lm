import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            const formData = new FormData();

            formData.append("course", courseId);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("video_url", videoUrl);
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

            await api.post(
                "/courses/teacher/lessons/",
                formData
            );

            navigate(
                `/teacher/courses/${courseId}`
            );

        } catch (error) {

            console.error(
                "Create lesson error:",
                error
            );

            setError(
                error.response?.data ||
                "Unable to create lesson."
            );

        } finally {

            setLoading(false);

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
                        {loading
                            ? "Creating..."
                            : "Create Lesson"}
                    </button>

                </form>

            </div>

        </div>

    );
}

export default CreateLesson;
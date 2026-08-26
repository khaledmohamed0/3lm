import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import StudentLayout from "../../layouts/StudentLayout";

import "../../styles/lesson-details.css";

function LessonDetails() {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                /*
                 * Get lesson details
                 */
                const response = await api.get(
                    `/courses/lessons/${lessonId}/`
                );

                console.log(
                    "LESSON DETAILS:",
                    response.data
                );

                setLesson(response.data);

            } catch (error) {
                console.error(
                    "Lesson error:",
                    error
                );

                if (error.response?.status === 403) {
                    setError(
                        "This lesson is locked. Pass the previous exam first."
                    );
                } else if (
                    error.response?.status === 404
                ) {
                    setError(
                        "Lesson not found."
                    );
                } else {
                    setError(
                        "Unable to load this lesson."
                    );
                }

            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId]);


    const [completing, setCompleting] = useState(false);
    const [completeError, setCompleteError] = useState("");

    const handleCompleteLesson = async () => {
        try {
            setCompleting(true);
            setCompleteError("");

            const response = await api.post(
                `/courses/lessons/${lessonId}/complete/`
            );

            console.log(
                "LESSON COMPLETED:",
                response.data
            );

            /*
             * Lesson completed successfully.
             * Now go to the exam for this lesson.
             */

            if (lesson.exam_id) {
                navigate(
                    `/student/courses/${courseId}/exams/${lesson.exam_id}`
                );
            } else {
                // No exam assigned to this lesson
                navigate(
                    `/student/courses/${courseId}`
                );
            }

        } catch (error) {
            console.error(
                "Complete lesson error:",
                error
            );

            setCompleteError(
                error.response?.data?.detail ||
                "Unable to complete this lesson."
            );

        } finally {
            setCompleting(false);
        }
    };

    if (loading) {
        return (
            <StudentLayout>
                <div className="page-loading">
                    Loading lesson...
                </div>
            </StudentLayout>
        );
    }


    if (error) {
        return (
            <StudentLayout>

                <div className="lesson-error">

                    <div className="lesson-error-icon">
                        🔒
                    </div>

                    <h2>
                        Lesson Locked
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                `/student/courses/${courseId}`
                            )
                        }
                    >
                        ← Back to Course
                    </button>

                </div>

            </StudentLayout>
        );
    }


    if (!lesson) {
        return null;
    }






    const videoUrl = lesson.video_url;

    return (
        <StudentLayout>

            <div className="lesson-page">

                {/* Back */}

                <button
                    className="lesson-back"
                    onClick={() =>
                        navigate(
                            `/student/courses/${courseId}`
                        )
                    }
                >
                    ← Back to Course
                </button>


                {/* Header */}

                <div className="lesson-header">

                    <div>

                        <span className="lesson-label">
                            LESSON {lesson.order}
                        </span>

                        <h1>
                            {lesson.title}
                        </h1>

                        <p>
                            {lesson.description}
                        </p>

                    </div>

                </div>


                {/* Video */}

                <section className="lesson-card">

                    <div className="card-title">

                        <div>
                            <span>
                                🎥
                            </span>

                            <h2>
                                Lesson Video
                            </h2>
                        </div>

                    </div>


                    {videoUrl ? (

                        <div className="video-container">

                            <iframe
                                src={videoUrl}
                                title={lesson.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />

                        </div>

                    ) : (

                        <div className="no-video">
                            Video unavailable.
                        </div>

                    )}

                </section>


                {/* Materials */}

                <section className="lesson-materials">

                    {/* Lesson PDF */}

                    {lesson.lesson_pdf && (

                        <div className="material-card">

                            <div className="material-icon">
                                📄
                            </div>

                            <div className="material-info">

                                <span>
                                    LESSON MATERIAL
                                </span>

                                <h3>
                                    Lesson PDF
                                </h3>

                                <p>
                                    Download the lesson
                                    explanation.
                                </p>

                            </div>

                            <a
                                href={
                                    lesson.lesson_pdf
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="material-button"
                            >
                                Download
                            </a>

                        </div>

                    )}


                    {/* Assignment */}

                    {lesson.assignment_pdf && (

                        <div className="material-card">

                            <div className="material-icon">
                                📝
                            </div>

                            <div className="material-info">

                                <span>
                                    ASSIGNMENT
                                </span>

                                <h3>
                                    Assignment PDF
                                </h3>

                                <p>
                                    Download your
                                    assignment.
                                </p>

                            </div>

                            <a
                                href={
                                    lesson.assignment_pdf
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="material-button"
                            >
                                Download
                            </a>

                        </div>

                    )}

                </section>


                {/* Complete Lesson */}

                <section className="complete-section">

                    <div>

                        <span>
                            READY?
                        </span>

                        <h2>
                            Finished with this lesson?
                        </h2>

                        <p>
                            Complete the lesson to continue
                            to the next step.
                        </p>

                    </div>


                    <button
                        className="complete-button"
                        onClick={handleCompleteLesson}
                        disabled={completing}
                    >
                        {completing
                            ? "Completing..."
                            : "✓ Complete Lesson"}
                    </button>

                    {completeError && (
                        <p className="complete-error">
                            {completeError}
                        </p>
                    )}

                </section>

            </div>

        </StudentLayout>
    );
}

export default LessonDetails;
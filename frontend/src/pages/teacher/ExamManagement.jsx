import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/exam-management.css";


function ExamManagement() {

    const { lessonId } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleDeleteQuestion = async (questionId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this question?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/courses/teacher/questions/${questionId}/`
            );

            setExam((prev) => ({
                ...prev,
                questions: prev.questions.filter(
                    (question) => question.id !== questionId
                ),
            }));

        } catch (error) {

            console.error(
                "Delete question error:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to delete question."
            );

        }
    };

    useEffect(() => {

        const fetchExam = async () => {

            try {

                const response = await api.get(
                    `/courses/teacher/lessons/${lessonId}/exam/`
                );

                console.log(
                    "TEACHER EXAM:",
                    response.data
                );

                if (response.data.exists) {

                    setExam(
                        response.data.exam
                    );

                } else {

                    setExam(null);

                }

            } catch (error) {

                console.error(
                    "Exam management error:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Unable to load exam."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchExam();

        

    }, [lessonId]);


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (
            <div className="exam-management-page">

                <div className="exam-management-container">

                    <div className="exam-management-loading">

                        Loading exam...

                    </div>

                </div>

            </div>
        );

    }


    /* =========================
       ERROR
    ========================= */

    if (error) {

        return (
            <div className="exam-management-page">

                <div className="exam-management-container">

                    <div className="exam-management-error">

                        <h2>
                            Unable to Load Exam
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            className="exam-management-button"
                            onClick={() =>
                                navigate(-1)
                            }
                        >
                            ← Back
                        </button>

                    </div>

                </div>

            </div>
        );

    }


    /* =========================
       PAGE
    ========================= */

    return (

        <div className="exam-management-page">

            <div className="exam-management-container">


                {/* HEADER */}

                <div className="exam-management-header">

                    <span>
                        EXAM MANAGEMENT
                    </span>

                    <h1>
                        Lesson Exam
                    </h1>

                    <p>
                        Create and manage the exam
                        for this lesson.
                    </p>

                </div>


                {/* =========================
                   NO EXAM
                ========================= */}

                {!exam ? (

                    <div className="exam-empty-card">

                        <div className="exam-empty-icon">
                            📝
                        </div>

                        <h2>
                            No Exam Yet
                        </h2>

                        <p>
                            This lesson does not have
                            an exam yet. Create an exam
                            and add questions to it.
                        </p>

                        <button
                            className="exam-management-button primary"
                            onClick={() =>
                                navigate(
                                    `/teacher/lessons/${lessonId}/exam/create`
                                )
                            }
                        >
                            + Create Exam
                        </button>

                    </div>

                ) : (

                    /* =========================
                       EXAM EXISTS
                    ========================= */

                    <div className="exam-management-card">


                        {/* EXAM HEADER */}

                        <div className="exam-card-top">

                            <div className="exam-card-info">

                                <span>
                                    EXAM
                                </span>

                                <h2>
                                    {exam.title}
                                </h2>

                                <p>
                                    Manage exam settings
                                    and questions.
                                </p>

                            </div>


                            <div>

                                <span
                                    className={
                                        exam.is_published
                                            ? "exam-status published"
                                            : "exam-status draft"
                                    }
                                >
                                    {exam.is_published
                                        ? "PUBLISHED"
                                        : "DRAFT"}
                                </span>

                            </div>

                        </div>


                        {/* =========================
                           STATS
                        ========================= */}

                        <div className="exam-stats">


                            <div className="exam-stat">

                                <span>
                                    PASSING SCORE
                                </span>

                                <strong>
                                    {exam.passing_score}%
                                </strong>

                            </div>


                            <div className="exam-stat">

                                <span>
                                    TIME LIMIT
                                </span>

                                <strong>
                                    {exam.time_limit} min
                                </strong>

                            </div>


                            <div className="exam-stat">

                                <span>
                                    QUESTIONS
                                </span>

                                <strong>
                                    {exam.questions?.length || 0}
                                </strong>

                            </div>


                        </div>


                        {/* =========================
                           QUESTIONS
                        ========================= */}

                        <div className="exam-questions-section">

                            <div className="exam-questions-header">

                                <div>

                                    <span>
                                        EXAM CONTENT
                                    </span>

                                    <h3>
                                        Questions
                                    </h3>

                                </div>


                                <button
                                    className="exam-management-button primary"
                                    onClick={() =>
                                        navigate(
                                            `/teacher/exams/${exam.id}/questions/create`
                                        )
                                    }
                                >
                                    + Add Question
                                </button>

                            </div>


                            {exam.questions?.length === 0 ? (

                                <div className="no-questions">

                                    <div>
                                        📋
                                    </div>

                                    <h4>
                                        No Questions Yet
                                    </h4>

                                    <p>
                                        Start building your exam
                                        by adding the first question.
                                    </p>

                                </div>

                            ) : (

                                <div className="questions-list">

                                    {exam.questions.map(
                                        (question, index) => (

                                            <div
                                                className="question-management-card"
                                                key={question.id}
                                            >

                                                <div className="question-number">

                                                    Question{" "}
                                                    {index + 1}

                                                </div>


                                                <h4>
                                                    {question.question}
                                                </h4>


                                                {question.question_image && (

                                                    <img
                                                        src={
                                                            question.question_image
                                                        }
                                                        alt="Question"
                                                        className="question-image"
                                                    />

                                                )}


                                                <div className="question-options">

                                                    <div>
                                                        <strong>
                                                            A.
                                                        </strong>

                                                        {question.option_a}

                                                    </div>


                                                    <div>
                                                        <strong>
                                                            B.
                                                        </strong>

                                                        {question.option_b}

                                                    </div>


                                                    {question.option_c && (

                                                        <div>
                                                            <strong>
                                                                C.
                                                            </strong>

                                                            {question.option_c}

                                                        </div>

                                                    )}


                                                    {question.option_d && (

                                                        <div>
                                                            <strong>
                                                                D.
                                                            </strong>

                                                            {question.option_d}

                                                        </div>

                                                    )}

                                                </div>


                                                <div className="correct-answer">

                                                    Correct Answer:

                                                    <strong>
                                                        {" "}
                                                        {question.correct_answer}
                                                    </strong>

                                                </div>


                                                <div className="question-actions">

                                                    <button
                                                        className="exam-management-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/teacher/exams/${exam.id}/questions/${question.id}/edit`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="exam-management-button delete-button"
                                                        onClick={() =>
                                                            handleDeleteQuestion(question.id)
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        {/* =========================
                           ACTIONS
                        ========================= */}

                        <div className="exam-management-actions">

                            <button
                                className="exam-management-button primary"
                                onClick={() =>
                                    navigate(
                                        `/teacher/lessons/${lessonId}/exam/edit`
                                    )
                                }
                            >
                                Edit Exam
                            </button>


                            <button
                                className="exam-management-button"
                                onClick={() =>
                                    navigate(-1)
                                }
                            >
                                ← Back
                            </button>

                        </div>


                    </div>

                )}

            </div>

        </div>

    );

}


export default ExamManagement;
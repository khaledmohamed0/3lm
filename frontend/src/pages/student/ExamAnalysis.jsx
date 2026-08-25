import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import StudentLayout from "../../layouts/StudentLayout";

import "../../styles/exam-analysis.css";



function ExamAnalysis() {

    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchAnalysis = async () => {

            try {

                const response = await api.get(
                    `/courses/exam-analysis/${attemptId}/`
                );
                console.log(
                    "EXAM ANALYSIS:",
                    response.data
                );

                setAnalysis(response.data);

            } catch (error) {

                console.error(
                    "Analysis error:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Unable to load exam analysis."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchAnalysis();

    }, [attemptId]);


    if (loading) {

        return (
            <StudentLayout>

                <div className="analysis-loading">
                    Loading analysis...
                </div>

            </StudentLayout>
        );

    }


    if (error) {

        return (
            <StudentLayout>

                <div className="analysis-error">

                    <h2>
                        Unable to Load Analysis
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </StudentLayout>
        );

    }


    if (!analysis) {
        return null;
    }


    return (
        <StudentLayout>

            <div className="analysis-page">

                {/* Header */}

                <div className="analysis-header">

                    <span>
                        EXAM ANALYSIS
                    </span>

                    <h1>
                        {analysis.exam_title}
                    </h1>

                    <p>
                        {analysis.course_title}
                    </p>

                </div>


                {/* Score */}

                <div className="analysis-score-card">

                    <div>

                        <span>
                            YOUR SCORE
                        </span>

                        <strong>
                            {analysis.score}%
                        </strong>

                    </div>


                    <div>

                        <span>
                            PASSING SCORE
                        </span>

                        <strong>
                            {analysis.passing_score}%
                        </strong>

                    </div>


                    <div>

                        <span>
                            RESULT
                        </span>

                        <strong>
                            {analysis.passed
                                ? "PASSED"
                                : "FAILED"}
                        </strong>

                    </div>

                </div>


                {/* Statistics */}

                <div className="analysis-stats">

                    <div className="analysis-stat">

                        <span>
                            TOTAL QUESTIONS
                        </span>

                        <strong>
                            {analysis.total_questions}
                        </strong>

                    </div>


                    <div className="analysis-stat">

                        <span>
                            CORRECT
                        </span>

                        <strong>
                            {analysis.correct_answers}
                        </strong>

                    </div>


                    <div className="analysis-stat">

                        <span>
                            WRONG
                        </span>

                        <strong>
                            {analysis.wrong_count}
                        </strong>

                    </div>

                </div>


                {/* Wrong Answers */}

                <section className="wrong-answers-section">

                    <div className="section-header">

                        <span>
                            REVIEW
                        </span>

                        <h2>
                            Questions You Got Wrong
                        </h2>

                        <p>
                            Review your mistakes and learn
                            from them.
                        </p>

                    </div>


                    {analysis.wrong_answers.length === 0 ? (

                        <div className="perfect-result">

                            <div>
                                🎉
                            </div>

                            <h3>
                                Perfect Score!
                            </h3>

                            <p>
                                You answered every question
                                correctly.
                            </p>

                        </div>

                    ) : (

                        <div className="wrong-answers-list">

                            {analysis.wrong_answers.map(
                                (item) => (

                                    <div
                                        className="wrong-answer-card"
                                        key={item.question_id}
                                    >

                                        <div className="question-number">
                                            Question {item.order}
                                        </div>

                                        <h3>
                                            {item.question}
                                        </h3>


                                        <div className="answer-row wrong">

                                            <span>
                                                Your answer
                                            </span>

                                            <strong>
                                                {item.selected_answer}
                                            </strong>

                                        </div>


                                        <div className="answer-row correct">

                                            <span>
                                                Correct answer
                                            </span>

                                            <strong>
                                                {item.correct_answer}
                                            </strong>

                                        </div>


                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* Back */}

                <button
                    className="analysis-back-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>

            </div>

            

        </StudentLayout>
        
    );
}


export default ExamAnalysis;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import "../../styles/exam-results.css";


function ExamResultsSlider() {

    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [currentIndex, setCurrentIndex] = useState(0);


    useEffect(() => {

        const fetchResults = async () => {

            try {

                const response = await api.get(
                    "/courses/exam-results/"
                );

                console.log(
                    "EXAM RESULTS:",
                    response.data
                );

                setResults(
                    response.data.results || []
                );

            } catch (error) {

                console.error(
                    "Exam results error:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Unable to load exam results."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchResults();

    }, []);


    const nextExam = () => {

        if (!results.length) return;

        setCurrentIndex(
            (previous) =>
                (previous + 1) % results.length
        );

    };


    const previousExam = () => {

        if (!results.length) return;

        setCurrentIndex(
            (previous) =>
                previous === 0
                    ? results.length - 1
                    : previous - 1
        );

    };


    if (loading) {

        return (
            <section className="exam-results-section">

                <div className="exam-results-loading">
                    Loading exam results...
                </div>

            </section>
        );

    }


    if (error) {

        return (
            <section className="exam-results-section">

                <div className="exam-results-error">
                    {error}
                </div>

            </section>
        );

    }


    if (!results.length) {

        return (
            <section className="exam-results-section">

                <div className="exam-results-header">

                    <div>

                        <span>
                            ASSESSMENTS
                        </span>

                        <h2>
                            Exam Results
                        </h2>

                        <p>
                            Your exam performance will appear here.
                        </p>

                    </div>

                </div>


                <div className="exam-empty">

                    <div className="exam-empty-icon">
                        📝
                    </div>

                    <h3>
                        No exam results yet
                    </h3>

                    <p>
                        Complete your first exam to see
                        your results here.
                    </p>

                </div>

            </section>
        );

    }


    const exam = results[currentIndex];


    return (
        <section className="exam-results-section">

            {/* Header */}

            <div className="exam-results-header">

                <div>

                    <span>
                        ASSESSMENTS
                    </span>

                    <h2>
                        Exam Results
                    </h2>

                    <p>
                        Track your exam performance.
                    </p>

                </div>


                {/* Slider Controls */}

                {results.length > 1 && (

                    <div className="exam-slider-controls">

                        <button
                            type="button"
                            onClick={previousExam}
                            aria-label="Previous exam"
                        >
                            ←
                        </button>

                        <span>
                            {currentIndex + 1} / {results.length}
                        </span>

                        <button
                            type="button"
                            onClick={nextExam}
                            aria-label="Next exam"
                        >
                            →
                        </button>

                    </div>

                )}

            </div>


            {/* Exam Card */}

            <div className="exam-slider">

                <div className="exam-card">

                    <div className="exam-card-top">

                        <div>

                            <span className="exam-label">
                                EXAM
                            </span>

                            <h3>
                                {exam.exam_title}
                            </h3>

                            <p>
                                {exam.lesson_title}
                            </p>

                        </div>


                        <div className="exam-result-status">

                            <span
                                className={
                                    exam.passed
                                        ? "passed"
                                        : "failed"
                                }
                            >
                                {exam.passed
                                    ? "✓ Passed"
                                    : "✕ Failed"}
                            </span>

                        </div>

                    </div>


                    {/* Score */}

                    <div className="exam-score-container">

                        <span>
                            YOUR SCORE
                        </span>

                        <strong>
                            {exam.score}%
                        </strong>

                    </div>


                    {/* Details */}

                    <div className="exam-details">

                        <div>

                            <span>
                                Passing Score
                            </span>

                            <strong>
                                {exam.passing_score}%
                            </strong>

                        </div>


                        <div>

                            <span>
                                Course
                            </span>

                            <strong>
                                {exam.course_title}
                            </strong>

                        </div>

                    </div>


                    {/* Analysis */}

                    <button
                        type="button"
                        className="exam-analysis-button"
                        onClick={() => {

                            console.log(
                                "ANALYSIS CLICK:",
                                exam.attempt_id
                            );

                            navigate(
                                `/student/exams/${exam.attempt_id}/analysis`
                            );

                        }}
                    >
                        View Analysis →
                    </button>

                </div>

            </div>

        </section>
    );
}


export default ExamResultsSlider;
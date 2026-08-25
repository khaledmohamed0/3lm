import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";

import "../../styles/exam.css";


function Exam() {

    const { examId, courseId } = useParams();

    const navigate = useNavigate();

    const [exam, setExam] = useState(null);

    const [answers, setAnswers] = useState({});

    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [result, setResult] =
        useState(null);

    const [error, setError] =
        useState("");

    
        /*
    |--------------------------------------------------------------------------
    | Get Exam
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const fetchExam = async () => {

            try {

                const response = await api.get(
                    `/courses/exams/${examId}/`
                );

                console.log(
                    "EXAM:",
                    response.data
                );

                setExam(response.data);

            } catch (error) {

                console.error(
                    "Exam error:",
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

    }, [examId]);


    /*
    |--------------------------------------------------------------------------
    | Select Answer
    |--------------------------------------------------------------------------
    */

    const selectAnswer = (
        questionId,
        answer
    ) => {

        setAnswers(
            (previous) => ({
                ...previous,
                [questionId]: answer,
            })
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Next Question
    |--------------------------------------------------------------------------
    */

    const nextQuestion = () => {

        if (
            currentQuestion <
            exam.questions.length - 1
        ) {

            setCurrentQuestion(
                currentQuestion + 1
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Previous Question
    |--------------------------------------------------------------------------
    */

    const previousQuestion = () => {

        if (currentQuestion > 0) {

            setCurrentQuestion(
                currentQuestion - 1
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Submit Exam
    |--------------------------------------------------------------------------
    */

    const submitExam = async () => {

        try {

            setSubmitting(true);

            setError("");


            const response =
                await api.post(
                    `/courses/exams/${examId}/submit/`,
                    {
                        answers,
                    }
                );


            console.log(
                "EXAM RESULT:",
                response.data
            );


            setResult(
                response.data
            );


        } catch (error) {

            console.error(
                "Submit exam error:",
                error
            );


            setError(
                error.response?.data?.detail ||
                "Unable to submit exam."
            );

        } finally {

            setSubmitting(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <div className="exam-loading">
                Loading exam...
            </div>
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error && !exam) {

        return (

            <div className="exam-error">

                <div className="exam-error-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to Load Exam
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

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Result
    |--------------------------------------------------------------------------
    */

    if (result) {

        return (

            <div className="exam-result-page">

                <div
                    className={`result-card ${result.passed
                            ? "passed"
                            : "failed"
                        }`}
                >

                    <div className="result-icon">

                        {result.passed
                            ? "🎉"
                            : "❌"}

                    </div>


                    <span className="result-label">

                        {result.passed
                            ? "EXAM PASSED"
                            : "EXAM FAILED"}

                    </span>


                    <h1>

                        {result.score}%

                    </h1>


                    <p>

                        Passing score:
                        {" "}
                        {result.passing_score}%

                    </p>


                    <div className="result-message">

                        {result.message}

                    </div>


                    {result.passed ? (

                        <button
                            className="result-button"
                            onClick={() =>
                                navigate(
                                    `/student/courses/${courseId}`
                                )
                            }
                        >
                            Continue →
                        </button>

                    ) : (

                        <button
                            className="result-button"
                            onClick={() => {

                                setResult(null);

                                setAnswers({});

                                setCurrentQuestion(0);

                            }}
                        >
                            Try Again
                        </button>

                    )}

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Current Question
    |--------------------------------------------------------------------------
    */

    const question =
        exam.questions[currentQuestion];

    console.log("CURRENT QUESTION:", question);
    console.log(
        "QUESTION IMAGE:",
        question?.question_image
    );


    const options = [

        {
            key: "A",
            text: question.option_a,
        },

        {
            key: "B",
            text: question.option_b,
        },

        {
            key: "C",
            text: question.option_c,
        },

        {
            key: "D",
            text: question.option_d,
        },

    ].filter(
        (option) => option.text
    );


    const isLastQuestion =
        currentQuestion ===
        exam.questions.length - 1;


    const answeredCount =
        Object.keys(answers).length;


    /*
    |--------------------------------------------------------------------------
    | Exam UI
    |--------------------------------------------------------------------------
    */

    return (

        <div className="exam-page">


            {/* Header */}

            <header className="exam-header">

                <button
                    className="exam-back"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    ← Exit Exam
                </button>


                <div className="exam-title">

                    <span>
                        EXAM
                    </span>

                    <h1>
                        {exam.title}
                    </h1>

                </div>


                <div className="exam-info">

                    <div>

                        <strong>
                            {exam.time_limit}
                        </strong>

                        <small>
                            MINUTES
                        </small>

                    </div>


                    <div>

                        <strong>
                            {exam.passing_score}%
                        </strong>

                        <small>
                            TO PASS
                        </small>

                    </div>

                </div>

            </header>


            {/* Progress */}

            <div className="exam-progress">

                <div className="progress-top">

                    <span>

                        Question{" "}
                        {currentQuestion + 1}
                        {" "}
                        of{" "}
                        {exam.questions.length}

                    </span>


                    <span>

                        {answeredCount}
                        /
                        {exam.questions.length}
                        {" "}
                        answered

                    </span>

                </div>


                <div className="progress-track">

                    <div
                        className="progress-fill"
                        style={{
                            width: `${(
                                    (currentQuestion + 1)
                                    /
                                    exam.questions.length
                                ) * 100
                                }%`,
                        }}
                    />

                </div>

            </div>


            {/* Question */}

            <main className="question-card">

                <div className="question-card">

                    <div className="question-number">
                        Question {currentQuestion + 1}
                    </div>

                    <div className="question-text">
                        {question.question}
                    </div>

                    {question.question_image && (
                        <div className="question-image">
                            <img
                                src={question.question_image}
                                alt={`Question ${currentQuestion + 1}`}
                            />
                        </div>
                    )}
                    {/* options هنا */}

                </div>


                <div className="answers">

                    {options.map(
                        (option) => {

                            const selected =
                                answers[
                                question.id
                                ] === option.key;


                            return (

                                <button
                                    key={option.key}
                                    className={`answer ${selected
                                            ? "selected"
                                            : ""
                                        }`}
                                    onClick={() =>
                                        selectAnswer(
                                            question.id,
                                            option.key
                                        )
                                    }
                                >

                                    <span className="answer-key">

                                        {option.key}

                                    </span>


                                    <span className="answer-text">

                                        {option.text}

                                    </span>


                                    {selected && (

                                        <span className="answer-check">

                                            ✓

                                        </span>

                                    )}

                                </button>

                            );

                        }
                    )}

                </div>


                {/* Error */}

                {error && (

                    <div className="submit-error">

                        {error}

                    </div>

                )}


                {/* Navigation */}

                <div className="question-navigation">

                    <button
                        className="previous-button"
                        onClick={
                            previousQuestion
                        }
                        disabled={
                            currentQuestion === 0
                        }
                    >
                        ← Previous
                    </button>


                    {isLastQuestion ? (

                        <button
                            className="submit-button"
                            onClick={submitExam}
                            disabled={
                                submitting ||
                                answeredCount === 0
                            }
                        >

                            {submitting
                                ? "Submitting..."
                                : "Submit Exam →"}

                        </button>

                    ) : (

                        <button
                            className="next-button"
                            onClick={
                                nextQuestion
                            }
                        >

                            Next →

                        </button>

                    )}

                </div>

            </main>

        </div>

    );
}


export default Exam;
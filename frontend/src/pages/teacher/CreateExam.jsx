import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/create-exam.css";


function CreateExam() {

    const { lessonId } = useParams();

    const navigate = useNavigate();

    const [editingQuestionId, setEditingQuestionId] =
        useState(null);

    const [questionImage, setQuestionImage] =
        useState(null);


    const [title, setTitle] = useState("");

    const [passingScore, setPassingScore] =
        useState(50);

    const [timeLimit, setTimeLimit] =
        useState(30);

    const [isPublished, setIsPublished] =
        useState(false);


    const [questions, setQuestions] =
        useState([]);


    const [question, setQuestion] =
        useState("");

    const [optionA, setOptionA] =
        useState("");

    const [optionB, setOptionB] =
        useState("");

    const [optionC, setOptionC] =
        useState("");

    const [optionD, setOptionD] =
        useState("");

    const [correctAnswer, setCorrectAnswer] =
        useState("A");


    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    const addQuestion = () => {

        if (!question.trim()) {
            setError("Please enter a question.");
            return;
        }

        if (!optionA.trim() || !optionB.trim()) {
            setError(
                "Option A and Option B are required."
            );
            return;
        }


        if (
            correctAnswer === "C" &&
            !optionC.trim()
        ) {
            setError(
                "Option C cannot be empty."
            );
            return;
        }


        if (
            correctAnswer === "D" &&
            !optionD.trim()
        ) {
            setError(
                "Option D cannot be empty."
            );
            return;
        }


        const newQuestion = {

            question: question.trim(),

            option_a: optionA.trim(),

            option_b: optionB.trim(),

            option_c: optionC.trim(),

            option_d: optionD.trim(),

            correct_answer: correctAnswer,

            order: questions.length + 1,

        };


        setQuestions([
            ...questions,
            newQuestion
        ]);


        setQuestion("");
        setOptionA("");
        setOptionB("");
        setOptionC("");
        setOptionD("");
        setCorrectAnswer("A");

        setError("");
    };


    const removeQuestion = (index) => {

        const updatedQuestions =
            questions
                .filter(
                    (_, questionIndex) =>
                        questionIndex !== index
                )
                .map(
                    (item, questionIndex) => ({
                        ...item,
                        order: questionIndex + 1,
                    })
                );

        setQuestions(updatedQuestions);
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if (!title.trim()) {

            setError(
                "Please enter the exam title."
            );

            return;
        }


        if (questions.length === 0) {

            setError(
                "Please add at least one question."
            );

            return;
        }


        setSaving(true);


        try {

            const response = await api.post(
                "/courses/teacher/exams/create/",
                {
                    lesson: lessonId,

                    title: title.trim(),

                    passing_score:
                        Number(passingScore),

                    time_limit:
                        Number(timeLimit),

                    is_published:
                        isPublished,

                    questions: questions,
                }
            );


            console.log(
                "EXAM CREATED:",
                response.data
            );


            navigate(
                "/teacher/dashboard"
            );


        } catch (error) {

            console.error(
                "Create exam error:",
                error
            );


            setError(
                error.response?.data?.detail ||
                "Unable to create exam."
            );


        } finally {

            setSaving(false);

        }
    };


    return (

        <div className="create-exam-page">

            <div className="create-exam-container">


                <button
                    type="button"
                    className="create-exam-back"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    ← Back
                </button>


                <div className="create-exam-header">

                    <span>
                        EXAM BUILDER
                    </span>

                    <h1>
                        Create Exam
                    </h1>

                    <p>
                        Create your exam and add its
                        questions before saving.
                    </p>

                </div>


                {error && (

                    <div className="create-exam-error">
                        {error}
                    </div>

                )}


                <form
                    className="create-exam-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                        EXAM INFORMATION
                    ================================================= */}

                    <div className="exam-section">

                        <div className="exam-section-header">

                            <span>
                                01
                            </span>

                            <div>
                                <h2>
                                    Exam Information
                                </h2>

                                <p>
                                    Basic information about
                                    this exam.
                                </p>
                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Exam Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                placeholder="Example: Lesson 1 Exam"
                                required
                            />

                        </div>


                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    Passing Score (%)
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={passingScore}
                                    onChange={(e) =>
                                        setPassingScore(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Time Limit (minutes)
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={timeLimit}
                                    onChange={(e) =>
                                        setTimeLimit(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

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

                            Publish exam immediately

                        </label>

                    </div>


                    {/* =================================================
                        QUESTIONS
                    ================================================= */}

                    <div className="exam-section">

                        <div className="exam-section-header">

                            <span>
                                02
                            </span>

                            <div>

                                <h2>
                                    Questions
                                </h2>

                                <p>
                                    Add the questions
                                    students will answer.
                                </p>

                            </div>

                        </div>


                        {/* Existing Questions */}

                        {questions.length > 0 && (

                            <div className="added-questions">

                                {questions.map(
                                    (item, index) => (

                                        <div
                                            className="added-question"
                                            key={index}
                                        >

                                            <div className="added-question-header">

                                                <span>
                                                    Question {item.order}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeQuestion(
                                                            index
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>


                                            <h3>
                                                {item.question}
                                            </h3>


                                            <div className="added-options">

                                                <div>
                                                    <strong>
                                                        A.
                                                    </strong>

                                                    {item.option_a}
                                                </div>

                                                <div>
                                                    <strong>
                                                        B.
                                                    </strong>

                                                    {item.option_b}
                                                </div>

                                                {item.option_c && (

                                                    <div>
                                                        <strong>
                                                            C.
                                                        </strong>

                                                        {item.option_c}
                                                    </div>

                                                )}

                                                {item.option_d && (

                                                    <div>
                                                        <strong>
                                                            D.
                                                        </strong>

                                                        {item.option_d}
                                                    </div>

                                                )}

                                            </div>


                                            <div className="question-correct">

                                                Correct:
                                                <strong>
                                                    {item.correct_answer}
                                                </strong>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}


                        {/* New Question */}

                        <div className="new-question">

                            <div className="new-question-title">

                                <span>
                                    QUESTION{" "}
                                    {questions.length + 1}
                                </span>

                                <h3>
                                    Add Question
                                </h3>

                            </div>


                            <div className="form-group">

                                <label>
                                    Question
                                </label>

                                <textarea
                                    value={question}
                                    onChange={(e) =>
                                        setQuestion(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Write the question..."
                                    rows="4"
                                />
                                <div className="form-group">

                                    <label>
                                        Question Image
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            setQuestionImage(
                                                e.target.files[0] || null
                                            );
                                        }}
                                    />

                                    <small className="image-help">
                                        Optional — useful for Math, Statistics,
                                        diagrams and formulas.
                                    </small>

                                    

                                </div>

                            </div>


                            <div className="options-grid">

                                <div className="form-group">

                                    <label>
                                        Option A
                                    </label>

                                    <input
                                        value={optionA}
                                        onChange={(e) =>
                                            setOptionA(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Option A"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Option B
                                    </label>

                                    <input
                                        value={optionB}
                                        onChange={(e) =>
                                            setOptionB(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Option B"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Option C
                                    </label>

                                    <input
                                        value={optionC}
                                        onChange={(e) =>
                                            setOptionC(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Option C"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Option D
                                    </label>

                                    <input
                                        value={optionD}
                                        onChange={(e) =>
                                            setOptionD(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Option D"
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label>
                                    Correct Answer
                                </label>

                                <select
                                    value={correctAnswer}
                                    onChange={(e) =>
                                        setCorrectAnswer(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="A">
                                        A
                                    </option>

                                    <option value="B">
                                        B
                                    </option>

                                    <option value="C">
                                        C
                                    </option>

                                    <option value="D">
                                        D
                                    </option>

                                </select>

                            </div>


                            <button
                                type="button"
                                className="add-question-button"
                                onClick={addQuestion}
                            >
                                + Add Question
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        SAVE
                    ================================================= */}

                    <div className="create-exam-footer">

                        <div>

                            <strong>
                                {questions.length}
                            </strong>

                            <span>
                                question
                                {questions.length !== 1
                                    ? "s"
                                    : ""}
                            </span>

                        </div>


                        <button
                            type="submit"
                            className="create-exam-submit"
                            disabled={saving}
                        >

                            {saving
                                ? "Creating Exam..."
                                : "Create Exam"}

                        </button>

                    </div>


                </form>

            </div>

        </div>

    );
}


export default CreateExam;
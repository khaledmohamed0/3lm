import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/create-question.css";


function EditExamQuestion() {

    const { questionId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
        order: 1,
    });

    const [questionImage, setQuestionImage] = useState(null);
    const [existingImage, setExistingImage] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    /* =========================
       LOAD QUESTION
    ========================= */

    useEffect(() => {

        const fetchQuestion = async () => {

            try {

                const response = await api.get(
                    `/courses/teacher/questions/${questionId}/`
                );

                const data = response.data;

                setForm({
                    question: data.question || "",
                    option_a: data.option_a || "",
                    option_b: data.option_b || "",
                    option_c: data.option_c || "",
                    option_d: data.option_d || "",
                    correct_answer:
                        data.correct_answer || "A",
                    order: data.order || 1,
                });

                setExistingImage(
                    data.question_image || ""
                );

            } catch (error) {

                console.error(
                    "Load question error:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Unable to load question."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchQuestion();

    }, [questionId]);


    /* =========================
       INPUT CHANGE
    ========================= */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    /* =========================
       SAVE
    ========================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);
        setError("");


        try {

            const formData = new FormData();

            formData.append(
                "question",
                form.question
            );

            formData.append(
                "option_a",
                form.option_a
            );

            formData.append(
                "option_b",
                form.option_b
            );

            formData.append(
                "option_c",
                form.option_c
            );

            formData.append(
                "option_d",
                form.option_d
            );

            formData.append(
                "correct_answer",
                form.correct_answer
            );

            formData.append(
                "order",
                form.order
            );


            if (questionImage) {

                formData.append(
                    "question_image",
                    questionImage
                );

            }


            await api.patch(
                `/courses/teacher/questions/${questionId}/`,
                formData
            );


            navigate(-1);


        } catch (error) {

            console.error(
                "Update question error:",
                error
            );

            setError(
                error.response?.data ||
                "Failed to update question."
            );

        } finally {

            setSaving(false);

        }

    };


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (
            <div className="create-question-page">

                <div className="create-question-container">

                    <div className="create-question-card">

                        Loading question...

                    </div>

                </div>

            </div>
        );

    }


    /* =========================
       ERROR
    ========================= */

    if (error && !form.question) {

        return (
            <div className="create-question-page">

                <div className="create-question-container">

                    <div className="create-question-error">

                        {typeof error === "string"
                            ? error
                            : JSON.stringify(error)}

                    </div>

                </div>

            </div>
        );

    }


    return (

        <div className="create-question-page">

            <div className="create-question-container">


                {/* HEADER */}

                <div className="create-question-header">

                    <span>
                        EXAM MANAGEMENT
                    </span>

                    <h1>
                        Edit Question
                    </h1>

                    <p>
                        Update the question and its answers.
                    </p>

                </div>


                {/* FORM */}

                <form
                    className="create-question-card"
                    onSubmit={handleSubmit}
                >


                    {error && (

                        <div className="create-question-error">

                            {typeof error === "string"
                                ? error
                                : JSON.stringify(error)}

                        </div>

                    )}


                    {/* QUESTION */}

                    <div className="form-group">

                        <label>
                            Question
                        </label>

                        <textarea
                            name="question"
                            value={form.question}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* CURRENT IMAGE */}

                    {existingImage && (

                        <div className="current-question-image">

                            <label>
                                Current Image
                            </label>

                            <img
                                src={existingImage}
                                alt="Current question"
                            />

                        </div>

                    )}


                    {/* NEW IMAGE */}

                    <div className="form-group">

                        <label>
                            Replace Question Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setQuestionImage(
                                    e.target.files[0]
                                )
                            }
                        />

                        <small>
                            Leave empty to keep the current image.
                        </small>

                    </div>


                    {/* OPTIONS */}

                    <div className="options-grid">


                        <div className="form-group">

                            <label>
                                Option A
                            </label>

                            <input
                                type="text"
                                name="option_a"
                                value={form.option_a}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Option B
                            </label>

                            <input
                                type="text"
                                name="option_b"
                                value={form.option_b}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Option C
                            </label>

                            <input
                                type="text"
                                name="option_c"
                                value={form.option_c}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Option D
                            </label>

                            <input
                                type="text"
                                name="option_d"
                                value={form.option_d}
                                onChange={handleChange}
                            />

                        </div>


                    </div>


                    {/* CORRECT ANSWER */}

                    <div className="form-group">

                        <label>
                            Correct Answer
                        </label>

                        <select
                            name="correct_answer"
                            value={form.correct_answer}
                            onChange={handleChange}
                        >

                            <option value="A">
                                Option A
                            </option>

                            <option value="B">
                                Option B
                            </option>

                            <option value="C">
                                Option C
                            </option>

                            <option value="D">
                                Option D
                            </option>

                        </select>

                    </div>


                    {/* ORDER */}

                    <div className="form-group">

                        <label>
                            Question Order
                        </label>

                        <input
                            type="number"
                            name="order"
                            min="1"
                            value={form.order}
                            onChange={handleChange}
                        />

                    </div>


                    {/* ACTIONS */}

                    <div className="create-question-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate(-1)
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : "Save Changes"}

                        </button>

                    </div>


                </form>

            </div>

        </div>

    );

}


export default EditExamQuestion;
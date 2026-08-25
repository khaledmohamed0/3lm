import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/create-course.css";

function CreateCourse() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [isPublished, setIsPublished] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);
            formData.append("price", price || "0");
            formData.append(
                "is_published",
                isPublished ? "true" : "false"
            );

            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }

            const response = await api.post(
                "/courses/teacher/courses/",
                formData
            );

            console.log(
                "COURSE CREATED:",
                response.data
            );

            navigate("/teacher/dashboard");

        } catch (error) {

            console.error(
                "Create course error:",
                error
            );

            if (error.response?.data) {

                const data = error.response.data;

                if (typeof data === "object") {

                    const messages = Object.entries(data)
                        .map(
                            ([field, message]) =>
                                `${field}: ${Array.isArray(message)
                                    ? message.join(", ")
                                    : message}`
                        )
                        .join("\n");

                    setError(messages);

                } else {
                    setError(String(data));
                }

            } else {

                setError(
                    "Unable to create course."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="create-course-page">

            <div className="create-course-container">

                {/* Back */}

                <button
                    className="create-course-back"
                    onClick={() =>
                        navigate("/teacher/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>


                {/* Header */}

                <div className="create-course-header">

                    <span>
                        COURSE MANAGEMENT
                    </span>

                    <h1>
                        Create Course
                    </h1>

                    <p>
                        Create a new course and start
                        adding your lessons.
                    </p>

                </div>


                {/* Error */}

                {error && (

                    <div className="create-course-error">
                        {error}
                    </div>

                )}


                {/* Form */}

                <form
                    className="create-course-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-section">

                        <div className="form-section-title">

                            <span>
                                COURSE INFORMATION
                            </span>

                            <h2>
                                Basic Details
                            </h2>

                        </div>


                        {/* Title */}

                        <div className="form-group">

                            <label>
                                Course Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                placeholder="e.g. Mathematics 1"
                                required
                            />

                        </div>


                        {/* Description */}

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
                                placeholder="Describe your course..."
                                rows="6"
                            />

                        </div>


                        {/* Price */}

                        <div className="form-group">

                            <label>
                                Course Price
                            </label>

                            <div className="price-input">

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(
                                            e.target.value
                                        )
                                    }
                                    placeholder="0.00"
                                />

                                <span>
                                    EGP
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* Thumbnail */}

                    <div className="form-section">

                        <div className="form-section-title">

                            <span>
                                COURSE IMAGE
                            </span>

                            <h2>
                                Thumbnail
                            </h2>

                        </div>


                        <div className="thumbnail-upload">

                            <input
                                id="course-thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setThumbnail(
                                        e.target.files[0]
                                    )
                                }
                            />

                            <label
                                htmlFor="course-thumbnail"
                            >

                                <div className="upload-icon">
                                    🖼️
                                </div>

                                <strong>
                                    {thumbnail
                                        ? thumbnail.name
                                        : "Choose Course Thumbnail"}
                                </strong>

                                <span>
                                    PNG, JPG or WEBP
                                </span>

                            </label>

                        </div>

                    </div>


                    {/* Publishing */}

                    <div className="form-section">

                        <div className="publish-row">

                            <div>

                                <span>
                                    PUBLISH COURSE
                                </span>

                                <h2>
                                    Make this course available
                                </h2>

                                <p>
                                    Students will be able
                                    to see and enroll in
                                    this course.
                                </p>

                            </div>


                            <label className="switch">

                                <input
                                    type="checkbox"
                                    checked={isPublished}
                                    onChange={(e) =>
                                        setIsPublished(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span className="slider" />

                            </label>

                        </div>

                    </div>


                    {/* Actions */}

                    <div className="create-course-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate(
                                    "/teacher/dashboard"
                                )
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="create-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Course →"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default CreateCourse;
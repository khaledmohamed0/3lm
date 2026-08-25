
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/auth.css";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");


        if (formData.password.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );

            return;
        }


        if (
            formData.password !==
            formData.confirm_password
        ) {
            setError(
                "Passwords do not match."
            );

            return;
        }


        try {
            setLoading(true);

            await api.post(
                "/auth/register/",
                {
                    username: formData.username,
                    email: formData.email,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    password: formData.password,
                    phone_number: formData.phone_number,
                }
            );


            setSuccess(
                "Account created successfully! Redirecting to login..."
            );


            setTimeout(() => {
                navigate("/login");
            }, 1200);


        } catch (error) {

            console.error(
                "Signup error:",
                error
            );


            const data =
                error.response?.data;


            if (data) {

                const messages = [];


                Object.entries(data).forEach(
                    ([field, value]) => {

                        if (Array.isArray(value)) {

                            messages.push(
                                `${ field }: ${ value.join(" ") } `
                            );

                        } else {

                            messages.push(
                                `${ field }: ${ value } `
                            );

                        }

                    }
                );


                setError(
                    messages.join(" ")
                    ||
                    "Unable to create account."
                );

            } else {

                setError(
                    "Unable to connect to the server."
                );

            }

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-page">

            {/* LEFT BRANDING */}

            <div className="auth-brand">

                <div className="brand-content">

                    <div className="brand-logo">
                        K
                    </div>

                    <span className="brand-name">
                        KMG
                    </span>


                    <h1>
                        Start.
                        <br />
                        Learn.
                        <br />
                        Grow.
                    </h1>


                    <p>
                        Create your account and start
                        building your knowledge with
                        structured courses and exams.
                    </p>


                    <div className="brand-stats">

                        <div>
                            <strong>Courses</strong>
                            <span>
                                Learn at your pace
                            </span>
                        </div>


                        <div>
                            <strong>Lessons</strong>
                            <span>
                                Structured learning
                            </span>
                        </div>


                        <div>
                            <strong>Exams</strong>
                            <span>
                                Track your progress
                            </span>
                        </div>

                    </div>

                </div>

            </div>


            {/* SIGNUP */}

            <div className="auth-container">

                <div className="auth-card">


                    {/* Mobile Logo */}

                    <div className="auth-mobile-logo">

                        <div className="brand-logo">
                            K
                        </div>

                        <span>
                            KMG Learning
                        </span>

                    </div>


                    {/* Header */}

                    <div className="auth-header">

                        <span className="auth-label">
                            GET STARTED
                        </span>

                        <h2>
                            Create your account
                        </h2>

                        <p>
                            Join KMG Learning and start
                            your journey.
                        </p>

                    </div>


                    {/* FORM */}

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >


                        {/* First + Last Name */}

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "1fr 1fr",
                                gap: "12px",
                            }}
                        >

                            <div className="form-group">

                                <label>
                                    First Name
                                </label>

                                <div className="input-wrapper">

                                    <input
                                        type="text"
                                        name="first_name"
                                        value={
                                            formData.first_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="First name"
                                        required
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label>
                                    Last Name
                                </label>

                                <div className="input-wrapper">

                                    <input
                                        type="text"
                                        name="last_name"
                                        value={
                                            formData.last_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Last name"
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Username */}

                        <div className="form-group">

                            <label>
                                Username
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    @
                                </span>

                                <input
                                    type="text"
                                    name="username"
                                    value={
                                        formData.username
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Choose a username"
                                    autoComplete="username"
                                    required
                                />

                            </div>

                        </div>


                        {/* Email */}

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    @
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    required
                                />

                            </div>

                        </div>

                        {/* Phone Number */}

                        <div className="form-group">

                            <label htmlFor="phone_number">
                                Phone Number
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    
                                </span>

                                <input
                                    id="phone_number"
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    placeholder="01xxxxxxxxx"
                                    autoComplete="tel"
                                    inputMode="numeric"
                                    maxLength={11}
                                    required
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    •
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* Confirm Password */}

                        <div className="form-group">

                            <label>
                                Confirm Password
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    •
                                </span>

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirm_password"
                                    value={
                                        formData.confirm_password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Repeat your password"
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* Error */}

                        {error && (

                            <div className="auth-error">

                                <span>
                                    !
                                </span>

                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* Success */}

                        {success && (

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "12px 14px",
                                    borderRadius: "9px",
                                    background: "#f0fdf4",
                                    color: "#15803d",
                                    border:
                                        "1px solid #dcfce7",
                                    fontSize: "12px",
                                }}
                            >

                                <span>
                                    ✓
                                </span>

                                {success}

                            </div>

                        )}


                        {/* Submit */}

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </form>


                    {/* Footer */}

                    <div className="auth-footer">

                        <span>
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Sign in
                        </button>

                    </div>


                    <div className="auth-security">

                        <span>
                            🔒
                        </span>

                        Secure learning platform

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Signup;


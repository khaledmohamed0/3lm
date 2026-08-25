
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "../../styles/auth.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(username, password);

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.detail ||
                "Invalid username or password."
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-page">

            {/* Left Branding */}

            <div className="auth-brand">

                <div className="brand-content">

                    <div className="brand-logo">
                        K
                    </div>

                    <span className="brand-name">
                        KMG
                    </span>

                    <h1>
                        Learn.
                        <br />
                        Build.
                        <br />
                        Grow.
                    </h1>

                    <p>
                        Your learning journey starts here.
                        Learn from structured courses,
                        complete lessons, and test your knowledge.
                    </p>

                    <div className="brand-stats">

                        <div>
                            <strong>Courses</strong>
                            <span>Learn at your pace</span>
                        </div>

                        <div>
                            <strong>Lessons</strong>
                            <span>Structured learning</span>
                        </div>

                        <div>
                            <strong>Exams</strong>
                            <span>Track your progress</span>
                        </div>

                    </div>

                </div>

            </div>


            {/* Login */}

            <div className="auth-container">

                <div className="auth-card">

                    <div className="auth-mobile-logo">
                        <div className="brand-logo">
                            K
                        </div>

                        <span>
                            KMG Learning
                        </span>
                    </div>


                    <div className="auth-header">

                        <span className="auth-label">
                            WELCOME BACK
                        </span>

                        <h2>
                            Sign in to your account
                        </h2>

                        <p>
                            Continue your learning journey.
                        </p>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

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
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    required
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div className="form-group">

                            <div className="label-row">

                                <label>
                                    Password
                                </label>

                            </div>


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
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
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


                        {/* Error */}

                        {error && (

                            <div className="auth-error">

                                <span>!</span>

                                <p>
                                    {error}
                                </p>

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
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </form>


                    <div className="auth-footer">

                        <span>
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/signup")
                            }
                        >
                            Create account
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

export default Login;


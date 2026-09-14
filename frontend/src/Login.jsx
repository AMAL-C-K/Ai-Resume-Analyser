import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import AuthNavbar from "./AuthNavbar";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();

        setError("");

        if (!username.trim() || !password) {
            setError("Username and password are required.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "https://ai-resume-analyser-api-8k49.onrender.com/api/login/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        username: username.trim(),
                        password: password,
                    }),
                }
            );

            const text = await response.text();

            console.log("Login status:", response.status);
            console.log("Login response:", text);

            let data;

            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                throw new Error(
                    `Login API returned an invalid response. Status: ${response.status}`
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    data.error ||
                    "Login failed."
                );
            }

            localStorage.setItem(
                "access",
                data.access
            );

            localStorage.setItem(
                "refresh",
                data.refresh
            );

            localStorage.setItem(
                "username",
                username.trim()
            );

            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);

            setError(
                error.message ||
                "Something went wrong."
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <>
             <AuthNavbar />
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <h1>Welcome Back</h1>

                    <p>
                        Login to analyze your resumes with AI.
                    </p>

                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    <div className="form-group">
                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            placeholder="Enter your username"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Don't have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create one
                    </button>

                </div>

            </div>

        </div>
        </>     
    );
}

export default Login;

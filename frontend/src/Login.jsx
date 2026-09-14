import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

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
                "https://ai-resume-analyser-80vh.onrender.com/api/login/",
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

            // Read response as text first
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

            // Save JWT tokens
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            localStorage.setItem("username", username.trim());

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);

            setError(error.message);

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
    <div className="auth-card">

        <div className="auth-brand">
            <span>Resume</span>AI
        </div>

        <h1>Welcome back</h1>

        <p className="auth-subtitle">
            Login to analyze your resumes with AI.
        </p>

        {/* your existing error message */}

        <form onSubmit={handleLogin}>

            <div className="form-group">
                <label>Username</label>

                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                />
            </div>

            <div className="form-group">
                <label>Password</label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />
            </div>

            <button
                type="submit"
                className="auth-btn"
                disabled={loading}
            >
                {loading ? "Logging in..." : "Login"}
            </button>

        </form>

        <p className="auth-footer">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>
                Create one
            </span>
        </p>

    </div>
</div>
            
    );
}

export default Login;

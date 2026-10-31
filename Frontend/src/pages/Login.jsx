
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Login() {
  const navigate = useNavigate();
const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };


const handleSubmit = async (event) => {
  event.preventDefault();
  setMessage("");
  setLoading(true);

  try {
    const user = await api.post("/api/auth/login", form);

    if (!user || !user.role) {
      setMessage("Login response is missing user details.");
      console.error("Unexpected login response:", user);
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("authChanged"));

    if (user.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (error) {
    console.error("Login error:", error);
    setMessage(error.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};



  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-logo">
          <span className="auth-logo-icon">T</span>
          Textile<span>Store</span>
        </Link>

        <p className="auth-eyebrow">WELCOME BACK</p>
        <h1>Sign in to your account</h1>
        <p className="auth-description">
          Continue exploring beautiful textiles and timeless designs.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>

            <div className="password-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
  type="submit"
  className="auth-submit"
  disabled={loading}
>
  {loading ? "Signing in..." : "Sign In"}
</button>

          {message && (
            <p className="auth-message" role="status">
              {message}
            </p>
          )}
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>

        <Link to="/" className="auth-back-home">
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}

export default Login;

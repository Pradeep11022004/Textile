
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { api } from "../services/api";


function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };
  
const handleSubmit = async (event) => {
  event.preventDefault();
  setMessage("");
  setError("");

  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    const userData = {
     name: form.name.trim(),
  email: form.email.trim(),
  password: form.password,
  enabled: true
    };

    const response = await api.post(
      "/api/users/register",
      userData
    );

    setMessage("Registration successful! Redirecting to login...");

    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (err) {
    setError(err.message || "Registration failed.");
  }
};

  return (
    <main className="auth-page">
      <section className="auth-card register-card">
        <Link to="/" className="auth-logo">
          <span className="auth-logo-icon">T</span>
          Textile<span>Store</span>
        </Link>

        <p className="auth-eyebrow">JOIN OUR COMMUNITY</p>
        <h1>Create Your Account</h1>

        <p className="auth-description">
          Create an account to enjoy a more convenient shopping experience.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
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
            <label htmlFor="register-phone">Phone Number</label>
            <input
              id="register-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit phone number"
              pattern="[0-9]{10}"
              maxLength={10}
              autoComplete="tel"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Password</label>

            <div className="password-input-wrapper">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
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

          <div className="auth-field">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <button type="submit" className="auth-submit">
            Create Account
          </button>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="auth-message" role="status">
              {message}
            </p>
          )}
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <Link to="/" className="auth-back-home">
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}

export default Register;

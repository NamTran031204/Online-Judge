import "./auth.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  signup,
  clearError,
} from "../../redux/slices/user-slice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Code2, Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const [authMode, setAuthMode] = useState("login"); // login | register
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(clearError());
  }, [authMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;

    if (authMode === "login") {
      result = await dispatch(
        login({
          username: form.username,
          password: form.password,
        })
      );
    } else {
      result = await dispatch(
        signup({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        })
      );
    }

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <Link to="/" className="auth-logo">
          <Code2 className="auth-logo-icon" />
          <span className="auth-logo-text">OnlineJudge</span>
        </Link>

        <p className="auth-subtitle">
          Practice coding. Compete. Improve.
        </p>
      </div>
      <div className="auth-container">

        {/* header */}
        <div className="auth-floating-header">
          <h2>
            {authMode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p>
            {authMode === "login"
              ? "Enter your credentials to access your account"
              : "Join thousands of competitive programmers"}
          </p>
        </div>

        {/* auth form */}
        <form className="auth-card" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          {authMode === "login" ? (
            <>
              <label htmlFor="username-input">Username</label>
              <input
                id="username-input"
                type="text"
                placeholder="coder123"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                required
              />
            </>

          ) : (
            <>
              <label htmlFor="username-input">Username</label>
              <input
                id="username-input"
                type="text"
                placeholder="coder123"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                required
              />

              <label htmlFor="email-input">Email</label>
              <input
                id="email-input"
                type="email"
                placeholder="coder123@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </>
          )}

          <label htmlFor="password-input">Password</label>
          <div className="password-field">
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button className="btn-submit" disabled={loading}>
            {loading
              ? authMode === "login"
                ? "Login..."
                : "Signing up..."
              : authMode === "login"
                ? "LOG IN"
                : "SIGN UP"}
          </button>

          <p className="auth-footer">
            {authMode === "login" ? (
              <>
                Don't have an account?{" "}
                <span
                  className="link"
                  onClick={() => setAuthMode("register")}
                >
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  className="link"
                  onClick={() => setAuthMode("login")}
                >
                  Login
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

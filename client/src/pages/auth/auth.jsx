import "./auth.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  clearError,
} from "../../redux/slices/user-slice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Code2, Eye, EyeOff } from 'lucide-react';
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../services/authApi";

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();

  const [ register, { isLoading: isRegisterLoading, error: registerError }] = useRegisterMutation();

  const [authMode, setAuthMode] = useState("login"); // login | register
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const loading = isLoginLoading || isRegisterLoading;
  const error = loginError || registerError;


  useEffect(() => {
    dispatch(clearError());
  }, [authMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (authMode === "login") {
        await login({
          userName: form.userName,
          password: form.password,
        }).unwrap();
          navigate("/");
      } else {
        await register({
          userName: form.userName.trim(),
          email: form.email.trim(),
          password: form.password,
        }).unwrap();
        setAuthMode("login");
      }
    } catch (err) {
      // error đã được RTK Query quản lý
      console.error("Auth error:", err);
    }
  }

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

        <form className="auth-card" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          {authMode === "login" ? (
            <>
              <label htmlFor="user_name-input">Username</label>
              <input
                id="user_name-input"
                type="text"
                placeholder="coder123"
                value={form.userName}
                onChange={(e) =>
                  setForm({ ...form, userName: e.target.value })
                }
                required
              />
            </>

          ) : (
            <>
              <label htmlFor="user_name-input">Username</label>
              <input
                id="user_name-input"
                type="text"
                placeholder="coder123"
                value={form.userName}
                onChange={(e) =>
                  setForm({ ...form, userName: e.target.value })
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
import "./login.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/slices/user-slice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearError());
  }, []);

  const [form, setForm] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      loginUser({
        username: form.usernameOrEmail,
        password: form.password,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">

        {/* FLOATING HEADER */}
        <div className="login-floating-header">
          <h2>Welcome back</h2>
          <p>Please sign in to your account</p>
        </div>

        {/* MAIN CARD */}
        <form className="login-card" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <input
            type="text"
            placeholder="Username or Email"
            value={form.usernameOrEmail}
            onChange={(e) =>
              setForm({ ...form, usernameOrEmail: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button className="btn-submit" disabled={loading}>
            {loading ? "Signing in..." : "SIGN IN"}
          </button>

          <p className="login-footer">
            Don't have an account?{" "}
            <Link className="link" to="/register">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

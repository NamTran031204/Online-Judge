import "./register.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../redux/slices/user-slice";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearError());
  }, []);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">

        {/* FLOATING HEADER */}
        <div className="register-floating-header">
          <h2>Join us today</h2>
          <p>Enter your email and password to register</p>
        </div>

        {/* FORM CARD */}
        <form className="register-card" onSubmit={handleSubmit}>

          {error && <div className="register-error">{error}</div>}

          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
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

          <button className="register-btn" disabled={loading}>
            {loading ? "Signing up..." : "SIGN UP"}
          </button>

          <p className="register-footer">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

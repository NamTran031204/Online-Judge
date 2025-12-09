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
    user_name: "",
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      registerUser({
        user_name: form.user_name.trim(),
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

        {/* Header */}
        <div className="register-floating-header">
          <h2>Join us today</h2>
          <p>Enter your email and password to register</p>
        </div>

        {/* Card */}
        <form className="register-card" onSubmit={handleSubmit}>
          {error && <div className="register-error">{error}</div>}

          <input
            type="text"
            placeholder="Username"
            value={form.user_name}
            onChange={(e) =>
              setForm({ ...form, user_name: e.target.value })
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

          {/* PASSWORD + SHOW PASSWORD */}
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <div className="show-pass-row">
            <label className="show-password" htmlFor="showPassRegister">Show password?</label>
            <input
              type="checkbox"
              id="showPassRegister"
              checked={showPass}
              onChange={() => setShowPass(!showPass)}
            />
            
          </div>

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

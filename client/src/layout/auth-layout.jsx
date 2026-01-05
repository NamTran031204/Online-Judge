import "./auth-layout.css";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth-page">
      <main className="auth-layout">
        <Outlet />
      </main>
    </div>
  );
}

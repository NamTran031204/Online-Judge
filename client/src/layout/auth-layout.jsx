import "./auth-layout.css";
import Header from "../components/header/header";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      <Header />
      <div className="auth-layout">
        <Outlet />
      </div>
    </>
  );
}
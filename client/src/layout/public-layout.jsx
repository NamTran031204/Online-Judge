import Header from "../components/header/header";
import { Outlet } from "react-router-dom";
import "./public-layout.css";

export default function PublicLayout() {
  return (
    <>
      <Header />

      <div className="public-layout">
        <Outlet />
      </div>
    </>
  );
}

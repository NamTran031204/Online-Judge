import "./main-layout.css";

import Header from "../components/header/header";
import Sidebar from "../components/sidebar/sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="main-layout">

      <Header />

      <div className="main-body">
        <Sidebar />

        <div className="main-content">
          <Outlet />
        </div>
      </div>

    </div>
  );
}

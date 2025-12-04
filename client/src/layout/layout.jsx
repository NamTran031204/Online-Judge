import "./layout.css"

import Header from "../components/header/header";
import Sidebar from "../components//sidebar/sidebar";
// import Footer from "../components/footer/footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout">

      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="layout-content">
        <Outlet />

        {/* Footer */}
      {/* <Footer /> */}
      </div>

      
    </div>
  );
}

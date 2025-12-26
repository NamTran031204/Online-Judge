import "./main-layout.css";

import Header from "../components/header/header";
import { Outlet } from "react-router-dom";
// import { Footer } from "../components/footer/footer";

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content"><Outlet /></main>
      {/* <Footer /> */}
    </div>
  );
}

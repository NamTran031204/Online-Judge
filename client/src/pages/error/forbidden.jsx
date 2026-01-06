// Forbidden.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import "./error-pages.css";

export default function Forbidden() {
  return (
    <div className="error-page-container forbidden">
      <div className="error-content">
        <div className="error-icon-wrapper">
          <ShieldAlert size={48} />
        </div>
        
        <h1 className="error-code">403</h1>
        <h2 className="error-title">Access Denied</h2>
        <p className="error-message">
          Sorry, you don't have permission to access this page.
          Please contact the administrator if you believe this is an error.
        </p>

        <Link to="/home" className="btn-home" style={{ backgroundColor: "#ef4444" }}>
          <ArrowLeft size={18} />
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
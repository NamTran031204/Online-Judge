// NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FileQuestion, Home } from "lucide-react";
import "./error-pages.css";

export default function NotFound() {
  return (
    <div className="error-page-container">
      <div className="error-content">
        <div className="error-icon-wrapper">
          <FileQuestion size={48} />
        </div>
        
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          Oops! The page you are looking for does not exist. 
          It might have been moved or deleted.
        </p>

        <Link to="/home" className="btn-home">
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
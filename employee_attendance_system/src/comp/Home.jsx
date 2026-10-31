import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";

const Home = () => {

  const navigate = useNavigate();

  return (
    <div className="home-container">

      <div className="home-content">

        <p className="home-subtitle">
          EMPLOYEE ATTENDANCE MANAGEMENT SYSTEM
        </p>

        <h1>Welcome to Portal</h1>

        <p className="home-description">
          Choose your portal to continue.
        </p>

        <div className="home-cards">

          {/* ADMIN BOX */}
          <div
            className="home-card admin-home-card"
            onClick={() => navigate("/login")}
          >
            <div className="home-card-icon">
              🛡️
            </div>

            <h2>Admin Portal</h2>

            <p>
              Access the administration dashboard and
              manage employees, attendance and records.
            </p>

            <button type="button">
              Go to Admin →
            </button>
          </div>

          {/* SCANNER BOX */}
          <div
            className="home-card scanner-home-card"
            onClick={() => navigate("/scan")}
          >
            <div className="home-card-icon">
              📷
            </div>

            <h2>Scanner Portal</h2>

            <p>
              Scan employee QR codes to mark attendance
              quickly and easily.
            </p>

            <button type="button">
              Go to Scanner →
            </button>
          </div>

        </div>

        <div className="home-footer">
          Secure Employee Attendance Management System
        </div>

      </div>

    </div>
  );
};

export default Home;
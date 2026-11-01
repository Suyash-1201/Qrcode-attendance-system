


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/signup.css";
import Api from "../Api";

const Adminsignup = () => {

  const navigate = useNavigate();

  const [admin, setAdmin] = useState({
    adminname: "",
    number: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAdmin({
      ...admin,
      [name]: value
    });

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));

    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    let newErrors = {};

    if (!admin.adminname.trim()) {
      newErrors.adminname = "Please enter admin name.";
    }

    if (!/^\d{10}$/.test(admin.number)) {
      newErrors.number = "Please enter a valid 10-digit mobile number.";
    }

    if (admin.password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setSuccess("");

      await Api.post(
        `/admin/save`,
        {
          adminname: admin.adminname.trim(),
          number: admin.number,
          password: admin.password
        }
      );

      setSuccess("Admin registered successfully!");

      setTimeout(() => {
        navigate("/admin");
      }, 1500);

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Admin registration failed.";

      const errorMessage =
        typeof message === "string" ? message : "Admin registration failed.";

      if (
        errorMessage.toLowerCase().includes("number") ||
        error.response?.status === 409
      ) {
        setErrors({
          number: "This mobile number is already registered."
        });
      } else {
        setErrors({
          general: errorMessage
        });
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">

      <div className="signup-background-circle circle-one"></div>
      <div className="signup-background-circle circle-two"></div>

      <div className="signup-card">

        <div className="signup-icon">
          👤
        </div>

        <p className="signup-top-text">
          ADMIN MANAGEMENT SYSTEM
        </p>

        <h1>Create Admin Account</h1>

        <p className="signup-description">
          Register a new administrator to manage your system.
        </p>

        <form onSubmit={handleSubmit}>

          {/* General Error */}
          {errors.general && (
            <p className="signup-error-message">
              {errors.general}
            </p>
          )}

          {/* Admin Name */}
          <div className="signup-input-group">

            <label>Admin Name</label>

            <div className="signup-input-box">
              <span>👤</span>

              <input
                type="text"
                name="adminname"
                placeholder="Enter admin name"
                value={admin.adminname}
                onChange={handleChange}
                required
              />
            </div>

            {errors.adminname && (
              <p className="signup-field-error">
                {errors.adminname}
              </p>
            )}

          </div>

          {/* Mobile Number */}
          <div className="signup-input-group">

            <label>Mobile Number</label>

            <div className="signup-input-box">
              <span>📱</span>

              <input
                type="tel"
                name="number"
                placeholder="Enter 10 digit mobile number"
                value={admin.number}
                onChange={handleChange}
                maxLength="10"
                required
              />
            </div>

            {errors.number && (
              <p className="signup-field-error">
                {errors.number}
              </p>
            )}

          </div>

          {/* Password */}
          <div className="signup-input-group">

            <label>Password</label>

            <div className="signup-input-box">
              <span>🔒</span>

              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={admin.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            {errors.password && (
              <p className="signup-field-error">
                {errors.password}
              </p>
            )}

          </div>

          {/* Admin Role */}
          <div className="signup-input-group">

            <label>Admin Role</label>

            <div className="signup-input-box">
              <span>🛡️</span>

              <select value="admin" disabled>
                <option value="admin">ADMIN</option>
              </select>
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="signup-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Admin Account →"}
          </button>

          {/* Success Message below button */}
          {success && (
            <p className="signup-success-message">
              ✓ {success}
            </p>
          )}

          {/* Back Button */}
          <button
            type="button"
            className="signup-back-btn"
            onClick={() => navigate("/admin")}
            disabled={loading}
          >
            ← Back to Dashboard
          </button>

        </form>

        <div className="signup-bottom">
          Secure Admin Registration
        </div>

      </div>
    </div>
  );
};

export default Adminsignup;


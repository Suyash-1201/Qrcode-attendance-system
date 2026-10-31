
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

const Adminlogin = () => {

  const navigate = useNavigate();

  const [login, setLogin] = useState({
    number: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLogin((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
    setSuccess("");

    setValidationErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    let errors = {};

    if (!/^\d{10}$/.test(login.number)) {
      errors.number = "Enter a valid 10-digit mobile number.";
    }

    if (!login.password.trim()) {
      errors.password = "Please enter your password.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setValidationErrors({});

      const response = await axios.post(
        "http://localhost:8080/admin/login",
        {
          number: Number(login.number),
          password: login.password
        }
      );
      localStorage.setItem("number",login.number);
      setSuccess(response.data || "Login successful!");
      
      setLogin({
        number: "",
        password: ""
      });

      // Navigate after showing success message
      setTimeout(() => {
        navigate("/admin");
      }, 1200);

    } catch (err) {

      console.error("Login error:", err);

      if (err.response?.status === 401) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Unauthorized Person. Invalid mobile number or password."
        );
      } else {
        setError(
          typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message ||
              "Unable to login. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">

      {/* Animated Background */}
      <div className="login-circle login-circle-one"></div>
      <div className="login-circle login-circle-two"></div>
      <div className="login-circle login-circle-three"></div>

      {/* Login Card */}
      <div className="admin-login-card">

        <div className="login-icon">
          🛡️
        </div>

        <p className="login-top-text">
          ADMIN MANAGEMENT SYSTEM
        </p>

        <h1>Welcome Back!</h1>

        <p className="login-description">
          Login to access your administration dashboard.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Mobile Number */}
          <div className="login-input-group">

            <label>Mobile Number</label>

            <div className="login-input-box">
              <span>📱</span>

              <input
                type="tel"
                name="number"
                placeholder="Enter your mobile number"
                value={login.number}
                onChange={handleChange}
                maxLength="10"
                required
              />
            </div>

            {validationErrors.number && (
              <p className="login-field-error">
                {validationErrors.number}
              </p>
            )}

          </div>

          {/* Password */}
          <div className="login-input-group">

            <label>Password</label>

            <div className="login-input-box">
              <span>🔒</span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={login.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

            {validationErrors.password && (
              <p className="login-field-error">
                {validationErrors.password}
              </p>
            )}

          </div>

          {/* Error Message */}
          {error && (
            <div className="login-error-message">
              <span>✕</span>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner"></span>
                Logging in...
              </>
            ) : (
              "Login to Dashboard →"
            )}
          </button>

          {/* Success Message */}
          {success && (
            <div className="login-success-message">
              ✓ {success}
            </div>
          )}

        </form>

        <div className="login-bottom">
          <span>🔐</span>
          Secure Administrator Login
        </div>

      </div>
    </div>
  );
};

export default Adminlogin;

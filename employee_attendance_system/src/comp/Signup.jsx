import { useState } from "react";
import Api from "../Api"; // Ensure this path matches your folder structure exactly
import '../css/empsignup.css';
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setname] = useState("");
  const [number, setnumber] = useState("");
  const [email, setemail] = useState("");

  const [signupMessage, setSignupMessage] = useState("");
  const [signupError, setSignupError] = useState("");
  const [loadingSignup, setLoadingSignup] = useState(false);

  // Register the employee.
  async function handleSignup(event) {
    event.preventDefault();

    setSignupMessage("");
    setSignupError("");
    setLoadingSignup(true);

    try {
      const response = await Api.post(
        `/api/employee/signup`,
        {
          name: name,
          number: Number(number),
          email: email
        }
      );

      // If your Axios response interceptor unpacks response.data, use response directly. 
      // If not, use response.data. Adjust according to your Api.js setup.
      const data = response.data || response;

      setSignupMessage(data.message || "Employee registered successfully!");

      if (data.emailSent === false) {
        setSignupError(
          "Registration succeeded, but the QR email was not sent. Please check the sender's email configuration."
        );
      }

      setname("");
      setnumber("");
      setemail("");

    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          setSignupError(errorData.message);
        } else {
          setSignupError(Object.values(errorData).join(", "));
        }
      } else {
        setSignupError(
          "Could not connect to Spring Boot. Check whether the backend is running."
        );
      }
    } finally {
      setLoadingSignup(false);
    }
  }

  return (
    <div className="app-container">
      <header className="page-header">
        <h1>Employee Signup</h1>
        <p>Register employees.</p>
      </header>

      <main className="main-content">
        <section className="panel">
         
          <p>The employee will receive their QR code by email.</p>

          <form onSubmit={handleSignup}>
            <label htmlFor="name">Employee Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setname(event.target.value)}
              placeholder="Enter employee name"
              required
            />

            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              id="mobileNumber"
              type="tel"
              value={number}
              onChange={(event) => setnumber(event.target.value)}
              placeholder="Enter 10-digit mobile number"
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />

            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setemail(event.target.value)}
              placeholder="employee@example.com"
              required
            />

            <button type="submit" disabled={loadingSignup}>
              {loadingSignup ? "Registering..." : "Register Employee"}
            </button>
          </form>

          {signupMessage && (
            <p className="success-message">{signupMessage}</p>
          )}

          {signupError && (
            <p className="error-message">{signupError}</p>
          )}
        </section>
      </main>
    </div>
  );
}
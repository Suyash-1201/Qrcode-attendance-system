
import React, { useState, useEffect } from "react";
import "../css/getqr.css";
import Api from "../Api";

function Getcode() {
  const [empNumber, setEmpNumber] = useState("");
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Clean up previous image URL
  useEffect(() => {
    return () => {
      if (qrImageUrl) {
        URL.revokeObjectURL(qrImageUrl);
      }
    };
  }, [qrImageUrl]);

  async function handleFetchQr(e) {
    e.preventDefault();

    if (!empNumber.trim()) {
      setErrorMessage("Please enter employee number.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setQrImageUrl("");

    try {
      const response = await Api.get(
        `/api/getcode/${encodeURIComponent(empNumber.trim())}`,
        {
          responseType: "blob",
        }
      );

      console.log("API Response:", response);
      console.log("Response status:", response.status);
      console.log("Content Type:", response.headers["content-type"]);

      const blob = response.data;

      if (!blob || blob.size === 0) {
        throw new Error("QR image is empty.");
      }

      // Check response content type
      if (!blob.type.startsWith("image/")) {
        const responseText = await blob.text();

        console.log("Backend returned:", responseText);

        throw new Error(
          responseText || "Backend did not return an image."
        );
      }

      // Create image URL
      const imageUrl = URL.createObjectURL(blob);

      // Verify image before displaying
      const image = new Image();

      image.onload = () => {
        setQrImageUrl(imageUrl);
      };

      image.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        setErrorMessage("Invalid QR image received from backend.");
      };

      image.src = imageUrl;

    } catch (error) {
      console.error("QR Code Error:", error);

      if (error.response?.status === 404) {
        setErrorMessage("Employee not found.");
      } else {
        setErrorMessage(
          error.message || "Unable to retrieve QR code."
        );
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qr-container">
      <div className="qr-content-wrapper">

        <div className="qr-header">
          <div className="qr-icon">🖨️</div>

          <p className="qr-subtitle">
            EMPLOYEE MANAGEMENT
          </p>

          <h1>Fetch Employee QR Code</h1>

          <p className="qr-description">
            Enter the employee number below to instantly
            generate and view their assigned QR code.
          </p>
        </div>

        <div className="qr-card">

          <form onSubmit={handleFetchQr} className="qr-form">

            <div className="input-group">
              <label htmlFor="empNumber">
                Employee Number / ID
              </label>

              <input
                id="empNumber"
                type="text"
                placeholder="e.g. 101"
                value={empNumber}
                onChange={(e) => setEmpNumber(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="fetch-button"
              disabled={loading}
            >
              {loading ? "Generating..." : "Get QR Code"}
            </button>

          </form>

          {errorMessage && (
            <div className="error-alert">
              <span>!</span>
              {errorMessage}
            </div>
          )}

          {qrImageUrl && (
            <div className="qr-result-box">

              <h3>Employee QR Code</h3>

              <div className="image-wrapper">
                <img
                  src={qrImageUrl}
                  alt="Employee QR Code"
                  style={{
                    width: "250px",
                    height: "250px",
                    objectFit: "contain",
                    display: "block",
                    margin: "auto"
                  }}
                />
              </div>

              <a
                href={qrImageUrl}
                download={`Employee_${empNumber}_QR.png`}
                className="download-button"
              >
                Download QR Code
              </a>

            </div>
          )}

        </div>

        <div className="qr-footer">
          <span>🔒</span>
          Secure Attendance QR Retrieval System
        </div>

      </div>
    </div>
  );
}

export default Getcode;

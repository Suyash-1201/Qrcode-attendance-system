
import React, { useState, useEffect } from "react";
import "../css/getqr.css";
import Api from "../Api";

function Getcode() {
  const [empNumber, setEmpNumber] = useState("");
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Clean up old image URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (qrImageUrl) {
        URL.revokeObjectURL(qrImageUrl);
      }
    };
  }, [qrImageUrl]);

  // Fetch employee QR code
  async function handleFetchQr(e) {
    e.preventDefault();

    if (!empNumber.trim()) {
      setErrorMessage("Please enter a valid employee number.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setQrImageUrl("");

    try {
      // API returns Blob directly
      const imageBlob = await Api.get(
        `/api/getcode/${encodeURIComponent(empNumber.trim())}`,
        {
          responseType: "blob",
        }
      );

      console.log("QR Image:", imageBlob);
      console.log("Image Size:", imageBlob.size);
      console.log("Image Type:", imageBlob.type);

      // Check empty response
      if (!imageBlob || imageBlob.size === 0) {
        throw new Error("QR code image is empty.");
      }

      // Check image format
      if (
        imageBlob.type &&
        !imageBlob.type.startsWith("image/")
      ) {
        const errorText = await imageBlob.text();

        throw new Error(
          errorText || "Backend did not return a valid image."
        );
      }

      // Create image URL
      const imageUrl = URL.createObjectURL(imageBlob);

      // Verify that image can load
      const image = new Image();

      image.onload = () => {
        setQrImageUrl(imageUrl);
      };

      image.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        setErrorMessage(
          "QR code received, but the image could not be displayed. Check the backend image data."
        );
      };

      image.src = imageUrl;

    } catch (error) {
      console.error("QR Code Error:", error);

      setErrorMessage(
        error.response?.status === 404
          ? "Employee not found with this number."
          : error.message || "Could not retrieve QR code. Please try again."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qr-container">
      <div className="qr-content-wrapper">

        {/* Header */}
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

        {/* Input Card */}
        <div className="qr-card">

          <form
            onSubmit={handleFetchQr}
            className="qr-form"
          >

            <div className="input-group">
              <label htmlFor="empNumber">
                Employee Number / ID
              </label>

              <input
                id="empNumber"
                type="text"
                placeholder="e.g. 101"
                value={empNumber}
                onChange={(e) =>
                  setEmpNumber(e.target.value)
                }
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

          {/* Error Message */}
          {errorMessage && (
            <div className="error-alert">
              <span>!</span>
              {errorMessage}
            </div>
          )}

          {/* QR Code Image */}
          {qrImageUrl && (
            <div className="qr-result-box">

              <h3>Employee QR Code</h3>

              <div className="image-wrapper">
                <img
                  src={qrImageUrl}
                  alt="Employee QR Code"
                  style={{
                    display: "block",
                    width: "250px",
                    height: "250px",
                    objectFit: "contain",
                    margin: "0 auto",
                    background: "#ffffff",
                    padding: "10px",
                    borderRadius: "8px"
                  }}
                />
              </div>

              {/* Download QR */}
              <a
                href={qrImageUrl}
                download={`Employee_${empNumber}_QR.png`}
                className="download-button"
              >
                ⬇ Download QR Code
              </a>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="qr-footer">
          <span>🔒</span>
          Secure Attendance QR Retrieval System
        </div>

      </div>
    </div>
  );
}

export default Getcode;

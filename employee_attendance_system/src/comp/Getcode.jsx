import React, { useState } from "react";
import "../css/getqr.css";
import Api from "../Api";

function Getcode() {
  const [empNumber, setEmpNumber] = useState("");
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      // Fetch binary byte[] data as a blob
      const response = await Api.get(`/api/getcode/${empNumber}`, {
        responseType: "blob",
      });

      // Convert blob byte array into a local object URL for the <img> tag
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setQrImageUrl(imageUrl);

    } catch (error) {
      console.error("Error fetching QR code:", error);
      if (error.response && error.response.status === 404) {
        setErrorMessage("Employee not found with this number.");
      } else {
        setErrorMessage("Could not retrieve QR code. Please try again.");
      }
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
          <p className="qr-subtitle">EMPLOYEE MANAGEMENT</p>
          <h1>Fetch Employee QR Code</h1>
          <p className="qr-description">
            Enter the employee number below to instantly generate and view their assigned QR code.
          </p>
        </div>

        {/* Input Card */}
        <div className="qr-card">
          <form onSubmit={handleFetchQr} className="qr-form">
            <div className="input-group">
              <label htmlFor="empNumber">Employee Number / ID</label>
              <input
                id="empNumber"
                type="number"
                placeholder="e.g. 101"
                value={empNumber}
                onChange={(e) => setEmpNumber(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="fetch-button" disabled={loading}>
              {loading ? "Generating..." : "Get QR Code"}
            </button>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="error-alert">
              <span>!</span> {errorMessage}
            </div>
          )}

          {/* Display QR Image */}
          {qrImageUrl && (
            <div className="qr-result-box">
              <h3>Employee QR Code</h3>
              <div className="image-wrapper">
                <img src={qrImageUrl} alt="Employee QR Code" />
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

        {/* Footer */}
        <div className="qr-footer">
          <span>🔒</span> Secure Attendance QR Retrieval System
        </div>

      </div>
    </div>
  );
}

export default Getcode;
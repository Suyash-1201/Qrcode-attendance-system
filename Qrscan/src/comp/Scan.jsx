
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../css/scan.css";
import Api from "../Api";

function Scan() {
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [attendanceError, setAttendanceError] = useState("");
  const [cameraMessage, setCameraMessage] = useState("");

  const scannerRef = useRef(null);
  const processingRef = useRef(false);
  const startingRef = useRef(false);

  // Stop camera and cleanup when component unmounts
  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      if (scanner) {
        scanner.stop()
          .then(() => scanner.clear())
          .catch(() => {});
      }
    };
  }, []);

  // Stop scanner
  async function stopScanner() {
    const scanner = scannerRef.current;

    if (scanner) {
      try {
        await scanner.stop();
      } catch (error) {
        console.log("Scanner already stopped.");
      }

      try {
        await scanner.clear();
      } catch (error) {
        console.log("Scanner cleanup completed.");
      }

      scannerRef.current = null;
    }
  }

  // Verify QR and mark attendance
  async function verifyAndMarkAttendance(qrToken) {
    // 1. Guard check: Prevent multiple triggers immediately
    if (processingRef.current) return;
    processingRef.current = true; // Lock immediately before async GPS call

    setAttendanceMessage("");
    setAttendanceError("");
    setCameraMessage("QR code detected. Getting location...");

    if (!navigator.geolocation) {
      setAttendanceError("Geolocation is not supported by your browser");
      setCameraMessage("");
      processingRef.current = false; // Reset lock if unsupported
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat1 = position.coords.latitude;
          const lon1 = position.coords.longitude;
          
          setCameraMessage("Processing attendance...");
          await stopScanner();

          const response = await Api.post("/api/attendance/scan", {
            qrtiken: qrToken,
            lat1: lat1,
            lon1: lon1
          });

          let displayMessage = "Attendance recorded successfully.";

          if (typeof response.data === "string") {
            displayMessage = response.data;
          } else if (response.data) {
            const namePart = response.data.name
              ? `${response.data.name} — `
              : "";

            const msgPart =
              response.data.message ||
              response.data.status ||
              "Success";

            displayMessage = `${namePart}${msgPart}`;
          }

          setAttendanceMessage(displayMessage);
          setCameraMessage("Attendance scan completed successfully.");

        } catch (error) {
          console.error("Attendance API Scan Error:", error);

          if (error.response && error.response.data) {
            const errData = error.response.data;
            setAttendanceError(
              typeof errData === "string"
                ? errData
                : errData.message || "Unable to mark attendance."
            );
          } else if (error.request) {
            setAttendanceError(
              "Could not connect to the backend server. Check if backend is active."
            );
          } else {
            setAttendanceError(
              "An error occurred while processing attendance."
            );
          }
        } finally {
          processingRef.current = false;
        }
      },
      (error) => {
        console.error("GPS Error:", error);
        setAttendanceError("GPS Error: Please enable location permissions in your browser.");
        setCameraMessage("");
        processingRef.current = false; // Release lock on error so they can retry
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  // Start scanner with mobile back camera
  async function startScanner() {
    if (scannerRef.current !== null || startingRef.current) return;

    startingRef.current = true;

    setAttendanceMessage("");
    setAttendanceError("");
    setCameraMessage("Starting camera...");

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250
          },
          aspectRatio: 1
        },
        async (decodedText) => {
          await verifyAndMarkAttendance(decodedText);
        },
        () => {}
      );

      setCameraMessage(
        "Back camera started. Point it at the employee QR code."
      );

    } catch (error) {
      console.error("Camera error:", error);

      const scanner = scannerRef.current;
      scannerRef.current = null;

      if (scanner) {
        try {
          await scanner.clear();
        } catch (cleanupError) {
          console.log("Scanner cleanup completed.");
        }
      }

      setCameraMessage(
        "Could not start camera. Please allow camera permission and try again."
      );

    } finally {
      startingRef.current = false;
    }
  }

  return (
    <div className="scan-container">
      <div className="scan-content">

        {/* Header */}
        <div className="scan-header">
          <div className="scan-icon">📷</div>

          <p className="scan-subtitle">
            EMPLOYEE ATTENDANCE SYSTEM
          </p>

          <h1>QR Attendance Scanner</h1>

          <p className="scan-description">
            Scan your employee QR code to mark your attendance
            quickly and securely.
          </p>
        </div>

        {/* Scanner Card */}
        <div className="scanner-card">

          <div className="scanner-card-header">
            <h2>Scan Employee QR Code</h2>

            <span className="live-indicator">
              <span></span>
              LIVE SCANNER
            </span>
          </div>

          <p className="scanner-instruction">
            Position the QR code inside the scanning area.
          </p>

          {/* Camera */}
          <div className="scanner-box">
            <div id="reader"></div>
          </div>

          {/* Buttons */}
          <div className="scan-buttons">

            <button
              type="button"
              className="start-button"
              onClick={startScanner}
              disabled={
                startingRef.current ||
                scannerRef.current !== null ||
                processingRef.current
              }
            >
              <span>▶</span> Start Scanner
            </button>

            <button
              type="button"
              className="stop-button"
              onClick={async () => {
                await stopScanner();
                setCameraMessage("Scanner stopped.");
              }}
            >
              <span>■</span> Stop Scanner
            </button>

          </div>

          {/* Camera Message */}
          {cameraMessage && (
            <div className="camera-message">
              {cameraMessage}
            </div>
          )}

          {/* Attendance Success */}
          {attendanceMessage && (
            <div className="success-message">
              <span>✓</span>

              <div>
                <strong>Attendance Marked!</strong>
                <p>{attendanceMessage}</p>
              </div>
            </div>
          )}

          {/* Attendance Error */}
          {attendanceError && (
            <div className="error-message">
              <span>!</span>

              <div>
                <strong>Attendance Failed</strong>
                <p>{attendanceError}</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="scan-footer">
          <span>🔒</span>
          Secure Employee Attendance Management System
        </div>

      </div>
    </div>
  );
}

export default Scan;
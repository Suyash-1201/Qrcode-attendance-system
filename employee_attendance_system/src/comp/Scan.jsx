
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import "../css/scan.css";

const API_URL = "http://localhost:8080/api";

function Scan() {

  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [attendanceError, setAttendanceError] = useState("");
  const [cameraMessage, setCameraMessage] = useState("");

  const scannerRef = useRef(null);
  const processingRef = useRef(false);

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;

      if (scanner !== null) {
        scanner.stop().catch(() => {});
      }
    };
  }, []);

  async function stopScanner() {

    const scanner = scannerRef.current;

    if (scanner !== null) {

      try {
        await scanner.stop();
      } catch (error) {
        console.log("Scanner was already stopped.");
      }

      try {
        await scanner.clear();
      } catch (error) {
        console.log("Scanner cleanup completed.");
      }

      scannerRef.current = null;
    }
  }

  async function verifyAndMarkAttendance(qrToken) {

    if (processingRef.current) return;

    processingRef.current = true;

    setAttendanceMessage("");
    setAttendanceError("");

    await stopScanner();

    try {

      const response = await axios.post(
        `${API_URL}/attendance/scan`,
        {
          qrtiken: qrToken
        }
      );

      setAttendanceMessage(
        response.data.name + " — " + response.data.message
      );

    } catch (error) {

      if (error.response && error.response.data) {

        setAttendanceError(
          error.response.data.message ||
          "Unable to mark attendance."
        );

      } else {

        setAttendanceError(
          "Could not connect to the backend."
        );

      }

    } finally {
      processingRef.current = false;
    }
  }

  async function startScanner() {

    if (scannerRef.current !== null) return;

    setAttendanceMessage("");
    setAttendanceError("");
    setCameraMessage("");

    try {

      const cameras = await Html5Qrcode.getCameras();

      if (cameras.length === 0) {
        setCameraMessage(
          "No camera found. Please connect a camera."
        );
        return;
      }

      const scanner = new Html5Qrcode("reader");

      scannerRef.current = scanner;

      await scanner.start(
        cameras[0].id,
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250
          }
        },
        async (decodedText) => {
          await verifyAndMarkAttendance(decodedText);
        },
        () => {}
      );

      setCameraMessage(
        "Camera started. Point it at the employee QR code."
      );

    } catch (error) {

      console.error("Camera error:", error);

      scannerRef.current = null;

      setCameraMessage(
        "Could not start camera. Please allow camera permission."
      );
    }
  }

  return (

    <div className="scan-container">

      <div className="scan-content">

        <div className="scan-header">

          <div className="scan-icon">
            📷
          </div>

          <p className="scan-subtitle">
            EMPLOYEE ATTENDANCE SYSTEM
          </p>

          <h1>QR Attendance Scanner</h1>

          <p className="scan-description">
            Scan your employee QR code to mark your attendance quickly and securely.
          </p>

        </div>

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

          <div className="scanner-box">
            <div id="reader"></div>
          </div>

          <div className="scan-buttons">

            <button
              type="button"
              className="start-button"
              onClick={startScanner}
              disabled={!!cameraMessage && !!scannerRef.current}
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

          {cameraMessage && (
            <div className="camera-message">
              {cameraMessage}
            </div>
          )}

          {attendanceMessage && (
            <div className="success-message">
              <span>✓</span>
              <div>
                <strong>Attendance Marked!</strong>
                <p>{attendanceMessage}</p>
              </div>
            </div>
          )}

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

        <div className="scan-footer">
          <span>🔒</span>
          Secure Employee Attendance Management System
        </div>

      </div>

    </div>

  );
}

export default Scan;
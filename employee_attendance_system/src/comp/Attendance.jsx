import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import '../css/attendance.css'
import { useNavigate } from "react-router-dom";
import Api from "../Api";


const Attendance = () => {

    const [attendanceList, setAttendanceList] = useState([]);
      const [loadingAttendance, setLoadingAttendance] = useState(false);
      const [attendanceMessage, setAttendanceMessage] = useState("");
  const [attendanceError, setAttendanceError] = useState("");
  const nav=useNavigate();

  useEffect(()=>{
    loadTodayAttendance()
  },[])

     // Load attendance records from the backend.
  async function loadTodayAttendance() {

    setLoadingAttendance(true);

    try {

      const response = await Api.get(
        `/api/attendance/today`
      );

      setAttendanceList(response.data);

    } catch (error) {

      console.error(
        "Unable to load today's attendance",
        error
      );

    } finally {

      setLoadingAttendance(false);

    }
  }
  return (
    <div>
      {/* Today's attendance list */}
        <section className="panel attendance-panel">

          <div className="section-heading">

            <h2>Today's Attendance</h2>

            <button
              type="button"
              className="secondary-button"
              onClick={loadTodayAttendance}
            >
              Refresh
            </button>

          </div>

          {loadingAttendance && (
            <p>Loading attendance...</p>
          )}

          {!loadingAttendance &&
            attendanceList.length === 0 && (
              <p>No attendance records for today.</p>
            )}

          {attendanceList.length > 0 && (

            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Check-in Time</th>
                  </tr>
                </thead>

                <tbody>

                  {attendanceList.map((attendance) => (

                    <tr key={attendance.id}>

                      <td>{attendance.id}</td>

                      <td>{attendance.emp.empname}</td>

                      <td>{attendance.emp.email}</td>

                      <td>{attendance.attendancedate}</td>

                      <td>
                        {new Date(
                          attendance.checkInTime
                        ).toLocaleTimeString()}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

          <div>
            <button onClick={()=>nav("/emp")}>
                Show Employee
            </button>
          </div>

        </section>
    </div>
  )
}

export default Attendance

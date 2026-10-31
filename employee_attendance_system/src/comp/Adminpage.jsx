

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/adminpage.css";

const ADMIN_API = "http://localhost:8080/admin";
const EMPLOYEE_API = "http://localhost:8080/api";

const Adminpage = () => {

  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [adminLoading, setAdminLoading] = useState(true);
  const [employeeLoading, setEmployeeLoading] = useState(true);

  const [adminError, setAdminError] = useState("");
  const [employeeError, setEmployeeError] = useState("");

  const [adminMessage, setAdminMessage] = useState("");
  const [employeeMessage, setEmployeeMessage] = useState("");

  const [deletingAdminId, setDeletingAdminId] = useState(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState(null);

  // Fetch all admins
  const fetchAdmins = async () => {

    try {
      setAdminLoading(true);
      setAdminError("");

      const response = await axios.get(
        `${ADMIN_API}/alladmin`
      );

      setAdmins(response.data);

    } catch (err) {

      console.error("Admin fetch error:", err);
      setAdminError("Unable to load administrators.");

    } finally {
      setAdminLoading(false);
    }
  };

  // Fetch all employees
  const fetchEmployees = async () => {

    try {
      setEmployeeLoading(true);
      setEmployeeError("");

      const response = await axios.get(
        `${EMPLOYEE_API}/getemployees`
      );

      setEmployees(response.data);

    } catch (err) {

      console.error("Employee fetch error:", err);
      setEmployeeError("Unable to load employees.");

    } finally {
      setEmployeeLoading(false);
    }
  };

  // Load both lists
  useEffect(() => {
    fetchAdmins();
    fetchEmployees();
  }, []);

  // Delete admin
  const deleteAdmin = async (id) => {

    if (deletingAdminId !== null) return;

    try {

      setDeletingAdminId(id);
      setAdminError("");
      setAdminMessage("");

      await axios.delete(
        `${ADMIN_API}/delete/${id}`
      );

      setAdmins((prev) =>
        prev.filter((admin) => admin.id !== id)
      );

      setAdminMessage(
        "Administrator deleted successfully."
      );

    } catch (err) {

      console.error("Admin delete error:", err);

      setAdminError(
        err.response?.data?.message ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to delete administrator.")
      );

    } finally {
      setDeletingAdminId(null);
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {

    if (deletingEmployeeId !== null) return;

    try {

      setDeletingEmployeeId(id);
      setEmployeeError("");
      setEmployeeMessage("");

      await axios.delete(
        `${EMPLOYEE_API}/delete/${id}`
      );

      setEmployees((prev) =>
        prev.filter((employee) => employee.id !== id)
      );

      setEmployeeMessage(
        "Employee deleted successfully."
      );

    } catch (err) {

      console.error("Employee delete error:", err);

      setEmployeeError(
        err.response?.data?.message ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to delete employee.")
      );

    } finally {
      setDeletingEmployeeId(null);
    }
  };

  return (

    <div className="admin-dashboard">

      {/* NAVBAR */}
      <nav className="admin-navbar">

        <div className="admin-logo">

          <span className="logo-icon">A</span>

          <h2>
            Admin<span>Panel</span>
          </h2>

        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          Management Portal
        </div>

      </nav>

      <main className="admin-container">

        {/* WELCOME SECTION */}
        <section className="admin-welcome">

          <div>

            <p className="admin-subtitle">
              CONTROL CENTER / MANAGEMENT
            </p>

            <h1>Management Dashboard</h1>

            <p className="welcome-description">
              Manage administrators and employees from one place.
            </p>

          </div>

          <div className="welcome-actions">

            {/* ATTENDANCE BUTTON */}
            <button
              className="attendance-btn"
              onClick={() => navigate("/attendance")}
            >
              📋 Attendance
            </button>

            {/* ADD ADMIN BUTTON */}
            <button
              className="add-admin-btn"
              onClick={() => navigate("/admin-signup")}
            >
              + Add New Admin
            </button>

          </div>

        </section>

        {/* STATISTICS */}
        <section className="admin-stats">

          <div className="stat-card">

            <div className="stat-icon purple">
              ♙
            </div>

            <div>
              <p>Total Administrators</p>
              <h2>{admins.length}</h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <p>Total Employees</p>
              <h2>{employees.length}</h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon blue">
              ♧
            </div>

            <div>
              <p>Total Accounts</p>
              <h2>{admins.length + employees.length}</h2>
            </div>

          </div>

        </section>

        {/* ADMIN SECTION */}
        <section className="admin-table-section">

          <div className="table-heading">

            <div>
              <h2>All Administrators</h2>
              <p>View and manage registered admin accounts.</p>
            </div>

            <button
              className="refresh-btn"
              onClick={fetchAdmins}
              disabled={adminLoading}
            >
              ↻ Refresh
            </button>

          </div>

          {adminMessage && (
            <div className="admin-success-message">
              ✓ {adminMessage}
            </div>
          )}

          {adminError && (
            <div className="admin-error-message">
              ✕ {adminError}
            </div>
          )}

          {adminLoading ? (

            <div className="admin-loading">

              <div className="loader"></div>

              <p>Loading administrators...</p>

            </div>

          ) : admins.length === 0 ? (

            <div className="admin-empty">

              <div className="empty-icon">♙</div>

              <h3>No Administrators Found</h3>

              <p>No administrator accounts are registered.</p>

              <button
                onClick={() => navigate("/admin-signup")}
              >
                + Create Admin
              </button>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ADMIN NAME</th>
                    <th>PHONE NUMBER</th>
                    <th>ROLE</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>

                  {admins.map((admin) => (

                    <tr key={admin.id}>

                      <td>
                        <span className="admin-id">
                          #{admin.id}
                        </span>
                      </td>

                      <td>
                        <div className="admin-user">

                          <div className="user-avatar">
                            {admin.adminname?.charAt(0).toUpperCase()}
                          </div>

                          <span>{admin.adminname}</span>

                        </div>
                      </td>

                      <td>{admin.number}</td>

                      <td>
                        <span className="role-badge">
                          {admin.role}
                        </span>
                      </td>

                      <td>
                        <span className="active-badge">
                          <span></span>
                          Registered
                        </span>
                      </td>

                      <td>

                        <button
                          className="delete-btn"
                          disabled={deletingAdminId !== null}
                          onClick={() => deleteAdmin(admin.id)}
                        >
                          {deletingAdminId === admin.id
                            ? "Deleting..."
                            : "♲ Delete"}
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

          <div className="table-footer">
            Showing {admins.length} administrator(s)
          </div>

        </section>

        {/* EMPLOYEE SECTION */}
        <section className="admin-table-section employee-section">

          <div className="table-heading">

            <div>
              <h2>All Employees</h2>
              <p>View and manage registered employee accounts.</p>
            </div>

            <div className="employee-actions">

              <button
                className="add-employee-btn"
                onClick={() => navigate("/signup")}
              >
                + Add New Employee
              </button>

              <button
                className="refresh-btn"
                onClick={fetchEmployees}
                disabled={employeeLoading}
              >
                ↻ Refresh
              </button>

            </div>

          </div>

          {employeeMessage && (
            <div className="admin-success-message">
              ✓ {employeeMessage}
            </div>
          )}

          {employeeError && (
            <div className="admin-error-message">
              ✕ {employeeError}
            </div>
          )}

          {employeeLoading ? (

            <div className="admin-loading">

              <div className="loader"></div>

              <p>Loading employees...</p>

            </div>

          ) : employees.length === 0 ? (

            <div className="admin-empty">

              <div className="empty-icon">♙</div>

              <h3>No Employees Found</h3>

              <p>No employee accounts are registered.</p>

              <button
                onClick={() => navigate("/signup")}
              >
                + Create Employee
              </button>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>EMPLOYEE NAME</th>
                    <th>PHONE NUMBER</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>

                  {employees.map((employee) => (

                    <tr key={employee.id}>

                      <td>
                        <span className="admin-id">
                          #{employee.id}
                        </span>
                      </td>

                      <td>
                        <div className="admin-user">

                          <div className="user-avatar employee-avatar">
                            {employee.empname?.charAt(0).toUpperCase()}
                          </div>

                          <span>{employee.empname}</span>

                        </div>
                      </td>

                      <td>{employee.number}</td>

                      <td>
                        <span className="active-badge">
                          <span></span>
                          Registered
                        </span>
                      </td>

                      <td>

                        <button
                          className="delete-btn"
                          disabled={deletingEmployeeId !== null}
                          onClick={() => deleteEmployee(employee.id)}
                        >
                          {deletingEmployeeId === employee.id
                            ? "Deleting..."
                            : "♲ Delete"}
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

          <div className="table-footer">
            Showing {employees.length} employee(s)
          </div>

        </section>

      </main>

    </div>
  );
};

export default Adminpage;
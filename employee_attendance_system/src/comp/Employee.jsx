
import React, { useEffect, useState } from 'react';
import '../css/employee.css';
import axios from 'axios';
import Api from '../Api';

const Employee = () => {

    const [user, setuser] = useState([]);
    const [loading, setloading] = useState(false);

    // Get all employees
    async function getdata() {

        setloading(true);

        try {

            const res = await axios.get(
                `${Api}/api/getemployees`
            );

            setuser(res.data);

        } catch (error) {

            console.log(error);

        } finally {

            setloading(false);

        }
    }

    // Delete employee
    async function deleteuser(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await axios.delete(
                `${Api}/api/delete/${id}`
            );

            // Reload employee list
            getdata();

        } catch (error) {

            console.log(error);

            alert("Unable to delete employee.");

        }
    }

    useEffect(() => {

        getdata();

    }, []);

    return (

        <div className="employee-container">

            <div className="employee-header">

                <div>
                    <h1>Employee Management</h1>
                    <p>View and manage all registered employees.</p>
                </div>

                <button
                    className="refresh-btn"
                    onClick={getdata}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Refresh"}
                </button>

            </div>

            <div className="employee-table-container">

                {loading ? (

                    <p className="loading-text">
                        Loading employees...
                    </p>

                ) : (

                    <table className="employee-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Employee Name</th>
                                <th>Mobile Number</th>
                                <th>Email Address</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {user.length > 0 ? (

                                user.map((emp) => (

                                    <tr key={emp.id}>

                                        <td>{emp.id}</td>

                                        <td>{emp.empname}</td>

                                        <td>{emp.number}</td>

                                        <td>{emp.email}</td>

                                        <td>

                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteuser(emp.id)}
                                            >

                                                Delete

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan="5" className="empty-message">
                                        No employees found.
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                )}

            </div>

        </div>

    );

};

export default Employee;


import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import Api from "../Api";

const Protectedroute = () => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const num = Number(localStorage.getItem("number"));

  useEffect(() => {

    async function getadmin() {

        console.log(num);

      if (!num) {
        setLoading(false);
        return;
      }

      try {

        const res = await axios.get(
          `${Api}/admin/getadmin/${num}`
        );

        setUser(res.data);

        console.log("Admin data:", res.data);

      } catch (error) {

        console.error("Admin fetch error:", error);
        setUser(null);

      } finally {
        setLoading(false);
      }
    }

    getadmin();

  }, [num]);

  // Wait until API response
  if (loading) {
    return <h3>Checking authentication...</h3>;
  }

  // No logged-in user
  if (!num || !user) {
    return <Navigate to="/" replace />;
  }

  // Check admin role
  if (user.role?.toLowerCase() !== "admin") {
    return <Navigate to="/scan" replace />;
  }

  return <Outlet />;
};

export default Protectedroute;

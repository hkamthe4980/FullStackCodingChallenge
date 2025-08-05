import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/dashboard/admin");
      setStats(res.data);
      console.log("Dashboard Stats:", res.data);
    } catch (err) {
      alert("Failed to load dashboard data");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👨‍💼 Admin Dashboard</h2>
      <div style={{ marginBottom: "20px" }}>
        <p><strong>Total Users:</strong> {stats.total_users}</p>
        <p><strong>Total Stores:</strong> {stats.total_stores}</p>
        <p><strong>Total Ratings:</strong> {stats.total_ratings}</p>
      </div>

      <button onClick={() => navigate("/admin/users")}>👥 Manage Users</button>
      <button onClick={() => navigate("/admin/stores")} style={{ marginLeft: "10px" }}>🏪 Manage Stores</button>
      <br /><br />
      <button onClick={logout}>🔐 Logout</button>
    </div>
  );
}

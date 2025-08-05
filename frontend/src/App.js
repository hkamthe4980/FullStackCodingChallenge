import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/loginPage";
import AdminDashboard from './pages/admin/adminDashBoard';
import UserManagement from "./pages/admin/userDashboard";
import StoreManagement from "./pages/admin/StoreManagement";
import RatingPage from "./pages/user/RatingPage";
import StoreOwnerDashboard from "./pages/storeOwner/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
      
        <Route path="/user" element={<div>User Dashboard</div>} />
        
        {/* <Route path="/admin" element={<div>Admin Dashboard</div>} /> */}
        <Route path="/store-owner" element={<div>Store Owner Dashboard</div>} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/stores" element={<StoreManagement />} />
        <Route path="/user/ratings" element={<RatingPage />} />
        <Route path="/store-owner/dashboard" element={<StoreOwnerDashboard />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      console.log(res.data);
      localStorage.setItem("role", res.data.user.role); // Store user role
      alert("Login Successful");

      // Redirect based on role
      if (res.data.user.role === "admin") navigate("/admin/dashboard");
      else if (res.data.user.role === "store") navigate("/store-owner/dashboard");
      else navigate("/user/ratings"); // Redirect to user ratings page
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

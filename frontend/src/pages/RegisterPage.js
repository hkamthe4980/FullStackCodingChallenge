import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registration Successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="address" placeholder="Address" onChange={handleChange} required />
       
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

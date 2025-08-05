import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", address: "", role: "normal" });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users", { params: filters });
      setUsers(res.data);
    } catch (err) {
      alert("Failed to load users");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async () => {
    try {
      const res = await API.post("/users", newUser);
      alert("User added successfully!");
      setNewUser({ name: "", email: "", password: "", address: "", role: "normal" });
      fetchUsers();
    } catch (err) {
      alert("Failed to add user: " + err.response.data.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👥 User Management</h2>

      <h4>🔍 Filter Users</h4>
      <input placeholder="Name" name="name" onChange={handleFilterChange} />
      <input placeholder="Email" name="email" onChange={handleFilterChange} />
      <input placeholder="Address" name="address" onChange={handleFilterChange} />
      <select name="role" onChange={handleFilterChange}>
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="normal">Normal</option>
        <option value="store">Store Owner</option>
      </select>

      <h4 style={{ marginTop: "30px" }}>➕ Add New User</h4>
      <input placeholder="Name" name="name" value={newUser.name} onChange={handleNewUserChange} />
      <input placeholder="Email" name="email" value={newUser.email} onChange={handleNewUserChange} />
      <input placeholder="Password" name="password" type="password" value={newUser.password} onChange={handleNewUserChange} />
      <input placeholder="Address" name="address" value={newUser.address} onChange={handleNewUserChange} />
      <select name="role" value={newUser.role} onChange={handleNewUserChange}>
        <option value="normal">Normal</option>
        <option value="admin">Admin</option>
        <option value="store">Store Owner</option>
      </select>
      <br />
      <button onClick={handleAddUser}>Add User</button>

      <h4 style={{ marginTop: "30px" }}>📋 Users List</h4>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
              <td>{u.role === "store" ? u.rating || 0 : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

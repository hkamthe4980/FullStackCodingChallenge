import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [newStore, setNewStore] = useState({ name: "", email: "", password: "", address: "" });

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    try {
      const res = await API.get("/stores", { params: filters });
      setStores(res.data);
    } catch (err) {
      alert("Failed to load stores");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleNewStoreChange = (e) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
  };

  const handleAddStore = async () => {
    try {
      const res = await API.post("/stores", newStore);
      alert("Store added successfully!");
      setNewStore({ name: "", email: "", password: "", address: "" });
      fetchStores();
    } catch (err) {
      alert("Failed to add store: " + err.response?.data?.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🏪 Store Management</h2>

      <h4>🔍 Filter/Search Stores</h4>
      <input placeholder="Store Name" name="name" onChange={handleFilterChange} />
      <input placeholder="Email" name="email" onChange={handleFilterChange} />
      <input placeholder="Address" name="address" onChange={handleFilterChange} />

      <h4 style={{ marginTop: "30px" }}>➕ Add New Store</h4>
      <input placeholder="Store Name" name="name" value={newStore.name} onChange={handleNewStoreChange} />
      <input placeholder="Email" name="email" value={newStore.email} onChange={handleNewStoreChange} />
      <input placeholder="Password" name="password" type="password" value={newStore.password} onChange={handleNewStoreChange} />
      <input placeholder="Address" name="address" value={newStore.address} onChange={handleNewStoreChange} />
      <br />
      <button onClick={handleAddStore}>Add Store</button>

      <h4 style={{ marginTop: "30px" }}>📋 Store List</h4>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Avg Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.email}</td>
              <td>{store.address}</td>
              <td>{store.avg_rating || "0.0"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreManagement;

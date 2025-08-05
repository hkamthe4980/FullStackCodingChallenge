import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const StoreOwnerDashboard = () => {
  const [store, setStore] = useState({});
  const [rating, setRatings] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/stores");
      console.log("store Data ", res.data);
      setStore(res.data.store || {});
      setRatings(res.data.ratings || []);
    } catch (err) {
      alert("Failed to load dashboard");
    }
  };
  console.log("rating", rating);

  const filteredRatings = rating.filter((r) =>
    r.user_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Store Owner Dashboard</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>🏪 Store Details</h3>
        <p><strong>Name:</strong> {store?.name}</p>
        <p><strong>Email:</strong> {store?.email}</p>
        <p><strong>Address:</strong> {store?.address}</p>
        <p><strong>Average Rating:</strong> {store?.rating || "0.0"}</p>
      </div>

      <div>
        <h3>⭐ User Ratings</h3>
        <input
          type="text"
          placeholder="Search by user name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table border="1" cellPadding="10" style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredRatings.map((rating) => (
              <tr key={rating.id}>
                <td>{rating.name}</td>
                <td>{rating.email}</td>
                <td>{rating.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;

import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const RatingPage = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: "", address: "" });
  const [userRatings, setUserRatings] = useState({}); // store_id -> rating

  useEffect(() => {
    fetchStores();
    // fetchUserRatings();
  }, [search]);

  const fetchStores = async () => {
    try {
      const res = await API.get("/stores", { params: search });
      console.log(res.data);
      setStores(res.data);
    } catch (err) {
      alert("Error loading stores");
    }
  };

  // const fetchUserRatings = async () => {
  //   try {
  //     const res = await API.get("/ratings/user/");
  //     console.log(res.data);
  //     const ratingsMap = {};
  //     res.data.forEach((r) => {
  //       ratingsMap[r.store_id] = r.rating;
  //     });
  //     setUserRatings(ratingsMap);
  //   } catch (err) {
  //     alert("Failed to load your ratings");
  //   }
  // };

  const handleRatingChange = (storeId, value) => {
    setUserRatings({ ...userRatings, [storeId]: value });
  };

  const submitRating = async (storeId) => {
    try {
      const rating = userRatings[storeId];
      await API.post("/ratings/", { store_id: storeId, rating });
      alert("Rating submitted");
      fetchStores(); // refresh avg ratings
    } catch (err) {
      alert("Failed to submit rating");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>⭐ Rate Stores</h2>

      <h4>🔍 Search</h4>
      <input
        placeholder="Store Name"
        value={search.name}
        onChange={(e) => setSearch({ ...search, name: e.target.value })}
      />
      <input
        placeholder="Address"
        value={search.address}
        onChange={(e) => setSearch({ ...search, address: e.target.value })}
      />

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{store.avg_rating || "0.0"}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={userRatings[store.id] || ""}
                  onChange={(e) => handleRatingChange(store.id, e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => submitRating(store.id)}>Submit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RatingPage;

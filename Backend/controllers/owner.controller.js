const db = require('../config/db'); // assuming MySQL DB connection

exports.getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Get store by owner id
    const [storeResult] = await db.query(
      "SELECT * FROM stores WHERE owner_id = ?",
      [ownerId]
    );
    const store = storeResult[0];
     console.log(store);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Get all ratings for this store
    const [ratings] = await db.query(
      `SELECT u.name as user_name, r.rating, r.created_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?`,
      [store.id]
    );

    // Calculate average rating
    const [avgResult] = await db.query(
      `SELECT AVG(rating) as avg_rating FROM ratings WHERE store_id = ?`,
      [store.id]
    );
    const avg_rating = parseFloat(avgResult[0].avg_rating).toFixed(2);

    return res.json({
      store: {
        name: store.name,
        email: store.email,
        address: store.address,
        avg_rating
      },
      ratings
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const db = require('../config/db');

// Admin Dashboard
exports.getAdminDashboard = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }                    

  const totalUsers = `SELECT COUNT(*) AS userCount FROM users`;
  const totalStores = `SELECT COUNT(*) AS storeCount FROM stores`;
  const totalRatings = `SELECT COUNT(*) AS ratingCount FROM ratings`;

  db.query(totalUsers, (err1, users) => {
    if (err1) return res.status(500).json({ error: err1 });

    db.query(totalStores, (err2, stores) => {
      if (err2) return res.status(500).json({ error: err2 });

      db.query(totalRatings, (err3, ratings) => {
        if (err3) return res.status(500).json({ error: err3 });

        res.json({
          total_users: users[0].userCount,
          total_stores: stores[0].storeCount,
          total_ratings: ratings[0].ratingCount
        });
      });
    });
  });
};

// Store Owner Dashboard
exports.getStoreOwnerDashboard = (req, res) => {
  if (req.user.role !== 'store') {
    return res.status(403).json({ message: 'Access denied. Store owners only.' });
  }

  const ownerId = req.user.id;

  const storeQuery = `SELECT id FROM stores WHERE owner_id = ?`;
  db.query(storeQuery, [ownerId], (err1, stores) => {
    if (err1) return res.status(500).json({ error: err1 });

    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({
        total_stores: 0,
        total_ratings: 0,
        average_rating: 0
      });
    }

    const totalRatings = `
      SELECT COUNT(*) AS ratingCount, AVG(rating) AS avgRating
      FROM ratings
      WHERE store_id IN (?)
    `;
    db.query(totalRatings, [storeIds], (err2, ratingsData) => {
      if (err2) return res.status(500).json({ error: err2 });

      res.json({
        total_stores: storeIds.length,
        total_ratings: ratingsData[0].ratingCount || 0,
        average_rating: parseFloat(ratingsData[0].avgRating).toFixed(2) || "0.00"
      });
    });
  });
};

const db = require('../config/db');

// Submit or update rating
exports.submitRating = (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;

  if (req.user.role !== 'normal') {
    return res.status(403).json({ message: 'Only normal users can submit ratings' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  // Check if rating exists
  const checkSql = `SELECT * FROM ratings WHERE user_id = ? AND store_id = ?`;
  db.query(checkSql, [user_id, store_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.length > 0) {
      // Update rating
      const updateSql = `UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?`;
      db.query(updateSql, [rating, user_id, store_id], (err2) => {
        if (err2) return res.status(500).json({ error: err2 });
        res.json({ message: 'Rating updated successfully' });
      });
    } else {
      // Insert new rating
      const insertSql = `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`;
      db.query(insertSql, [user_id, store_id, rating], (err3) => {
        if (err3) return res.status(500).json({ error: err3 });
        res.json({ message: 'Rating submitted successfully' });
      });
    }
  });
};

// Get all ratings for a store (store owner only)
exports.getRatingsByStore = (req, res) => {
  const storeId = req.params.storeId;

  if (req.user.role !== 'store') {
    return res.status(403).json({ message: 'Only store owners can view their ratings' });
  }

  // Check ownership
  const checkOwner = `SELECT * FROM stores WHERE id = ? AND owner_id = ?`;
  db.query(checkOwner, [storeId, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(403).json({ message: 'Access denied to this store' });

    const sql = `
      SELECT u.name, u.email, r.rating
      FROM ratings r
      JOIN users u ON u.id = r.user_id
      WHERE r.store_id = ?
    `;
    db.query(sql, [storeId], (err2, results) => {
      if (err2) return res.status(500).json({ error: err2 });
      console.log(results);
      res.json(results);
    });
  });
};

// Get all ratings by a user
exports.getRatingsByUser = (req, res) => {
  const userId = req.params.userId;

  if (req.user.id != userId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const sql = `
    SELECT r.rating, s.name AS store_name, s.address
    FROM ratings r
    JOIN stores s ON r.store_id = s.id
    WHERE r.user_id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

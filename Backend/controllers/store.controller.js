const db = require('../config/db');

// Add a new store
exports.addStore = (req, res) => {
  console.log("Add store request received", req.body);
  const { name, email, address, owner_id } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can add stores' });
  }

  const sql = `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, email, address, owner_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Store added successfully', storeId: result.insertId });
  });
};

// Get all stores (with optional filters/sorting)
exports.getStores = (req, res) => {
  const { name, email, address, sortBy, order } = req.query;

  let sql = `SELECT s.*, COALESCE(AVG(r.rating), 0) AS rating 
             FROM stores s 
             LEFT JOIN ratings r ON s.id = r.store_id 
             WHERE 1=1`;

  if (name) sql += ` AND s.name LIKE '%${name}%'`;
  if (email) sql += ` AND s.email LIKE '%${email}%'`;
  if (address) sql += ` AND s.address LIKE '%${address}%'`;

  sql += ` GROUP BY s.id`;

  if (sortBy) {
    const validSorts = ['name', 'email', 'address', 'rating'];
    if (validSorts.includes(sortBy)) {
      sql += ` ORDER BY ${sortBy} ${order === 'desc' ? 'DESC' : 'ASC'}`;
    }
  }

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get single store detail
exports.getStoreById = (req, res) => {
  const storeId = req.params.id;

  const sql = `
    SELECT s.*, COALESCE(AVG(r.rating), 0) AS rating
    FROM stores s 
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE s.id = ?
    GROUP BY s.id
  `;

  db.query(sql, [storeId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Store not found' });

    res.json(results[0]);
  });
};

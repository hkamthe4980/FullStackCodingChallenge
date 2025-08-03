const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.addUser = (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [name, email, hashedPassword, address, role || 'normal'], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'User added successfully', id: result.insertId });
  });
};

exports.getUsers = (req, res) => {
  const { name, email, address, role, sortBy, order } = req.query;

  let sql = `SELECT id, name, email, address, role FROM users WHERE 1=1`;
  if (name) sql += ` AND name LIKE '%${name}%'`;
  if (email) sql += ` AND email LIKE '%${email}%'`;
  if (address) sql += ` AND address LIKE '%${address}%'`;
  if (role) sql += ` AND role = '${role}'`;

  if (sortBy) {
    const validSorts = ['name', 'email', 'role'];
    if (validSorts.includes(sortBy)) {
      sql += ` ORDER BY ${sortBy} ${order === 'desc' ? 'DESC' : 'ASC'}`;
    }
  }

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  const userId = req.params.id;
  const sql = `SELECT id, name, email, address, role FROM users WHERE id = ?`;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = results[0];

    // If store owner, fetch average rating
    if (user.role === 'store') {
      db.query(
        `SELECT AVG(rating) AS rating FROM ratings WHERE store_id = ?`,
        [user.id],
        (err2, result2) => {
          user.rating = result2[0].rating || 0;
          res.json(user);
        }
      );
    } else {
      res.json(user);
    }
  });
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, address, password } = req.body;

  let updates = [];
  if (name) updates.push(`name = '${name}'`);
  if (address) updates.push(`address = '${address}'`);
  if (password) {
    const hashed = bcrypt.hashSync(password, 10);
    updates.push(`password = '${hashed}'`);
  }

  if (updates.length === 0)
    return res.status(400).json({ message: 'No fields to update' });

  const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User updated successfully' });
  });
};




exports.updatePassword = (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: 'Password must be 8-16 chars, include 1 uppercase, 1 special char'
    });
  }

  const isSelf = parseInt(id) === req.user.id;

  // Only user themselves or admin can change password
  if (!isSelf && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const sql = `SELECT password FROM users WHERE id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const existingHashed = results[0].password;

    // If not admin, verify old password
    if (req.user.role !== 'admin') {
      const isMatch = bcrypt.compareSync(oldPassword, existingHashed);
      if (!isMatch) {
        return res.status(401).json({ message: 'Old password is incorrect' });
      }
    }

    const hashedNew = bcrypt.hashSync(newPassword, 10);
    const updateSql = `UPDATE users SET password = ? WHERE id = ?`;

    db.query(updateSql, [hashedNew, id], (err2) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json({ message: 'Password updated successfully' });
    });
  });
};

const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all invoices
router.get('/', (req, res) => {
  db.query('SELECT * FROM invoices ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add new invoice
router.post('/', (req, res) => {
  const { name, amount, date, due, desc, status } = req.body;
  const sql = 'INSERT INTO invoices (name, amount, date, due_date, description, status) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, amount, date, due, desc, status || 'pending'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, amount, date, due, desc, status: status || 'pending' });
  });
});

// Edit invoice
router.put('/:id', (req, res) => {
  const { name, amount, date, due, desc, status } = req.body;
  const sql = 'UPDATE invoices SET name=?, amount=?, date=?, due_date=?, description=?, status=? WHERE id=?';
  db.query(sql, [name, amount, date, due, desc, status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Invoice updated successfully' });
  });
});

// Delete invoice
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM invoices WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Invoice deleted successfully' });
  });
});

module.exports = router;
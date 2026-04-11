const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all appointments
router.get('/', (req, res) => {
  db.query('SELECT * FROM appointments ORDER BY date, time', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add new appointment
router.post('/', (req, res) => {
  const { name, purpose, date, time, notes } = req.body;
  const sql = 'INSERT INTO appointments (name, purpose, date, time, notes) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, purpose, date, time, notes], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, purpose, date, time, notes });
  });
});

// Edit appointment
router.put('/:id', (req, res) => {
  const { name, purpose, date, time, notes } = req.body;
  const sql = 'UPDATE appointments SET name=?, purpose=?, date=?, time=?, notes=? WHERE id=?';
  db.query(sql, [name, purpose, date, time, notes, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Appointment updated successfully' });
  });
});

// Delete appointment
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM appointments WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Appointment cancelled successfully' });
  });
});

module.exports = router;
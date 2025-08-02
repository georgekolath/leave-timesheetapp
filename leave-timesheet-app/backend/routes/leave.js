const express = require('express');
const router = express.Router();
const Leave = require('../models/leave');

router.post('/apply', (req, res) => {
  Leave.addLeave(req.body);
  res.json({ success: true });
});

router.get('/hasLeave', (req, res) => {
  const { userId, date } = req.query;
  res.json({ hasLeave: Leave.hasLeave(userId, date) });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Timesheet = require('../models/timesheet');


// POST /api/timesheet/submit - Save timesheet entry
router.post('/submit', (req, res) => {
  Timesheet.addTimesheet(req.body);
  res.json({ success: true });
});

// GET /api/timesheet - Get timesheet entries for user/week
router.get('/', (req, res) => {
  const { userId, weekStart } = req.query;
  // Calculate week end
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const entries = Timesheet.getTimesheet(Number(userId), weekStart, end.toISOString().slice(0,10));
  res.json(entries);
});

router.get('/missing', (req, res) => {
  const { userId, weekStart, weekEnd } = req.query;
  const missing = Timesheet.getMissingDates(userId, weekStart, weekEnd);
  res.json({ missing });
});

module.exports = router;
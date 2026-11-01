require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { calculateBudget } = require('./src/budgetEngine');
const { generateTimeline } = require('./src/timelineEngine');
const { getVendorChecklist } = require('./src/vendorChecklist');

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/budget', (req, res) => {
  try {
    const { eventType, guestCount, budgetTier, cityTier } = req.body || {};
    const result = calculateBudget({ eventType, guestCount, budgetTier, cityTier });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/timeline', (req, res) => {
  try {
    const { eventType, eventDate } = req.body || {};
    const result = generateTimeline({ eventType, eventDate });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/vendors/:eventType', (req, res) => {
  try {
    const { eventType } = req.params;
    const result = getVendorChecklist(eventType);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8090;

const server = app.listen(PORT, () => {
  console.log(`RevelPlan server running on port ${PORT}`);
});

module.exports = { app, server };

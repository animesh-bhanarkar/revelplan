require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');

const { calculateBudget } = require('./src/budgetEngine');
const { generateTimeline } = require('./src/timelineEngine');
const { getVendorChecklist } = require('./src/vendorChecklist');
const { parseEventIntake, generateIdeas } = require('./src/geminiService');

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

app.post('/api/intake', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }
    const result = await parseEventIntake(message);
    res.json(result);
  } catch (err) {
    if (!process.env.GEMINI_API_KEY || err.message === 'Gemini API key not configured') {
      return res.status(503).json({ error: 'AI features not available' });
    }
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/ideas', async (req, res) => {
  try {
    const { eventPlan } = req.body || {};
    if (!eventPlan) {
      return res.status(400).json({ error: 'eventPlan is required' });
    }
    const result = await generateIdeas(eventPlan);
    res.json(result);
  } catch (err) {
    if (!process.env.GEMINI_API_KEY || err.message === 'Gemini API key not configured') {
      return res.status(503).json({ error: 'AI features not available' });
    }
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/places', async (req, res) => {
  const { city, category } = req.query || {};
  if (!city || !category) {
    return res.status(400).json({ error: 'city and category are required' });
  }

  if (!process.env.PLACES_API_KEY) {
    return res.status(503).json({ error: 'Places feature not available' });
  }

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount',
      },
      body: JSON.stringify({
        textQuery: `${category} in ${city} India`,
        maxResultCount: 5,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: `Places API error: ${response.status} ${errorText}` });
    }

    const data = await response.json();
    const places = (data.places || []).map((p) => ({
      name: p.displayName && p.displayName.text ? p.displayName.text : (typeof p.displayName === 'string' ? p.displayName : ''),
      address: p.formattedAddress || '',
      rating: p.rating ?? null,
      totalRatings: p.userRatingCount ?? 0,
    }));

    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8090;

const server = app.listen(PORT, () => {
  console.log(`RevelPlan server running on port ${PORT}`);
});

module.exports = { app, server };

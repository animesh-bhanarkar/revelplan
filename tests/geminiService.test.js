const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { parseEventIntake, generateIdeas } = require('../src/geminiService');

const originalEnvKey = process.env.GEMINI_API_KEY;
let originalGetGenerativeModel;

beforeEach(() => {
  process.env.GEMINI_API_KEY = originalEnvKey || 'test-mock-key';
  originalGetGenerativeModel = GoogleGenerativeAI.prototype.getGenerativeModel;
});

afterEach(() => {
  if (originalEnvKey) {
    process.env.GEMINI_API_KEY = originalEnvKey;
  } else {
    delete process.env.GEMINI_API_KEY;
  }
  GoogleGenerativeAI.prototype.getGenerativeModel = originalGetGenerativeModel;
});

function mockGeminiResponse(responseText) {
  GoogleGenerativeAI.prototype.getGenerativeModel = () => ({
    generateContent: async () => ({
      response: {
        text: () => responseText,
      },
    }),
  });
}

test('parseEventIntake: returns correct parsed object when Gemini returns valid JSON', async () => {
  const expected = {
    eventType: 'wedding',
    guestCount: 150,
    budgetTier: 'mid',
    cityTier: 'metro',
    city: 'Mumbai',
    eventDate: '2027-11-20',
  };

  mockGeminiResponse(JSON.stringify(expected));

  const result = await parseEventIntake('Planning a wedding for 150 guests in Mumbai around Nov 2027');
  assert.deepEqual(result, expected);
});

test('parseEventIntake: handles markdown fences in response', async () => {
  const expected = {
    eventType: 'birthday',
    guestCount: 50,
    budgetTier: 'budget',
    cityTier: 'tier2',
    city: 'Pune',
    eventDate: '2027-05-10',
  };

  const fencedResponse = '```json\n' + JSON.stringify(expected) + '\n```';
  mockGeminiResponse(fencedResponse);

  const result = await parseEventIntake('Birthday party in Pune');
  assert.deepEqual(result, expected);
});

test('parseEventIntake: repairs missing closing }', async () => {
  // Missing closing brace at the end
  const malformedJson = '{"eventType":"community","guestCount":200,"budgetTier":"budget","cityTier":"tier3","city":"Nashik","eventDate":"2027-04-15"';
  mockGeminiResponse(malformedJson);

  const result = await parseEventIntake('Community meetup in Nashik');
  assert.equal(result.eventType, 'community');
  assert.equal(result.guestCount, 200);
  assert.equal(result.city, 'Nashik');
});

test('generateIdeas: returns array when Gemini returns valid JSON array', async () => {
  const mockIdeas = [
    { idea: 'Live Rajasthani folk fusion band', category: 'Entertainment', estimatedCost: '₹35,000' },
    { idea: 'Chai & street food live counter', category: 'Catering', estimatedCost: '₹20,000' },
    { idea: 'Instant Polaroid photo souvenir tree', category: 'Photography', estimatedCost: '₹8,000' },
    { idea: 'Customized earthen pot favors', category: 'Gifts', estimatedCost: '₹12,000' },
    { idea: 'Marigold & fairy light canopy', category: 'Decoration', estimatedCost: '₹25,000' },
  ];

  mockGeminiResponse(JSON.stringify(mockIdeas));

  const plan = { eventType: 'wedding', guestCount: 100, budgetTier: 'mid', city: 'Jaipur' };
  const result = await generateIdeas(plan);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 5);
  assert.deepEqual(result, mockIdeas);
});

test('geminiService: both functions throw when GEMINI_API_KEY is missing', async () => {
  delete process.env.GEMINI_API_KEY;

  await assert.rejects(
    async () => {
      await parseEventIntake('Wedding in Delhi');
    },
    {
      name: 'Error',
      message: 'Gemini API key not configured',
    }
  );

  await assert.rejects(
    async () => {
      await generateIdeas({ eventType: 'birthday' });
    },
    {
      name: 'Error',
      message: 'Gemini API key not configured',
    }
  );
});

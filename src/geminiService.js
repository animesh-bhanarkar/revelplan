const { GoogleGenerativeAI } = require('@google/generative-ai');

const INTAKE_SYSTEM_PROMPT = `You are an event planning assistant. Extract event details from the user's message and return ONLY valid JSON with these fields:
{ "eventType": "wedding|birthday|community", "guestCount": number, "budgetTier": "budget|mid|premium", "cityTier": "metro|tier2|tier3", "city": "string", "eventDate": "YYYY-MM-DD" }
If a field cannot be determined, use null. Return ONLY the JSON, no markdown fences.`;

const IDEAS_SYSTEM_PROMPT = `You are a creative Indian event planner. Given an event plan, suggest 5 unique, budget-appropriate ideas tailored for India. Return ONLY a JSON array of { "idea": "string", "category": "string", "estimatedCost": "string" }. No markdown fences.`;

const CHAT_SYSTEM_PROMPT = `You are RevelPlan, a friendly Indian event planning assistant. Help users plan weddings, birthdays, and community events in India. Give practical, budget-conscious advice. Keep responses concise and actionable.`;

function getModel(systemInstruction) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction,
  });
}

function stripMarkdownFences(str) {
  if (!str) return '';
  let cleaned = str.trim();
  const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match) {
    cleaned = match[1].trim();
  } else {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }
  return cleaned;
}

function parseJsonWithRepair(rawText, repairChar = '}') {
  const stripped = stripMarkdownFences(rawText);
  try {
    return JSON.parse(stripped);
  } catch (err) {
    try {
      return JSON.parse(stripped + repairChar);
    } catch {
      throw err;
    }
  }
}

async function parseEventIntake(userText) {
  const model = getModel(INTAKE_SYSTEM_PROMPT);
  const result = await model.generateContent(userText);
  const responseText = result.response.text();
  return parseJsonWithRepair(responseText, '}');
}

async function generateIdeas(eventPlan) {
  const model = getModel(IDEAS_SYSTEM_PROMPT);
  const prompt = typeof eventPlan === 'string' ? eventPlan : JSON.stringify(eventPlan);
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  return parseJsonWithRepair(responseText, ']');
}

async function generateChatResponse(userMessage) {
  const model = getModel(CHAT_SYSTEM_PROMPT);
  try {
    return await model.generateContentStream(userMessage);
  } catch (err) {
    if (err.message && err.message.includes('503')) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await model.generateContentStream(userMessage);
    }
    throw err;
  }
}

module.exports = {
  parseEventIntake,
  generateIdeas,
  generateChatResponse,
  stripMarkdownFences,
  parseJsonWithRepair,
  INTAKE_SYSTEM_PROMPT,
  IDEAS_SYSTEM_PROMPT,
  CHAT_SYSTEM_PROMPT,
};

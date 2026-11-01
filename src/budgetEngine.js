const EVENT_TYPES = Object.freeze({
  WEDDING: 'wedding',
  BIRTHDAY: 'birthday',
  COMMUNITY: 'community',
});

const BUDGET_TIERS = Object.freeze({
  BUDGET: 'budget',
  MID: 'mid',
  PREMIUM: 'premium',
});

const CITY_TIERS = Object.freeze({
  METRO: 'metro',
  TIER2: 'tier2',
  TIER3: 'tier3',
});

const BASE_RATES = {
  [EVENT_TYPES.WEDDING]: {
    [BUDGET_TIERS.BUDGET]: 800,
    [BUDGET_TIERS.MID]: 1500,
    [BUDGET_TIERS.PREMIUM]: 3000,
  },
  [EVENT_TYPES.BIRTHDAY]: {
    [BUDGET_TIERS.BUDGET]: 300,
    [BUDGET_TIERS.MID]: 600,
    [BUDGET_TIERS.PREMIUM]: 1200,
  },
  [EVENT_TYPES.COMMUNITY]: {
    [BUDGET_TIERS.BUDGET]: 200,
    [BUDGET_TIERS.MID]: 400,
    [BUDGET_TIERS.PREMIUM]: 800,
  },
};

const CITY_MULTIPLIERS = {
  [CITY_TIERS.METRO]: 1.3,
  [CITY_TIERS.TIER2]: 1.0,
  [CITY_TIERS.TIER3]: 0.8,
};

const BREAKDOWN_PERCENTAGES = {
  [EVENT_TYPES.WEDDING]: {
    venue: 0.30,
    catering: 0.35,
    decoration: 0.15,
    photography: 0.10,
    misc: 0.10,
  },
  [EVENT_TYPES.BIRTHDAY]: {
    venue: 0.25,
    catering: 0.40,
    decoration: 0.20,
    entertainment: 0.10,
    misc: 0.05,
  },
  [EVENT_TYPES.COMMUNITY]: {
    venue: 0.35,
    catering: 0.40,
    logistics: 0.15,
    misc: 0.10,
  },
};

function calculateBudget({ eventType, guestCount, budgetTier, cityTier }) {
  if (!eventType || !Object.values(EVENT_TYPES).includes(eventType)) {
    throw new Error(`Invalid eventType: "${eventType}". Allowed: ${Object.values(EVENT_TYPES).join(', ')}`);
  }

  if (!budgetTier || !Object.values(BUDGET_TIERS).includes(budgetTier)) {
    throw new Error(`Invalid budgetTier: "${budgetTier}". Allowed: ${Object.values(BUDGET_TIERS).join(', ')}`);
  }

  if (!cityTier || !Object.values(CITY_TIERS).includes(cityTier)) {
    throw new Error(`Invalid cityTier: "${cityTier}". Allowed: ${Object.values(CITY_TIERS).join(', ')}`);
  }

  const parsedGuests = Number(guestCount);
  if (!Number.isFinite(parsedGuests) || parsedGuests <= 0) {
    throw new Error(`Invalid guestCount: "${guestCount}". Must be a positive number`);
  }

  const baseRate = BASE_RATES[eventType][budgetTier];
  const multiplier = CITY_MULTIPLIERS[cityTier];
  const calculatedPerHead = Math.round(baseRate * multiplier);
  const total = Math.round(calculatedPerHead * parsedGuests);
  const perHead = total / parsedGuests;

  const breakdown = {};
  const percentages = BREAKDOWN_PERCENTAGES[eventType];
  for (const [category, pct] of Object.entries(percentages)) {
    breakdown[category] = Math.round(total * pct);
  }

  return {
    total,
    breakdown,
    perHead,
  };
}

module.exports = {
  calculateBudget,
  EVENT_TYPES,
  BUDGET_TIERS,
  CITY_TIERS,
};

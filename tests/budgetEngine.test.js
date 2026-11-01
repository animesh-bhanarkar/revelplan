const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateBudget,
  EVENT_TYPES,
  BUDGET_TIERS,
  CITY_TIERS,
} = require('../src/budgetEngine');

test('calculateBudget: calculates wedding budget correctly (mid tier, tier2 city)', () => {
  const result = calculateBudget({
    eventType: EVENT_TYPES.WEDDING,
    guestCount: 100,
    budgetTier: BUDGET_TIERS.MID,
    cityTier: CITY_TIERS.TIER2,
  });

  // Base: 1500, multiplier: 1.0 -> perHead: 1500, total: 150000
  assert.equal(result.total, 150000);
  assert.equal(result.perHead, 1500);
  assert.equal(result.breakdown.venue, 45000); // 30%
  assert.equal(result.breakdown.catering, 52500); // 35%
  assert.equal(result.breakdown.decoration, 22500); // 15%
  assert.equal(result.breakdown.photography, 15000); // 10%
  assert.equal(result.breakdown.misc, 15000); // 10%
});

test('calculateBudget: calculates birthday budget correctly (premium tier, metro city)', () => {
  const result = calculateBudget({
    eventType: EVENT_TYPES.BIRTHDAY,
    guestCount: 50,
    budgetTier: BUDGET_TIERS.PREMIUM,
    cityTier: CITY_TIERS.METRO,
  });

  // Base: 1200, multiplier: 1.3 -> perHead: 1560, total: 78000
  assert.equal(result.total, 78000);
  assert.equal(result.perHead, 1560);
  assert.equal(result.breakdown.venue, 19500); // 25%
  assert.equal(result.breakdown.catering, 31200); // 40%
  assert.equal(result.breakdown.decoration, 15600); // 20%
  assert.equal(result.breakdown.entertainment, 7800); // 10%
  assert.equal(result.breakdown.misc, 3900); // 5%
});

test('calculateBudget: calculates community event budget correctly (budget tier, tier3 city)', () => {
  const result = calculateBudget({
    eventType: EVENT_TYPES.COMMUNITY,
    guestCount: 200,
    budgetTier: BUDGET_TIERS.BUDGET,
    cityTier: CITY_TIERS.TIER3,
  });

  // Base: 200, multiplier: 0.8 -> perHead: 160, total: 32000
  assert.equal(result.total, 32000);
  assert.equal(result.perHead, 160);
  assert.equal(result.breakdown.venue, 11200); // 35%
  assert.equal(result.breakdown.catering, 12800); // 40%
  assert.equal(result.breakdown.logistics, 4800); // 15%
  assert.equal(result.breakdown.misc, 3200); // 10%
});

test('calculateBudget: throws error when eventType is invalid', () => {
  assert.throws(
    () => {
      calculateBudget({
        eventType: 'corporate',
        guestCount: 100,
        budgetTier: BUDGET_TIERS.MID,
        cityTier: CITY_TIERS.METRO,
      });
    },
    {
      message: /Invalid eventType/,
    }
  );
});

test('calculateBudget: throws error when budgetTier or cityTier is invalid', () => {
  assert.throws(
    () => {
      calculateBudget({
        eventType: EVENT_TYPES.WEDDING,
        guestCount: 100,
        budgetTier: 'ultra-luxury',
        cityTier: CITY_TIERS.METRO,
      });
    },
    {
      message: /Invalid budgetTier/,
    }
  );

  assert.throws(
    () => {
      calculateBudget({
        eventType: EVENT_TYPES.WEDDING,
        guestCount: 100,
        budgetTier: BUDGET_TIERS.MID,
        cityTier: 'tier4',
      });
    },
    {
      message: /Invalid cityTier/,
    }
  );
});

test('calculateBudget: throws error when guestCount is non-positive or invalid', () => {
  assert.throws(
    () => {
      calculateBudget({
        eventType: EVENT_TYPES.WEDDING,
        guestCount: 0,
        budgetTier: BUDGET_TIERS.MID,
        cityTier: CITY_TIERS.METRO,
      });
    },
    {
      message: /Invalid guestCount/,
    }
  );

  assert.throws(
    () => {
      calculateBudget({
        eventType: EVENT_TYPES.WEDDING,
        guestCount: -10,
        budgetTier: BUDGET_TIERS.MID,
        cityTier: CITY_TIERS.METRO,
      });
    },
    {
      message: /Invalid guestCount/,
    }
  );
});

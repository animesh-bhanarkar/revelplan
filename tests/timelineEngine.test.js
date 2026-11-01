const { test } = require('node:test');
const assert = require('node:assert/strict');
const { generateTimeline, PRIORITIES } = require('../src/timelineEngine');
const { EVENT_TYPES } = require('../src/budgetEngine');

// Use a future date for testing (1 year ahead)
const FUTURE_DATE_STR = '2027-12-01T00:00:00.000Z';
const FUTURE_DATE_OBJ = new Date(FUTURE_DATE_STR);

test('generateTimeline: generates wedding timeline with 9 milestones sorted ascending', () => {
  const milestones = generateTimeline({
    eventType: EVENT_TYPES.WEDDING,
    eventDate: FUTURE_DATE_STR,
  });

  assert.equal(milestones.length, 9);
  assert.equal(milestones[0].daysBeforeEvent, 180);
  assert.equal(milestones[0].task, 'Book venue');
  assert.equal(milestones[0].priority, PRIORITIES.HIGH);

  assert.equal(milestones[milestones.length - 1].daysBeforeEvent, 1);
  assert.equal(milestones[milestones.length - 1].task, 'Prep day checklist');
  assert.equal(milestones[milestones.length - 1].priority, PRIORITIES.LOW);

  // Verify ascending date order
  for (let i = 1; i < milestones.length; i++) {
    const prevDate = new Date(milestones[i - 1].date).getTime();
    const currDate = new Date(milestones[i].date).getTime();
    assert.ok(currDate >= prevDate, `Expected ${milestones[i].date} to be >= ${milestones[i - 1].date}`);
  }
});

test('generateTimeline: generates birthday timeline with 6 milestones', () => {
  const milestones = generateTimeline({
    eventType: EVENT_TYPES.BIRTHDAY,
    eventDate: FUTURE_DATE_OBJ,
  });

  assert.equal(milestones.length, 6);
  assert.equal(milestones[0].daysBeforeEvent, 30);
  assert.equal(milestones[0].task, 'Book venue');
  assert.equal(milestones[0].priority, PRIORITIES.HIGH);

  assert.equal(milestones[1].daysBeforeEvent, 21);
  assert.equal(milestones[1].task, 'Send invitations');

  assert.equal(milestones[2].daysBeforeEvent, 14);
  assert.equal(milestones[2].task, 'Confirm caterer');

  assert.equal(milestones[3].daysBeforeEvent, 7);
  assert.equal(milestones[3].task, 'Order cake and decoration');
  assert.equal(milestones[3].priority, PRIORITIES.MEDIUM);

  assert.equal(milestones[4].daysBeforeEvent, 3);
  assert.equal(milestones[4].task, 'Final headcount');

  assert.equal(milestones[5].daysBeforeEvent, 1);
  assert.equal(milestones[5].task, 'Prep checklist');
  assert.equal(milestones[5].priority, PRIORITIES.LOW);
});

test('generateTimeline: generates community event timeline with 6 milestones', () => {
  const milestones = generateTimeline({
    eventType: EVENT_TYPES.COMMUNITY,
    eventDate: FUTURE_DATE_STR,
  });

  assert.equal(milestones.length, 6);
  assert.equal(milestones[0].daysBeforeEvent, 60);
  assert.equal(milestones[0].task, 'Reserve venue and permissions');
  assert.equal(milestones[0].priority, PRIORITIES.HIGH);

  assert.equal(milestones[5].daysBeforeEvent, 1);
  assert.equal(milestones[5].task, 'Setup checklist');
  assert.equal(milestones[5].priority, PRIORITIES.LOW);
});

test('generateTimeline: throws error for invalid eventType', () => {
  assert.throws(
    () => {
      generateTimeline({
        eventType: 'anniversary',
        eventDate: FUTURE_DATE_STR,
      });
    },
    {
      message: /Invalid eventType/,
    }
  );
});

test('generateTimeline: throws error when eventDate is in the past', () => {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
  assert.throws(
    () => {
      generateTimeline({
        eventType: EVENT_TYPES.BIRTHDAY,
        eventDate: pastDate,
      });
    },
    {
      message: /eventDate cannot be in the past/,
    }
  );

  assert.throws(
    () => {
      generateTimeline({
        eventType: EVENT_TYPES.WEDDING,
        eventDate: '2020-01-01',
      });
    },
    {
      message: /eventDate cannot be in the past/,
    }
  );
});

test('generateTimeline: throws error for missing or malformed eventDate', () => {
  assert.throws(
    () => {
      generateTimeline({
        eventType: EVENT_TYPES.WEDDING,
        eventDate: '',
      });
    },
    {
      message: /eventDate is required/,
    }
  );

  assert.throws(
    () => {
      generateTimeline({
        eventType: EVENT_TYPES.WEDDING,
        eventDate: 'not-a-valid-date',
      });
    },
    {
      message: /Invalid eventDate/,
    }
  );
});

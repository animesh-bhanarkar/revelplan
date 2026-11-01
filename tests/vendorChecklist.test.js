const { test } = require('node:test');
const assert = require('node:assert/strict');
const { getVendorChecklist, VENDOR_PRIORITIES } = require('../src/vendorChecklist');
const { EVENT_TYPES } = require('../src/budgetEngine');

test('getVendorChecklist: returns wedding checklist with all categories and priorities', () => {
  const checklist = getVendorChecklist(EVENT_TYPES.WEDDING);

  assert.ok(checklist.Venue);
  assert.equal(checklist.Venue[0].vendor, 'Banquet Hall / Farm House');
  assert.equal(checklist.Venue[0].priority, VENDOR_PRIORITIES.ESSENTIAL);
  assert.equal(checklist.Venue[0].notes, 'Book 6 months ahead');

  assert.ok(checklist.Catering);
  assert.equal(checklist.Catering[0].vendor, 'Catering Service');

  assert.ok(checklist.Photography);
  assert.equal(checklist.Photography.length, 2);
  assert.equal(checklist.Photography[0].vendor, 'Photographer');
  assert.equal(checklist.Photography[0].priority, VENDOR_PRIORITIES.ESSENTIAL);
  assert.equal(checklist.Photography[1].vendor, 'Videographer');
  assert.equal(checklist.Photography[1].priority, VENDOR_PRIORITIES.RECOMMENDED);

  assert.ok(checklist.Decoration);
  assert.ok(checklist.Music);
  assert.equal(checklist.Music[0].priority, VENDOR_PRIORITIES.RECOMMENDED);

  assert.ok(checklist.Makeup);
  assert.equal(checklist.Makeup[0].priority, VENDOR_PRIORITIES.ESSENTIAL);

  assert.ok(checklist.Logistics);
  assert.equal(checklist.Logistics[0].priority, VENDOR_PRIORITIES.OPTIONAL);
});

test('getVendorChecklist: returns birthday checklist with all expected categories', () => {
  const checklist = getVendorChecklist(EVENT_TYPES.BIRTHDAY);

  assert.deepEqual(Object.keys(checklist), ['Venue', 'Catering', 'Decoration', 'Entertainment', 'Photography']);
  assert.equal(checklist.Venue[0].vendor, 'Party Hall / Home');
  assert.equal(checklist.Venue[0].priority, VENDOR_PRIORITIES.ESSENTIAL);
  assert.equal(checklist.Catering[0].vendor, 'Caterer / Cloud Kitchen');
  assert.equal(checklist.Decoration[0].vendor, 'Balloon / Theme Decorator');
  assert.equal(checklist.Decoration[0].priority, VENDOR_PRIORITIES.RECOMMENDED);
  assert.equal(checklist.Entertainment[0].vendor, 'Emcee / Performer');
  assert.equal(checklist.Entertainment[0].priority, VENDOR_PRIORITIES.OPTIONAL);
  assert.equal(checklist.Photography[0].vendor, 'Photographer');
  assert.equal(checklist.Photography[0].priority, VENDOR_PRIORITIES.RECOMMENDED);
});

test('getVendorChecklist: returns community checklist with expected categories and multiple logistics items', () => {
  const checklist = getVendorChecklist(EVENT_TYPES.COMMUNITY);

  assert.deepEqual(Object.keys(checklist), ['Venue', 'Catering', 'Logistics', 'Printing']);
  assert.equal(checklist.Venue[0].vendor, 'Community Hall / Open Ground');
  assert.equal(checklist.Catering[0].vendor, 'Bulk Caterer');
  assert.equal(checklist.Logistics.length, 2);
  assert.equal(checklist.Logistics[0].vendor, 'Stage & Sound');
  assert.equal(checklist.Logistics[1].vendor, 'Volunteers');
  assert.equal(checklist.Printing[0].vendor, 'Banner / Flex Printing');
  assert.equal(checklist.Printing[0].priority, VENDOR_PRIORITIES.RECOMMENDED);
});

test('getVendorChecklist: throws error when eventType is invalid', () => {
  assert.throws(
    () => {
      getVendorChecklist('festival');
    },
    {
      message: /Invalid eventType/,
    }
  );
});

test('getVendorChecklist: throws error when eventType is missing or null', () => {
  assert.throws(
    () => {
      getVendorChecklist(null);
    },
    {
      message: /Invalid eventType/,
    }
  );

  assert.throws(
    () => {
      getVendorChecklist('');
    },
    {
      message: /Invalid eventType/,
    }
  );
});

test('getVendorChecklist: returned checklist is isolated from mutations', () => {
  const checklist1 = getVendorChecklist(EVENT_TYPES.WEDDING);
  checklist1.Venue.push({ vendor: 'Extra Venue', priority: 'optional', notes: 'test' });

  const checklist2 = getVendorChecklist(EVENT_TYPES.WEDDING);
  assert.equal(checklist2.Venue.length, 1);
});

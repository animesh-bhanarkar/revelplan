const { EVENT_TYPES } = require('./budgetEngine');

const VENDOR_PRIORITIES = Object.freeze({
  ESSENTIAL: 'essential',
  RECOMMENDED: 'recommended',
  OPTIONAL: 'optional',
});

const CHECKLIST_BY_TYPE = {
  [EVENT_TYPES.WEDDING]: {
    Venue: [
      { vendor: 'Banquet Hall / Farm House', priority: VENDOR_PRIORITIES.ESSENTIAL, notes: 'Book 6 months ahead' },
    ],
    Catering: [
      { vendor: 'Catering Service', priority: VENDOR_PRIORITIES.ESSENTIAL, notes: 'Confirm menu and headcount 1 month before' },
    ],
    Photography: [
      { vendor: 'Photographer', priority: VENDOR_PRIORITIES.ESSENTIAL, notes: 'Check portfolio and backup equipment' },
      { vendor: 'Videographer', priority: VENDOR_PRIORITIES.RECOMMENDED, notes: 'For highlight reel' },
    ],
    Decoration: [
      { vendor: 'Decoration Vendor', priority: VENDOR_PRIORITIES.ESSENTIAL, notes: 'Includes mandap, lighting, flowers' },
    ],
    Music: [
      { vendor: 'DJ / Band', priority: VENDOR_PRIORITIES.RECOMMENDED, notes: 'Book early for peak season' },
    ],
    Makeup: [
      { vendor: 'Bridal Makeup Artist', priority: VENDOR_PRIORITIES.ESSENTIAL, notes: 'Trial session recommended' },
    ],
    Logistics: [
      { vendor: 'Transportation', priority: VENDOR_PRIORITIES.OPTIONAL, notes: 'For guest pickups' },
    ],
  },
  [EVENT_TYPES.BIRTHDAY]: {
    Venue: [
      { vendor: 'Party Hall / Home', priority: VENDOR_PRIORITIES.ESSENTIAL, notes: 'Confirm capacity' },
    ],
    Catering: [
      { vendor: 'Caterer / Cloud Kitchen', priority: VENDOR_PRIORITIES.ESSENTIAL, notes: 'Include cake in order' },
    ],
    Decoration: [
      { vendor: 'Balloon / Theme Decorator', priority: VENDOR_PRIORITIES.RECOMMENDED, notes: 'Theme decoration adds wow factor' },
    ],
    Entertainment: [
      { vendor: 'Emcee / Performer', priority: VENDOR_PRIORITIES.OPTIONAL, notes: 'Great for kids parties' },
    ],
    Photography: [
      { vendor: 'Photographer', priority: VENDOR_PRIORITIES.RECOMMENDED, notes: 'Candid shots preferred' },
    ],
  },
  [EVENT_TYPES.COMMUNITY]: {
    Venue: [
      { vendor: 'Community Hall / Open Ground', priority: VENDOR_PRIORITIES.ESSENTIAL, notes: 'Check permit requirements' },
    ],
    Catering: [
      { vendor: 'Bulk Caterer', priority: VENDOR_PRIORITIES.ESSENTIAL, notes: 'Negotiate per-head rate' },
    ],
    Logistics: [
      { vendor: 'Stage & Sound', priority: VENDOR_PRIORITIES.ESSENTIAL, notes: 'PA system and seating arrangement' },
      { vendor: 'Volunteers', priority: VENDOR_PRIORITIES.ESSENTIAL, notes: 'Minimum 1 per 50 guests' },
    ],
    Printing: [
      { vendor: 'Banner / Flex Printing', priority: VENDOR_PRIORITIES.RECOMMENDED, notes: 'For branding and directions' },
    ],
  },
};

function getVendorChecklist(eventType) {
  if (!eventType || !Object.values(EVENT_TYPES).includes(eventType)) {
    throw new Error(`Invalid eventType: "${eventType}". Allowed: ${Object.values(EVENT_TYPES).join(', ')}`);
  }

  // Return a deep copy so caller cannot mutate internal template
  return JSON.parse(JSON.stringify(CHECKLIST_BY_TYPE[eventType]));
}

module.exports = {
  getVendorChecklist,
  VENDOR_PRIORITIES,
  EVENT_TYPES,
};

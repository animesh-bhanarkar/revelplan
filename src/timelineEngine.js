const { EVENT_TYPES } = require('./budgetEngine');

const PRIORITIES = Object.freeze({
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
});

const MILESTONES_BY_TYPE = {
  [EVENT_TYPES.WEDDING]: [
    { daysBeforeEvent: 180, task: 'Book venue', priority: PRIORITIES.HIGH },
    { daysBeforeEvent: 150, task: 'Finalize caterer', priority: PRIORITIES.HIGH },
    { daysBeforeEvent: 120, task: 'Send invitations', priority: PRIORITIES.HIGH },
    { daysBeforeEvent: 90, task: 'Book photographer', priority: PRIORITIES.HIGH },
    { daysBeforeEvent: 60, task: 'Confirm decoration vendor', priority: PRIORITIES.MEDIUM },
    { daysBeforeEvent: 30, task: 'Final headcount', priority: PRIORITIES.MEDIUM },
    { daysBeforeEvent: 14, task: 'Confirm all vendors', priority: PRIORITIES.HIGH },
    { daysBeforeEvent: 7, task: 'Final walkthrough', priority: PRIORITIES.MEDIUM },
    { daysBeforeEvent: 1, task: 'Prep day checklist', priority: PRIORITIES.LOW },
  ],
  [EVENT_TYPES.BIRTHDAY]: [
    { daysBeforeEvent: 30, task: 'Book venue', priority: PRIORITIES.HIGH },
    { daysBeforeEvent: 21, task: 'Send invitations', priority: PRIORITIES.HIGH },
    { daysBeforeEvent: 14, task: 'Confirm caterer', priority: PRIORITIES.HIGH },
    { daysBeforeEvent: 7, task: 'Order cake and decoration', priority: PRIORITIES.MEDIUM },
    { daysBeforeEvent: 3, task: 'Final headcount', priority: PRIORITIES.MEDIUM },
    { daysBeforeEvent: 1, task: 'Prep checklist', priority: PRIORITIES.LOW },
  ],
  [EVENT_TYPES.COMMUNITY]: [
    { daysBeforeEvent: 60, task: 'Reserve venue and permissions', priority: PRIORITIES.HIGH },
    { daysBeforeEvent: 45, task: 'Announce event', priority: PRIORITIES.HIGH },
    { daysBeforeEvent: 30, task: 'Confirm logistics', priority: PRIORITIES.MEDIUM },
    { daysBeforeEvent: 14, task: 'Confirm volunteers', priority: PRIORITIES.MEDIUM },
    { daysBeforeEvent: 7, task: 'Final headcount', priority: PRIORITIES.MEDIUM },
    { daysBeforeEvent: 1, task: 'Setup checklist', priority: PRIORITIES.LOW },
  ],
};

function generateTimeline({ eventType, eventDate }) {
  if (!eventType || !Object.values(EVENT_TYPES).includes(eventType)) {
    throw new Error(`Invalid eventType: "${eventType}". Allowed: ${Object.values(EVENT_TYPES).join(', ')}`);
  }

  if (!eventDate) {
    throw new Error('eventDate is required');
  }

  const parsedDate = eventDate instanceof Date ? new Date(eventDate.getTime()) : new Date(eventDate);
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid eventDate: "${eventDate}"`);
  }

  const now = new Date();
  if (parsedDate.getTime() < now.getTime()) {
    throw new Error(`eventDate cannot be in the past: ${parsedDate.toISOString()}`);
  }

  const templateMilestones = MILESTONES_BY_TYPE[eventType];

  const milestones = templateMilestones.map((milestone) => {
    const targetDate = new Date(parsedDate.getTime() - milestone.daysBeforeEvent * 24 * 60 * 60 * 1000);
    return {
      daysBeforeEvent: milestone.daysBeforeEvent,
      date: targetDate.toISOString().split('T')[0],
      task: milestone.task,
      priority: milestone.priority,
    };
  });

  // Sort milestones by date ascending (chronological order)
  milestones.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return milestones;
}

module.exports = {
  generateTimeline,
  EVENT_TYPES,
  PRIORITIES,
};

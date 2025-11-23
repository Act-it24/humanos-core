/**
 * Journal & Mood model helpers (v0.1)
 * Based on docs/29_journal_mood_logging_spec.md.
 */

/**
 * @typedef {Object} MoodSnapshot
 * @property {string} id
 * @property {string} timestamp // ISO datetime
 * @property {1|2|3|4|5} moodScore
 * @property {string} primaryEmotion
 * @property {string[]} [secondaryEmotions]
 * @property {"very_low"|"low"|"medium"|"high"|"very_high"} [energyLevel]
 * @property {"relaxed"|"neutral"|"tense"} [tensionLevel]
 * @property {string[]} [contextTags]
 * @property {string[]} [domainIds]
 * @property {string[]} [goalIds]
 * @property {string} [note]
 */

/**
 * @typedef {Object} JournalEntry
 * @property {string} id
 * @property {string} timestamp // ISO datetime
 * @property {string} date // ISO date YYYY-MM-DD
 * @property {"free"|"prompt"|"reflection"} kind
 * @property {string} [title]
 * @property {string} content
 * @property {string} [moodSnapshotId]
 * @property {string[]} [domainIds]
 * @property {string[]} [goalIds]
 * @property {string} [dailyPlanDate]
 * @property {string[]} [tags]
 * @property {string} createdAt
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} JournalDaySummary
 * @property {string} date
 * @property {MoodSnapshot} [mainMoodSnapshot]
 * @property {number} entryCount
 */

/**
 * @typedef {Object} JournalState
 * @property {MoodSnapshot[]} moodSnapshots
 * @property {JournalEntry[]} entries
 */

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const isNonEmptyArray = (value) => Array.isArray(value) && value.length > 0;

const normalizeStringArray = (maybeArray) => {
  if (!Array.isArray(maybeArray)) return undefined;
  const cleaned = maybeArray
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
  return cleaned.length > 0 ? cleaned : undefined;
};

const extractIsoDate = (timestamp) => {
  if (!timestamp) return "";
  try {
    return new Date(timestamp).toISOString().slice(0, 10);
  } catch (error) {
    return "";
  }
};

const sortByTimestampDesc = (items, accessor) => {
  return [...items].sort((a, b) => {
    const timeA = new Date(accessor(a)).getTime();
    const timeB = new Date(accessor(b)).getTime();
    return timeB - timeA;
  });
};

/**
 * Create a MoodSnapshot with generated id and timestamp.
 * @param {Object} params
 * @param {1|2|3|4|5} params.moodScore
 * @param {string} params.primaryEmotion
 * @param {string[]} [params.secondaryEmotions]
 * @param {"very_low"|"low"|"medium"|"high"|"very_high"} [params.energyLevel]
 * @param {"relaxed"|"neutral"|"tense"} [params.tensionLevel]
 * @param {string[]} [params.contextTags]
 * @param {string[]} [params.domainIds]
 * @param {string[]} [params.goalIds]
 * @param {string} [params.note]
 * @returns {MoodSnapshot}
 */
export function createMoodSnapshot(params) {
  const now = new Date().toISOString();
  return {
    id: generateId("mood"),
    timestamp: now,
    moodScore: params.moodScore,
    primaryEmotion: params.primaryEmotion,
    secondaryEmotions: normalizeStringArray(params.secondaryEmotions),
    energyLevel: params.energyLevel,
    tensionLevel: params.tensionLevel,
    contextTags: normalizeStringArray(params.contextTags),
    domainIds: normalizeStringArray(params.domainIds),
    goalIds: normalizeStringArray(params.goalIds),
    note: params.note?.trim() || undefined,
  };
}

/**
 * Create a JournalEntry with generated id, timestamps, and normalized fields.
 * @param {Object} params
 * @param {string} params.content
 * @param {"free"|"prompt"|"reflection"} [params.kind]
 * @param {string} [params.title]
 * @param {string} [params.moodSnapshotId]
 * @param {string[]} [params.domainIds]
 * @param {string[]} [params.goalIds]
 * @param {string} [params.dailyPlanDate]
 * @param {string[]} [params.tags]
 * @returns {JournalEntry}
 */
export function createJournalEntry(params) {
  const now = new Date().toISOString();
  const timestamp = params.timestamp || now;
  const date = extractIsoDate(timestamp);

  return {
    id: generateId("entry"),
    timestamp,
    date,
    kind: params.kind || "free",
    title: params.title?.trim() || undefined,
    content: params.content,
    moodSnapshotId: params.moodSnapshotId,
    domainIds: normalizeStringArray(params.domainIds),
    goalIds: normalizeStringArray(params.goalIds),
    dailyPlanDate: params.dailyPlanDate,
    tags: normalizeStringArray(params.tags) || [],
    createdAt: now,
    updatedAt: undefined,
  };
}

/**
 * Group mood snapshots and journal entries by ISO date.
 * Picks the latest snapshot per day as the main mood.
 * @param {JournalState} state
 * @returns {Object.<string, { mood?: MoodSnapshot; entries: JournalEntry[] }>}
 */
export function groupByDate(state) {
  const grouped = {};

  const snapshots = Array.isArray(state?.moodSnapshots) ? state.moodSnapshots : [];
  snapshots.forEach((snapshot) => {
    const date = extractIsoDate(snapshot.timestamp);
    if (!date) return;
    const existing = grouped[date]?.mood;
    const shouldReplace =
      !existing || new Date(snapshot.timestamp).getTime() > new Date(existing.timestamp).getTime();
    grouped[date] = grouped[date] || { entries: [] };
    if (shouldReplace) {
      grouped[date].mood = snapshot;
    }
  });

  const entries = Array.isArray(state?.entries) ? state.entries : [];
  entries.forEach((entry) => {
    const date = entry.date || extractIsoDate(entry.timestamp);
    if (!date) return;
    grouped[date] = grouped[date] || { entries: [] };
    grouped[date].entries.push(entry);
  });

  Object.keys(grouped).forEach((date) => {
    if (isNonEmptyArray(grouped[date].entries)) {
      grouped[date].entries = sortByTimestampDesc(grouped[date].entries, (entry) => entry.timestamp);
    } else {
      grouped[date].entries = [];
    }
  });

  return grouped;
}

/**
 * Build JournalDaySummary items sorted by date descending.
 * @param {JournalState} state
 * @returns {JournalDaySummary[]}
 */
export function getDaySummaries(state) {
  const grouped = groupByDate(state);
  return Object.entries(grouped)
    .map(([date, value]) => ({
      date,
      mainMoodSnapshot: value.mood,
      entryCount: (value.entries || []).length,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Return entries for a specific ISO date sorted by time descending.
 * @param {JournalState} state
 * @param {string} date ISO date YYYY-MM-DD
 * @returns {JournalEntry[]}
 */
export function getEntriesForDate(state, date) {
  if (!date) return [];
  const entries = Array.isArray(state?.entries) ? state.entries : [];
  const filtered = entries.filter((entry) => {
    const entryDate = entry.date || extractIsoDate(entry.timestamp);
    return entryDate === date;
  });
  return sortByTimestampDesc(filtered, (entry) => entry.timestamp);
}

/**
 * Return the main mood snapshot for a date (latest snapshot for that day).
 * @param {JournalState} state
 * @param {string} date ISO date YYYY-MM-DD
 * @returns {MoodSnapshot|undefined}
 */
export function getMainMoodForDate(state, date) {
  if (!date) return undefined;
  const grouped = groupByDate(state);
  return grouped[date]?.mood;
}


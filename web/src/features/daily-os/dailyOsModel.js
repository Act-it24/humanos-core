/**
 * Daily OS model helpers (v0.1)
 * Based on docs/24_daily_os_planning_spec.md.
 */

/**
 * @typedef {Object} FocusBlock
 * @property {string} id
 * @property {string} label
 * @property {"morning"|"afternoon"|"evening"|"flex"} segment
 * @property {string} [domainId]
 * @property {string} [goalId]
 * @property {string} [projectId]
 * @property {"light"|"medium"|"deep"} [intensity]
 * @property {"home"|"office"|"outside"|"mixed"} [locationType]
 * @property {string} [note]
 */

/**
 * @typedef {Object} DailyTask
 * @property {string} id
 * @property {string} title
 * @property {"manual"|"life_goal"|"life_project"|"maintenance"} [source]
 * @property {string} [domainId]
 * @property {string} [goalId]
 * @property {string} [projectId]
 * @property {"todo"|"in_progress"|"done"|"skipped"} status
 * @property {"focus_block"|"between"|"anytime"} [timeHint]
 */

/**
 * @typedef {Object} DailyPlan
 * @property {string} id
 * @property {string} date - ISO date YYYY-MM-DD
 * @property {string} [focusTitle]
 * @property {string} [energyNote]
 * @property {FocusBlock[]} focusBlocks
 * @property {DailyTask[]} tasks
 * @property {string} createdAt
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} WeeklyPlan
 * @property {string} id
 * @property {string} weekStartDate - ISO date for Monday
 * @property {DailyPlan[]} dailyPlans
 * @property {string[]} focusDomains
 * @property {string} [summaryNote]
 * @property {string} createdAt
 * @property {string} [updatedAt]
 */

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
const MS_IN_DAY = 24 * 60 * 60 * 1000;

const parseIsoDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map((part) => Number(part));
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  return new Date(Date.UTC(year, month - 1, day));
};

const formatIsoDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

/**
 * Get the Monday ISO date for the provided date.
 * @param {string} date ISO date string (YYYY-MM-DD)
 * @returns {string} ISO date for the week's Monday or empty string if invalid
 */
export function getWeekStartForDate(date) {
  const target = parseIsoDate(date);
  if (!target) return "";
  const dayOfWeek = target.getUTCDay(); // 0 = Sunday
  const daysFromMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(target.getTime() - daysFromMonday * MS_IN_DAY);
  return formatIsoDate(monday);
}

/**
 * Create an empty DailyPlan shell.
 * @param {string} date ISO date string
 * @returns {DailyPlan}
 */
export function createEmptyDailyPlan(date) {
  const now = new Date().toISOString();
  return {
    id: generateId("day"),
    date,
    focusTitle: undefined,
    energyNote: undefined,
    focusBlocks: [],
    tasks: [],
    createdAt: now,
    updatedAt: undefined,
  };
}

/**
 * Shallow merge updates into a DailyPlan clone.
 * @param {DailyPlan} plan
 * @param {Partial<DailyPlan>} updates
 * @returns {DailyPlan}
 */
export function cloneDailyPlanWithUpdates(plan, updates = {}) {
  return {
    ...plan,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * True when there is no focusTitle and both blocks and tasks are empty.
 * @param {DailyPlan|null|undefined} plan
 * @returns {boolean}
 */
export function isDailyPlanEmpty(plan) {
  if (!plan) return true;
  const hasFocus = typeof plan.focusTitle === "string" && plan.focusTitle.trim().length > 0;
  const hasBlocks = Array.isArray(plan.focusBlocks) && plan.focusBlocks.length > 0;
  const hasTasks = Array.isArray(plan.tasks) && plan.tasks.length > 0;
  return !(hasFocus || hasBlocks || hasTasks);
}

/**
 * Create a normalized DailyTask entry.
 * @param {Partial<DailyTask>} params
 * @returns {DailyTask}
 */
export function createDailyTask(params = {}) {
  return {
    id: params.id || generateId("task"),
    title: (params.title || "").trim(),
    source: params.source || "manual",
    domainId: params.domainId,
    goalId: params.goalId,
    projectId: params.projectId,
    status: params.status || "todo",
    timeHint: params.timeHint,
  };
}

/**
 * Build a WeeklyPlan from DailyPlans within the given week window.
 * @param {string} weekStartDate ISO date for the week's Monday
 * @param {DailyPlan[]} dailyPlans
 * @returns {WeeklyPlan}
 */
export function buildWeeklyPlanFromDailyPlans(weekStartDate, dailyPlans = []) {
  const startDate = parseIsoDate(weekStartDate);
  const resolvedWeekStart = startDate ? formatIsoDate(startDate) : getWeekStartForDate(weekStartDate);
  const safeStart = parseIsoDate(resolvedWeekStart);
  const endDate = safeStart ? new Date(safeStart.getTime() + 6 * MS_IN_DAY) : null;

  const filteredPlans = Array.isArray(dailyPlans)
    ? dailyPlans.filter((plan) => {
        const planDate = parseIsoDate(plan?.date);
        if (!planDate || !safeStart || !endDate) return false;
        return planDate >= safeStart && planDate <= endDate;
      })
    : [];

  const focusDomainSet = new Set();
  filteredPlans.forEach((plan) => {
    (plan.focusBlocks || []).forEach((block) => {
      if (block?.domainId) focusDomainSet.add(block.domainId);
    });
    (plan.tasks || []).forEach((task) => {
      if (task?.domainId) focusDomainSet.add(task.domainId);
    });
  });

  const now = new Date().toISOString();
  return {
    id: generateId("week"),
    weekStartDate: resolvedWeekStart,
    dailyPlans: filteredPlans,
    focusDomains: Array.from(focusDomainSet),
    summaryNote: undefined,
    createdAt: now,
    updatedAt: undefined,
  };
}

/**
 * Simple helper to clamp week calculations to a Monday start using any date input.
 * @param {string} date ISO date string
 * @returns {string} ISO date string for Monday
 */
export function normalizeToWeekStart(date) {
  return getWeekStartForDate(date);
}

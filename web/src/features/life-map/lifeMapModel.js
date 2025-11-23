/**
 * Life Map OS model helpers (v0.1)
 * Based on docs/27_life_map_onboarding_spec.md.
 */

/**
 * @typedef {Object} LifeDomain
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {number} [currentScore] // 1-10 snapshot
 * @property {string} [intention] // one-sentence direction
 * @property {string[]} [linkedValues] // Self OS value keys or labels
 * @property {"low"|"medium"|"high"} [priority]
 */

/**
 * @typedef {Object} LifeGoal
 * @property {string} id
 * @property {string} domainId
 * @property {string} title
 * @property {string} [description]
 * @property {"3_months"|"6_months"|"1_year"|"long_term"} [horizon]
 * @property {string[]} [linkedValues]
 * @property {"idea"|"active"|"paused"|"completed"} [status]
 */

/**
 * @typedef {Object} LifeProject
 * @property {string} id
 * @property {string} goalId
 * @property {string} title
 * @property {string} [description]
 * @property {string[]} [firstSteps] // up to 5 strings
 * @property {"idea"|"active"|"paused"|"completed"} [status]
 */

/**
 * @typedef {Object} LifeMap
 * @property {LifeDomain[]} domains
 * @property {LifeGoal[]} goals
 * @property {LifeProject[]} projects
 * @property {string} createdAt
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} LifeMapWizardState
 * @property {LifeDomain[]} domains
 * @property {LifeGoal[]} goals
 * @property {LifeProject[]} projects
 */

const DEFAULT_DOMAIN_SUGGESTIONS = [
  "Health & Energy",
  "Career & Money",
  "Creative Work",
  "Relationships & Family",
  "Learning & Growth",
  "Home & Environment",
  "Meaning & Impact",
  "Play & Joy",
];

const VALUE_DOMAIN_HINTS = [
  { keys: ["health_vitality"], domain: "Health & Energy" },
  { keys: ["love_connection"], domain: "Relationships & Family" },
  { keys: ["creativity", "freedom_autonomy"], domain: "Creative Work" },
  { keys: ["growth_learning", "mastery_excellence"], domain: "Learning & Growth" },
  { keys: ["security_stability", "recognition_status"], domain: "Career & Money" },
  { keys: ["contribution_impact"], domain: "Meaning & Impact" },
  { keys: ["play_joy", "adventure_exploration"], domain: "Play & Joy" },
  { keys: ["spirituality_meaning"], domain: "Spirituality & Meaning" },
];

const FLAG_DOMAIN_HINTS = [
  { keys: ["parent_caregiver", "elderly_care", "relationship_change"], domain: "Relationships & Family" },
  { keys: ["student", "big_exam_or_launch"], domain: "Learning & Growth" },
  { keys: ["freelancer", "business_owner", "employee", "career_change"], domain: "Career & Money" },
  { keys: ["chronic_health"], domain: "Health & Energy" },
  { keys: ["financial_pressure", "unstable_schedule"], domain: "Career & Money" },
];

const MAX_FIRST_STEPS = 5;

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * Create an empty LifeMap shell.
 * @returns {LifeMap}
 */
export function createEmptyLifeMap() {
  const now = new Date().toISOString();
  return {
    domains: [],
    goals: [],
    projects: [],
    createdAt: now,
    updatedAt: undefined,
  };
}

/**
 * True when there is no meaningful Life Map content.
 * @param {LifeMap|null|undefined} lifeMap
 * @returns {boolean}
 */
export function isLifeMapEmpty(lifeMap) {
  if (!lifeMap) return true;
  const hasDomains = Array.isArray(lifeMap.domains) && lifeMap.domains.length > 0;
  const hasGoals = Array.isArray(lifeMap.goals) && lifeMap.goals.length > 0;
  const hasProjects = Array.isArray(lifeMap.projects) && lifeMap.projects.length > 0;
  return !(hasDomains || hasGoals || hasProjects);
}

const clampScore = (value) => {
  if (!Number.isFinite(value)) return undefined;
  const safe = Math.max(1, Math.min(10, Math.round(value)));
  return safe;
};

const cleanString = (value) => {
  const trimmed = (value || "").trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const cleanValues = (values) => {
  if (!Array.isArray(values)) return undefined;
  const cleaned = values.map((val) => cleanString(val)).filter(Boolean);
  return cleaned.length ? cleaned : undefined;
};

const cleanDomain = (domain) => {
  const name = cleanString(domain?.name);
  if (!name) return null;
  const id = cleanString(domain?.id) || generateId("domain");
  return {
    id,
    name,
    description: cleanString(domain?.description),
    currentScore: clampScore(domain?.currentScore),
    intention: cleanString(domain?.intention),
    linkedValues: cleanValues(domain?.linkedValues),
    priority: domain?.priority || undefined,
  };
};

const cleanGoal = (goal, validDomainIds) => {
  const title = cleanString(goal?.title);
  const domainId = cleanString(goal?.domainId);
  if (!title || !domainId || !validDomainIds.has(domainId)) return null;
  const id = cleanString(goal?.id) || generateId("goal");
  return {
    id,
    domainId,
    title,
    description: cleanString(goal?.description),
    horizon: goal?.horizon || undefined,
    linkedValues: cleanValues(goal?.linkedValues),
    status: goal?.status || "idea",
  };
};

const cleanProject = (project, validGoalIds) => {
  const title = cleanString(project?.title);
  const goalId = cleanString(project?.goalId);
  if (!title || !goalId || !validGoalIds.has(goalId)) return null;
  const id = cleanString(project?.id) || generateId("project");
  const steps = Array.isArray(project?.firstSteps)
    ? project.firstSteps.map((step) => cleanString(step)).filter(Boolean).slice(0, MAX_FIRST_STEPS)
    : [];

  return {
    id,
    goalId,
    title,
    description: cleanString(project?.description),
    firstSteps: steps.length ? steps : undefined,
    status: project?.status || "idea",
  };
};

/**
 * Build a LifeMap from wizard state, preserving createdAt when editing.
 * @param {LifeMapWizardState} wizardState
 * @param {LifeMap|null} [existingLifeMap]
 * @returns {LifeMap}
 */
export function buildLifeMapFromWizardState(wizardState, existingLifeMap = null) {
  const now = new Date().toISOString();
  const domains = Array.isArray(wizardState?.domains) ? wizardState.domains.map((d) => cleanDomain(d)).filter(Boolean) : [];
  const domainIds = new Set(domains.map((domain) => domain.id));

  const goals = Array.isArray(wizardState?.goals)
    ? wizardState.goals.map((goal) => cleanGoal(goal, domainIds)).filter(Boolean)
    : [];
  const goalIds = new Set(goals.map((goal) => goal.id));

  const projects = Array.isArray(wizardState?.projects)
    ? wizardState.projects.map((project) => cleanProject(project, goalIds)).filter(Boolean)
    : [];

  return {
    domains,
    goals,
    projects,
    createdAt: existingLifeMap?.createdAt || now,
    updatedAt: existingLifeMap ? now : undefined,
  };
}

/**
 * Hydrate wizard-friendly state from an existing LifeMap.
 * @param {LifeMap|null} lifeMap
 * @returns {LifeMapWizardState}
 */
export function hydrateWizardStateFromLifeMap(lifeMap) {
  if (!lifeMap) {
    return { domains: [], goals: [], projects: [] };
  }
  return {
    domains: Array.isArray(lifeMap.domains) ? lifeMap.domains.map((domain) => ({ ...domain })) : [],
    goals: Array.isArray(lifeMap.goals) ? lifeMap.goals.map((goal) => ({ ...goal })) : [],
    projects: Array.isArray(lifeMap.projects) ? lifeMap.projects.map((project) => ({ ...project })) : [],
  };
}

/**
 * Suggest life domains using Self OS profile hints.
 * Falls back to generic suggestions when no profile is available.
 * @param {import("../self-os/selfOsModel").SelfOsProfile|null|undefined} selfOsProfile
 * @returns {string[]}
 */
export function suggestDomainsFromSelfOs(selfOsProfile) {
  if (!selfOsProfile) return [...DEFAULT_DOMAIN_SUGGESTIONS];

  const suggestions = [];
  const addSuggestion = (name) => {
    if (!name) return;
    if (!suggestions.includes(name)) {
      suggestions.push(name);
    }
  };

  const valueKeys = new Set(
    (selfOsProfile.values || [])
      .map((value) => value?.key || value?.label)
      .filter(Boolean)
  );
  const activeFlags = (selfOsProfile.flags || []).filter((flag) => flag?.isActive !== false);
  const flagKeys = new Set(activeFlags.map((flag) => flag?.key).filter(Boolean));

  VALUE_DOMAIN_HINTS.forEach((hint) => {
    const hasMatch = hint.keys.some((key) => valueKeys.has(key));
    if (hasMatch) addSuggestion(hint.domain);
  });

  FLAG_DOMAIN_HINTS.forEach((hint) => {
    const hasMatch = hint.keys.some((key) => flagKeys.has(key));
    if (hasMatch) addSuggestion(hint.domain);
  });

  if (flagKeys.has("moving")) {
    addSuggestion("Home & Environment");
  }
  if (flagKeys.has("big_exam_or_launch")) {
    addSuggestion("Execution & Launch Prep");
  }

  DEFAULT_DOMAIN_SUGGESTIONS.forEach((domain) => addSuggestion(domain));

  return suggestions;
}

export { DEFAULT_DOMAIN_SUGGESTIONS };

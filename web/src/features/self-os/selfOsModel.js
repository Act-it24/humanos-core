/**
 * Self OS Data Model (v0.2)
 * Matches docs/25_self_os_onboarding_spec.md section 3.
 */

/**
 * @typedef {Object} ValueItem
 * @property {string} key
 * @property {string} label
 * @property {string} [description]
 * @property {"core"|"supporting"} priorityBand
 * @property {number|null} [rank] // 1-5 only for core values
 */

/**
 * @typedef {Object} PersonalityDimension
 * @property {string} key
 * @property {string} labelLeft
 * @property {string} labelRight
 * @property {number} score // 0-100 slider position
 * @property {number} percentLeft // Derived: 100 - score
 * @property {number} percentRight // Derived: score
 * @property {string} [description]
 */

/**
 * @typedef {Object} FocusWindow
 * @property {string} label
 * @property {string} startTime
 * @property {string} endTime
 */

/**
 * @typedef {Object} EnergyProfile
 * @property {"morning"|"afternoon"|"evening"|"mixed"} chronotype
 * @property {FocusWindow[]} focusWindows
 * @property {{ score: number; labelLeft: string; labelRight: string }} socialEnergy
 */

/**
 * @typedef {"role"|"constraint"|"transition"|"other"} LifeFlagType
 */

/**
 * @typedef {Object} LifeFlag
 * @property {string} key
 * @property {string} label
 * @property {LifeFlagType} type
 * @property {string} [description]
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} SelfOsProfile
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {ValueItem[]} values
 * @property {PersonalityDimension[]} personality
 * @property {EnergyProfile} energy
 * @property {LifeFlag[]} flags
 * @property {string} notes
 */

// --- Value options ---

export const VALUE_OPTIONS = [
  { key: "creativity", label: "Creativity" },
  { key: "growth_learning", label: "Growth & Learning" },
  { key: "love_connection", label: "Love & Connection" },
  { key: "health_vitality", label: "Health & Vitality" },
  { key: "security_stability", label: "Security & Stability" },
  { key: "freedom_autonomy", label: "Freedom & Autonomy" },
  { key: "mastery_excellence", label: "Mastery & Excellence" },
  { key: "contribution_impact", label: "Contribution & Impact" },
  { key: "play_joy", label: "Play & Joy" },
  { key: "spirituality_meaning", label: "Spirituality & Meaning" },
  { key: "recognition_status", label: "Recognition & Status" },
  { key: "adventure_exploration", label: "Adventure & Exploration" },
];

export const MAX_SELECTED_VALUES = 7;
export const MIN_CORE_VALUES = 3;
export const MAX_CORE_VALUES = 5;

// --- Personality dimensions ---

export const PERSONALITY_DIMENSIONS = [
  {
    key: "introversion_extraversion",
    labelLeft: "Introversion",
    labelRight: "Extraversion",
    description: "How you recharge and where you get energy.",
  },
  {
    key: "planner_spontaneous",
    labelLeft: "Planner",
    labelRight: "Spontaneous",
    description: "Your preference for structure versus flexibility.",
  },
  {
    key: "detail_big_picture",
    labelLeft: "Detail-focused",
    labelRight: "Big-picture",
    description: "How you prefer to approach tasks and plans.",
  },
  {
    key: "cautious_risk_taking",
    labelLeft: "Cautious",
    labelRight: "Risk-taking",
    description: "How you approach new opportunities and uncertainty.",
  },
  {
    key: "emotion_logic",
    labelLeft: "Emotion-driven",
    labelRight: "Logic-driven",
    description: "What tends to guide your decisions in everyday life.",
  },
];

// --- Energy options ---

export const CHRONOTYPE_OPTIONS = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "mixed", label: "Mixed / It depends" },
];

export const DEFAULT_SOCIAL_ENERGY_LABELS = {
  labelLeft: "Recharge alone",
  labelRight: "Recharge with people",
};

// --- Life flags ---

export const LIFE_FLAG_OPTIONS = {
  roles: [
    { key: "parent_caregiver", label: "Parent / caregiver to children", type: "role" },
    { key: "elderly_care", label: "Caring for an elderly relative", type: "role" },
    { key: "student", label: "Student", type: "role" },
    { key: "employee", label: "Employee", type: "role" },
    { key: "freelancer", label: "Freelancer / self-employed", type: "role" },
    { key: "business_owner", label: "Business owner", type: "role" },
  ],
  constraints: [
    { key: "chronic_health", label: "Managing a chronic health condition", type: "constraint" },
    { key: "financial_pressure", label: "Financial pressure / debt", type: "constraint" },
    { key: "unstable_schedule", label: "Unstable work schedule", type: "constraint" },
    { key: "limited_privacy", label: "Limited privacy / shared living space", type: "constraint" },
  ],
  transitions: [
    { key: "career_change", label: "Recently changed jobs or careers", type: "transition" },
    { key: "moving", label: "Moving city or country", type: "transition" },
    { key: "relationship_change", label: "Started or ended a major relationship", type: "transition" },
    { key: "big_exam_or_launch", label: "Preparing for a big exam / project / launch", type: "transition" },
  ],
  other: [
    { key: "other_context", label: "Other significant context", type: "other" },
  ],
};

export const LIFE_FLAG_LIST = Object.values(LIFE_FLAG_OPTIONS).flat();

// --- Helper builders ---

/**
 * Clamp a slider score and derive percentages.
 * @param {number} score
 * @returns {{ score: number; percentLeft: number; percentRight: number }}
 */
export function calculatePercents(score) {
  const safeScore = Math.min(100, Math.max(0, Number.isFinite(score) ? score : 0));
  return {
    score: safeScore,
    percentLeft: 100 - safeScore,
    percentRight: safeScore,
  };
}

/**
 * Build a PersonalityDimension from a definition and slider score.
 * @param {PersonalityDimension} definition
 * @param {number} score
 * @returns {PersonalityDimension}
 */
export function createPersonalityDimension(definition, score = 50) {
  const { score: finalScore, percentLeft, percentRight } = calculatePercents(score);
  return {
    key: definition.key,
    labelLeft: definition.labelLeft,
    labelRight: definition.labelRight,
    description: definition.description,
    score: finalScore,
    percentLeft,
    percentRight,
  };
}

/**
 * Default personality profile with balanced sliders.
 * @returns {PersonalityDimension[]}
 */
export function createDefaultPersonalityProfile() {
  return PERSONALITY_DIMENSIONS.map((dim) => createPersonalityDimension(dim, 50));
}

/**
 * Build an EnergyProfile with sensible defaults.
 * @param {Object} [overrides]
 * @param {"morning"|"afternoon"|"evening"|"mixed"} [overrides.chronotype]
 * @param {FocusWindow[]} [overrides.focusWindows]
 * @param {number} [overrides.socialEnergyScore]
 * @returns {EnergyProfile}
 */
export function createEnergyProfile(overrides = {}) {
  const socialEnergyScore = Number.isFinite(overrides.socialEnergyScore)
    ? overrides.socialEnergyScore
    : 50;
  const socialEnergyPercents = calculatePercents(socialEnergyScore);

  return {
    chronotype: overrides.chronotype || "mixed",
    focusWindows: Array.isArray(overrides.focusWindows) ? [...overrides.focusWindows] : [],
    socialEnergy: {
      score: socialEnergyPercents.score,
      labelLeft: DEFAULT_SOCIAL_ENERGY_LABELS.labelLeft,
      labelRight: DEFAULT_SOCIAL_ENERGY_LABELS.labelRight,
    },
  };
}

/**
 * Create an empty Self OS profile with defaults.
 * @returns {SelfOsProfile}
 */
export function createEmptySelfOsProfile() {
  const now = new Date().toISOString();
  return {
    createdAt: now,
    updatedAt: now,
    values: [],
    personality: createDefaultPersonalityProfile(),
    energy: createEnergyProfile(),
    flags: [],
    notes: "",
  };
}

/**
 * Return true if profile has no meaningful data (only defaults/empty).
 * @param {SelfOsProfile|null|undefined} profile
 * @returns {boolean}
 */
export function isProfileEmpty(profile) {
  if (!profile) return true;
  const hasValues = Array.isArray(profile.values) && profile.values.length > 0;
  const hasFlags = Array.isArray(profile.flags) && profile.flags.some((flag) => flag?.isActive);
  const hasNotes = typeof profile.notes === "string" && profile.notes.trim().length > 0;
  const hasFocusWindows =
    profile.energy && Array.isArray(profile.energy.focusWindows) && profile.energy.focusWindows.length > 0;
  const personalityHasSignal =
    Array.isArray(profile.personality) &&
    profile.personality.some((dim) => Number.isFinite(dim?.score) && dim.score !== 50);
  const energyHasSignal =
    profile.energy &&
    ((profile.energy.chronotype && profile.energy.chronotype !== "mixed") ||
      (profile.energy.socialEnergy && profile.energy.socialEnergy.score !== 50));

  return !(hasValues || hasFlags || hasNotes || hasFocusWindows || personalityHasSignal || energyHasSignal);
}

/**
 * Build ValueItems from selections and rankings.
 * @param {string[]} selectedKeys
 * @param {string[]} coreKeys
 * @param {Record<string, number>} rankMap
 * @returns {ValueItem[]}
 */
export function buildValuesFromSelections(selectedKeys = [], coreKeys = [], rankMap = {}) {
  const selectedSet = new Set(selectedKeys);
  const coreSet = new Set(coreKeys);
  const optionLookup = VALUE_OPTIONS.reduce((acc, opt) => {
    acc[opt.key] = opt;
    return acc;
  }, {});

  return Array.from(selectedSet).map((key) => {
    const option = optionLookup[key] || { key, label: key };
    const rank = Number.isFinite(rankMap[key]) ? Number(rankMap[key]) : null;
    const isCore = coreSet.has(key);
    return {
      key: option.key,
      label: option.label,
      description: option.description,
      priorityBand: isCore ? "core" : "supporting",
      rank: isCore ? rank : null,
    };
  });
}

/**
 * Build personality dimensions from raw slider scores.
 * @param {Record<string, number>} scoreMap
 * @returns {PersonalityDimension[]}
 */
export function buildPersonalityFromScores(scoreMap = {}) {
  const scores = scoreMap || {};
  return PERSONALITY_DIMENSIONS.map((dim) =>
    createPersonalityDimension(dim, Number.isFinite(scores[dim.key]) ? scores[dim.key] : 50)
  );
}

/**
 * Build a LifeFlag array from selected flag keys.
 * @param {string[]} flagKeys
 * @returns {LifeFlag[]}
 */
export function buildFlagsFromKeys(flagKeys = []) {
  const selectedSet = new Set(flagKeys);
  const optionLookup = LIFE_FLAG_LIST.reduce((acc, flag) => {
    acc[flag.key] = flag;
    return acc;
  }, {});

  return Array.from(selectedSet).map((key) => {
    const option = optionLookup[key] || { key, label: key, type: "other" };
    return {
      key: option.key,
      label: option.label,
      type: option.type,
      description: option.description,
      isActive: true,
    };
  });
}

/**
 * Normalize focus windows (max 3, all fields required to keep entry).
 * @param {FocusWindow[]} focusWindows
 * @returns {FocusWindow[]}
 */
export function normalizeFocusWindows(focusWindows = []) {
  if (!Array.isArray(focusWindows)) return [];
  const cleaned = focusWindows
    .map((window) => ({
      label: (window.label || "").trim(),
      startTime: (window.startTime || "").trim(),
      endTime: (window.endTime || "").trim(),
    }))
    .filter((window) => window.label && window.startTime && window.endTime);

  return cleaned.slice(0, 3);
}

/**
 * Build a SelfOsProfile from wizard form data.
 * @param {Object} formData
 * @param {string[]} formData.selectedValueKeys
 * @param {string[]} formData.coreValueKeys
 * @param {Record<string, number>} formData.coreRanks
 * @param {Record<string, number>} formData.personalityScores
 * @param {"morning"|"afternoon"|"evening"|"mixed"} formData.chronotype
 * @param {FocusWindow[]} formData.focusWindows
 * @param {number} formData.socialEnergyScore
 * @param {string[]} formData.selectedFlagKeys
 * @param {string} formData.notes
 * @param {SelfOsProfile|null} [previousProfile]
 * @returns {SelfOsProfile}
 */
export function buildProfileFromWizardData(formData, previousProfile = null) {
  const now = new Date().toISOString();
  const values = buildValuesFromSelections(
    formData.selectedValueKeys,
    formData.coreValueKeys,
    formData.coreRanks
  );
  const personality = buildPersonalityFromScores(formData.personalityScores);
  const focusWindows = normalizeFocusWindows(formData.focusWindows);
  const energy = createEnergyProfile({
    chronotype: formData.chronotype || "mixed",
    focusWindows,
    socialEnergyScore: formData.socialEnergyScore,
  });
  const flags = buildFlagsFromKeys(formData.selectedFlagKeys);

  return {
    createdAt: previousProfile?.createdAt || formData.createdAt || now,
    updatedAt: now,
    values,
    personality,
    energy,
    flags,
    notes: formData.notes || "",
  };
}

/**
 * Convert a stored profile back into wizard-friendly state.
 * @param {SelfOsProfile|null} profile
 * @returns {Object}
 */
export function profileToWizardState(profile) {
  if (!profile) {
    return {
      createdAt: null,
      selectedValueKeys: [],
      coreValueKeys: [],
      coreRanks: {},
      personalityScores: {},
      chronotype: "mixed",
      focusWindows: [],
      socialEnergyScore: 50,
      selectedFlagKeys: [],
      notes: "",
    };
  }

  const selectedValueKeys = (profile.values || []).map((v) => v.key);
  const coreValueKeys = (profile.values || [])
    .filter((v) => v.priorityBand === "core")
    .map((v) => v.key);
  const coreRanks = (profile.values || []).reduce((acc, value) => {
    if (value.priorityBand === "core" && Number.isFinite(value.rank)) {
      acc[value.key] = value.rank;
    }
    return acc;
  }, {});

  const personalityScores = (profile.personality || []).reduce((acc, dim) => {
    if (dim && Number.isFinite(dim.score)) {
      acc[dim.key] = dim.score;
    }
    return acc;
  }, {});

  const chronotype = profile.energy?.chronotype || "mixed";
  const focusWindows = Array.isArray(profile.energy?.focusWindows)
    ? profile.energy.focusWindows
    : [];
  const socialEnergyScore =
    profile.energy?.socialEnergy && Number.isFinite(profile.energy.socialEnergy.score)
      ? profile.energy.socialEnergy.score
      : 50;

  const selectedFlagKeys = (profile.flags || [])
    .filter((flag) => flag?.isActive)
    .map((flag) => flag.key);

  return {
    createdAt: profile.createdAt || null,
    selectedValueKeys,
    coreValueKeys,
    coreRanks,
    personalityScores,
    chronotype,
    focusWindows,
    socialEnergyScore,
    selectedFlagKeys,
    notes: profile.notes || "",
  };
}

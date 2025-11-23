/**
 * Self OS Data Model
 * 
 * Defines the data structures and helper functions for the Self OS profile.
 * Based on docs/25_self_os_onboarding_spec.md
 */

/**
 * @typedef {Object} SelfOsValue
 * @property {string} id - Unique identifier (e.g., "creativity", "security")
 * @property {string} label - Human-readable label (e.g., "Creativity")
 * @property {string} [description] - Optional user-written description
 * @property {number} rank - Priority rank (1-5, where 1 = most important)
 */

/**
 * @typedef {Object} SelfOsTrait
 * @property {string} id - Unique identifier (e.g., "introversion_extraversion")
 * @property {string} label - Human-readable label (e.g., "Introversion vs Extraversion")
 * @property {string} dimension - Always "personality"
 * @property {"low"|"medium"|"high"} value - Simplified trait value
 * @property {string} [notes] - Optional user notes
 */

/**
 * @typedef {Object} SelfOsEnergyRhythm
 * @property {string} id - Unique identifier (e.g., "chronotype", "social_energy")
 * @property {string} label - Human-readable label (e.g., "Chronotype")
 * @property {string} value - Selected value (e.g., "morning", "evening", "balanced")
 * @property {string} [notes] - Optional user notes
 */

/**
 * @typedef {Object} SelfOsFlag
 * @property {string} id - Unique identifier (e.g., "parent", "caregiver")
 * @property {string} text - User-facing text
 * @property {"support"|"risk"|"identity"} type - Flag category
 * @property {boolean} active - Whether the flag is currently active
 */

/**
 * @typedef {Object} SelfOsProfile
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 * @property {SelfOsValue[]} values - Array of core values
 * @property {SelfOsTrait[]} traits - Array of personality traits
 * @property {SelfOsEnergyRhythm[]} energy - Array of energy rhythms
 * @property {SelfOsFlag[]} flags - Array of life context flags
 * @property {string} [notes] - Optional free text summary
 */

// Predefined option lists

/**
 * Available core values for selection
 */
export const PREDEFINED_VALUES = [
  { id: "growth", label: "Growth" },
  { id: "creativity", label: "Creativity" },
  { id: "security", label: "Security" },
  { id: "health", label: "Health" },
  { id: "love_connection", label: "Love & Connection" },
  { id: "freedom", label: "Freedom" },
  { id: "mastery", label: "Mastery" },
  { id: "autonomy", label: "Autonomy" },
];

/**
 * Personality trait dimensions
 */
export const PREDEFINED_TRAITS = [
  {
    id: "introversion_extraversion",
    label: "Introversion ↔ Extraversion",
    description: "How you recharge and where you get energy",
  },
  {
    id: "planner_spontaneous",
    label: "Planner ↔ Spontaneous",
    description: "Your preference for structure vs flexibility",
  },
  {
    id: "detail_big_picture",
    label: "Detail-focused ↔ Big-picture",
    description: "How you approach tasks and planning",
  },
];

/**
 * Energy rhythm options
 */
export const CHRONOTYPE_OPTIONS = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
  { id: "varies", label: "It changes a lot" },
];

export const SOCIAL_ENERGY_OPTIONS = [
  { id: "mostly_alone", label: "Mostly alone" },
  { id: "mostly_people", label: "Mostly with people" },
  { id: "mixed", label: "A mix of both" },
];

/**
 * Life context flags
 */
export const PREDEFINED_FLAGS = [
  // Support / Identity
  {
    id: "parent",
    text: "I'm a parent / caregiver",
    type: "identity",
  },
  {
    id: "student",
    text: "I'm a student",
    type: "identity",
  },
  {
    id: "working_fulltime",
    text: "I'm working full-time",
    type: "identity",
  },
  {
    id: "between_jobs",
    text: "I'm between jobs",
    type: "identity",
  },
  // Risk / Stress
  {
    id: "recovering_burnout",
    text: "I'm recovering from burnout",
    type: "risk",
  },
  {
    id: "high_pressure",
    text: "I'm under high pressure right now",
    type: "risk",
  },
  {
    id: "caring_health_issues",
    text: "I'm caring for someone with health issues",
    type: "risk",
  },
];

// Helper functions

/**
 * Creates an empty Self OS profile
 * @returns {SelfOsProfile}
 */
export function createEmptySelfOsProfile() {
  const now = new Date().toISOString();
  return {
    createdAt: now,
    updatedAt: now,
    values: [],
    traits: [],
    energy: [],
    flags: [],
    notes: "",
  };
}

/**
 * Checks if a profile is empty (has no meaningful data)
 * @param {SelfOsProfile|null|undefined} profile
 * @returns {boolean}
 */
export function isProfileEmpty(profile) {
  if (!profile) return true;
  return (
    profile.values.length === 0 &&
    profile.traits.length === 0 &&
    profile.energy.length === 0 &&
    profile.flags.length === 0
  );
}

/**
 * Creates a profile from wizard form data
 * @param {Object} formData - Collected form data from wizard
 * @returns {SelfOsProfile}
 */
export function buildProfileFromFormData(formData) {
  const now = new Date().toISOString();
  
  return {
    createdAt: formData.createdAt || now,
    updatedAt: now,
    values: formData.values || [],
    traits: formData.traits || [],
    energy: formData.energy || [],
    flags: formData.flags || [],
    notes: formData.notes || "",
  };
}


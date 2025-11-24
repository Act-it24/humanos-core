import { bigFiveItems } from "./selfImageItems";

const TRAIT_META = {
  openness: { name: "Openness" },
  conscientiousness: { name: "Conscientiousness" },
  extraversion: { name: "Extraversion" },
  agreeableness: { name: "Agreeableness" },
  neuroticism: { name: "Neuroticism" },
};

const TRAIT_INSIGHTS = {
  openness: {
    high: "You thrive on novelty and learning; variety keeps you engaged.",
    medium: "You balance curiosity with practicality, mixing familiar and new ideas.",
    low: "You prefer familiar approaches and clear guardrails before diving in.",
  },
  conscientiousness: {
    high: "Structure and follow-through keep you steady; detailed plans usually help.",
    medium: "You can shift between structure and spontaneity depending on stakes.",
    low: "Light structure and reminders can protect you from overwhelm or loose ends.",
  },
  extraversion: {
    high: "Social settings energize you; collaborative work can lift your momentum.",
    medium: "You recharge in both solo and social spaces; pacing matters most.",
    low: "You likely need solo time to refuel; too many back-to-back meetings can drain you.",
  },
  agreeableness: {
    high: "You tend to consider others' needs; collaborative language will resonate.",
    medium: "You can advocate for yourself while keeping relationships steady.",
    low: "Direct language works for you; it's helpful to add a quick check-in for others' needs.",
  },
  neuroticism: {
    high: "Stress or uncertainty can hit hard; buffers and decompression time are important.",
    medium: "You notice stress signals but can usually steady yourself with simple routines.",
    low: "You recover quickly from bumps; keep an eye out for subtle stress that builds slowly.",
  },
};

const TRAIT_ORDER = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"];

function clampLikert(value) {
  if (!Number.isFinite(value)) return null;
  return Math.min(5, Math.max(1, Math.round(value)));
}

function normalizeLikert(value, reverse = false) {
  const clamped = clampLikert(value);
  if (clamped === null) return null;
  const directed = reverse ? 6 - clamped : clamped;
  return Math.round(((directed - 1) / 4) * 100);
}

function toBand(score) {
  if (score < 34) return "low";
  if (score < 67) return "medium";
  return "high";
}

function traitBandLabel(trait, band) {
  const name = TRAIT_META[trait]?.name || trait;
  if (trait === "neuroticism") {
    if (band === "low") return "Low neuroticism (steadier mood)";
    if (band === "high") return "Higher neuroticism (stress-sensitive)";
  }
  const bandLabel = band.charAt(0).toUpperCase() + band.slice(1);
  return `${bandLabel} ${name}`;
}

function buildInsights(traits) {
  return TRAIT_ORDER.flatMap((trait) => {
    const band = traits[trait]?.band;
    if (!band) return [];
    const insight = TRAIT_INSIGHTS[trait]?.[band];
    return insight ? [insight] : [];
  });
}

/**
 * Score Big Five responses into normalized trait scores and insights.
 * @param {Record<string, number>} responses
 * @param {Array<{id: string; trait: string; reverse?: boolean}>} items
 */
export function scoreBigFive(responses = {}, items = bigFiveItems) {
  const traitBuckets = {
    openness: { total: 0, count: 0 },
    conscientiousness: { total: 0, count: 0 },
    extraversion: { total: 0, count: 0 },
    agreeableness: { total: 0, count: 0 },
    neuroticism: { total: 0, count: 0 },
  };

  const rawScores = {};

  items.forEach((item) => {
    const raw = clampLikert(responses[item.id]);
    if (raw === null) return;
    rawScores[item.id] = raw;
    const normalized = normalizeLikert(raw, item.reverse);
    if (!traitBuckets[item.trait]) return;
    traitBuckets[item.trait].total += normalized;
    traitBuckets[item.trait].count += 1;
  });

  const traits = {};
  TRAIT_ORDER.forEach((trait) => {
    const bucket = traitBuckets[trait];
    const average = bucket.count > 0 ? Math.round(bucket.total / bucket.count) : 50;
    const band = toBand(average);
    traits[trait] = {
      score: average,
      band,
      label: traitBandLabel(trait, band),
    };
  });

  const primaryLabels = TRAIT_ORDER.map((trait) => traits[trait].label);
  const insights = buildInsights(traits);

  return { traits, primaryLabels, insights, rawScores };
}

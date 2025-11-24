import React, { useMemo, useState } from "react";
import { Button, Section } from "../../components";
import { eqItems } from "./selfImageItems";

const EQ_OPTIONS = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
];

const DIMENSION_LABELS = {
  selfAwareness: "Self-awareness",
  selfRegulation: "Self-regulation",
  motivation: "Motivation",
  empathy: "Empathy",
  socialSkills: "Social skills",
};

function chunk(items, size) {
  const groups = [];
  for (let i = 0; i < items.length; i += size) groups.push(items.slice(i, i + size));
  return groups;
}

function clampLikert(value) {
  if (!Number.isFinite(value)) return null;
  return Math.min(5, Math.max(1, Math.round(value)));
}

function normalize(value, reverse = false) {
  const clamped = clampLikert(value);
  if (clamped === null) return null;
  const directed = reverse ? 6 - clamped : clamped;
  return Math.round(((directed - 1) / 4) * 100);
}

function scoreEq(responses = {}) {
  const buckets = {
    selfAwareness: { total: 0, count: 0 },
    selfRegulation: { total: 0, count: 0 },
    motivation: { total: 0, count: 0 },
    empathy: { total: 0, count: 0 },
    socialSkills: { total: 0, count: 0 },
  };
  const rawScores = {};

  eqItems.forEach((item) => {
    const raw = clampLikert(responses[item.id]);
    if (raw === null) return;
    rawScores[item.id] = raw;
    const norm = normalize(raw, item.reverse);
    buckets[item.dimension].total += norm;
    buckets[item.dimension].count += 1;
  });

  const dimensions = Object.keys(buckets).reduce((acc, key) => {
    const bucket = buckets[key];
    acc[key] = bucket.count ? Math.round(bucket.total / bucket.count) : 50;
    return acc;
  }, {});

  const ranked = Object.entries(dimensions).sort((a, b) => b[1] - a[1]);
  const top = ranked[0];
  const low = ranked[ranked.length - 1];

  const insights = [];
  if (top) {
    insights.push(
      `Strongest signal: ${DIMENSION_LABELS[top[0]]}. Lean into it when collaborating or making decisions.`
    );
  }
  if (low) {
    insights.push(
      `Growth area: ${DIMENSION_LABELS[low[0]]}. Small, repeatable check-ins here can lift overall EQ.`
    );
  }
  insights.push("Prototype reading: use these signals as gentle hints, not fixed labels.");

  return { dimensions, insights, rawScores };
}

/**
 * @param {Object} props
 * @param {import("./selfOsModel").EmotionalIntelligenceAssessment|null} props.initialResult
 * @param {() => void} props.onCancel
 * @param {(result: import("./selfOsModel").EmotionalIntelligenceAssessment) => void} props.onSave
 * @param {boolean} [props.startAtSummary]
 */
export default function EmotionalIntelligenceWizard({
  initialResult,
  onCancel,
  onSave,
  startAtSummary = false,
}) {
  const groups = useMemo(() => chunk(eqItems, 5), []);
  const summaryStep = groups.length + 1;
  const [step, setStep] = useState(startAtSummary ? summaryStep : 0);
  const [responses, setResponses] = useState(() => ({ ...(initialResult?.rawScores || {}) }));
  const [message, setMessage] = useState("");

  const handleSelect = (id, value) => {
    setResponses({ ...responses, [id]: value });
    setMessage("");
  };

  const nextFromQuestions = () => {
    const currentGroup = groups[step - 1] || [];
    const missing = currentGroup.filter((item) => !responses[item.id]);
    if (missing.length > 0) {
      setMessage("Please answer each statement before continuing.");
      return;
    }
    setStep(step + 1);
  };

  const handleSave = () => {
    const scoring = scoreEq(responses);
    const now = new Date().toISOString();
    const result = {
      version: "eq_v1",
      takenAt: initialResult?.takenAt || now,
      updatedAt: initialResult ? now : undefined,
      dimensions: scoring.dimensions,
      insights: scoring.insights,
      visibility: initialResult?.visibility || "private",
      isArchived: false,
      rawScores: scoring.rawScores,
    };
    onSave(result);
  };

  if (step === 0) {
    return (
      <div>
        <Section title="Emotional Intelligence (prototype)">
          <p style={{ color: "#cbd5e1", lineHeight: 1.6, marginBottom: "1rem" }}>
            A quick look at self-awareness, regulation, motivation, empathy, and social skills. Results are
            reflective lenses, not scores to chase.
          </p>
          <p style={{ color: "#94a3b8", marginBottom: "1.25rem" }}>Takes about 3 minutes.</p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button variant="secondary" onClick={onCancel}>
              Not now
            </Button>
            <Button variant="primary" onClick={() => setStep(1)}>
              Start
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  if (step > 0 && step <= groups.length) {
    const group = groups[step - 1];
    return (
      <div>
        <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
          Step {step} of {groups.length}
        </div>
        <Section title="Daily-life statements">
          {message && <div style={{ color: "#fbbf24", marginBottom: "0.75rem" }}>{message}</div>}
          <div style={{ display: "grid", gap: "0.85rem" }}>
            {group.map((item) => {
              const current = responses[item.id] || 0;
              return (
                <div
                  key={item.id}
                  style={{
                    padding: "0.95rem",
                    background: "rgba(15,23,42,0.6)",
                    borderRadius: "0.85rem",
                    border: "1px solid rgba(148,163,184,0.35)",
                  }}
                >
                  <div style={{ color: "#e5e7eb", marginBottom: "0.65rem" }}>{item.text}</div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {EQ_OPTIONS.map((option) => {
                      const isSelected = option.value === current;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleSelect(item.id, option.value)}
                          style={{
                            padding: "0.45rem 0.65rem",
                            borderRadius: "0.55rem",
                            border: isSelected
                              ? "2px solid rgba(96,165,250,0.9)"
                              : "1px solid rgba(148,163,184,0.35)",
                            background: isSelected ? "rgba(59,130,246,0.16)" : "rgba(15,23,42,0.65)",
                            color: "#e5e7eb",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                          }}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "0.75rem",
              marginTop: "1.25rem",
            }}
          >
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              Back
            </Button>
            <Button variant="primary" onClick={nextFromQuestions}>
              {step === groups.length ? "Review summary" : "Next"}
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  const scoring = scoreEq(responses);

  return (
    <div>
      <Section title="Summary">
        <p style={{ color: "#cbd5e1", marginBottom: "1rem" }}>
          Prototype snapshot. Use it to notice strengths and where you might want gentle practice.
        </p>

        <div style={{ display: "grid", gap: "0.85rem", marginBottom: "1rem" }}>
          {Object.entries(scoring.dimensions).map(([key, score]) => (
            <div
              key={key}
              style={{
                padding: "0.85rem",
                background: "rgba(15,23,42,0.6)",
                borderRadius: "0.8rem",
                border: "1px solid rgba(148,163,184,0.35)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#e5e7eb",
                  marginBottom: "0.35rem",
                }}
              >
                <span>{DIMENSION_LABELS[key]}</span>
                <span style={{ color: "#94a3b8" }}>{score} / 100</span>
              </div>
              <div
                style={{
                  height: "10px",
                  background: "rgba(15,23,42,0.75)",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${score}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, rgba(59,130,246,0.5), rgba(34,197,94,0.6))",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "0.85rem",
            background: "rgba(15,23,42,0.55)",
            borderRadius: "0.8rem",
            border: "1px solid rgba(148,163,184,0.25)",
            marginBottom: "1rem",
          }}
        >
          <div style={{ color: "#e5e7eb", fontWeight: 600, marginBottom: "0.4rem" }}>Insights</div>
          <ul style={{ paddingLeft: "1.1rem", color: "#cbd5e1", lineHeight: 1.6 }}>
            {scoring.insights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
          <Button variant="secondary" onClick={() => setStep(groups.length)}>
            Back
          </Button>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save prototype result
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

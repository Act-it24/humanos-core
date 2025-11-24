import React, { useMemo, useState } from "react";
import { Button, Section } from "../../components";
import { depressionItems } from "./selfImageItems";

const LIKERT_OPTIONS = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "Several days" },
  { value: 3, label: "More than half the days" },
  { value: 4, label: "Most days" },
  { value: 5, label: "Nearly every day" },
];

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

function toBand(score) {
  if (score < 25) return "none";
  if (score < 50) return "mild";
  if (score < 75) return "moderate";
  return "severe";
}

function scoreDepression(responses = {}) {
  const rawScores = {};
  let total = 0;
  let count = 0;

  depressionItems.forEach((item) => {
    const raw = clampLikert(responses[item.id]);
    if (raw === null) return;
    rawScores[item.id] = raw;
    const norm = normalize(raw, item.reverse);
    total += norm;
    count += 1;
  });

  const severityScore = count ? Math.round(total / count) : 0;
  const severityBand = toBand(severityScore);
  const crisisFlag = severityScore >= 80;

  const insights = [];
  insights.push(
    `Current signal: ${severityBand === "none" ? "no notable depressive load" : `${severityBand} depressive load`} (not a diagnosis).`
  );
  if (severityBand === "moderate" || severityBand === "severe") {
    insights.push("Consider sharing how you're feeling with a trusted person or professional support.");
  } else {
    insights.push("Keep gentle routines and rest on the calendar; check in again if things shift.");
  }
  if (crisisFlag) {
    insights.push("If you feel unsafe or stuck, please reach out to local support or a helpline.");
  }

  return { severityScore, severityBand, crisisFlag, insights, rawScores };
}

const BAND_DESCRIPTIONS = {
  none: "No notable depressive signal right now.",
  mild: "Some weight or flatness; pace yourself and keep basics steady.",
  moderate: "Noticeable weight; lightening the load and seeking support can help.",
  severe: "High load; prioritize safety, support, and rest.",
};

/**
 * @param {Object} props
 * @param {import("./selfOsModel").DepressionScreenAssessment|null} props.initialResult
 * @param {() => void} props.onCancel
 * @param {(result: import("./selfOsModel").DepressionScreenAssessment) => void} props.onSave
 * @param {boolean} [props.startAtSummary]
 */
export default function ClinicalScreensWizard({
  initialResult,
  onCancel,
  onSave,
  startAtSummary = false,
}) {
  const groups = useMemo(() => chunk(depressionItems, 4), []);
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
    const scoring = scoreDepression(responses);
    const now = new Date().toISOString();
    const result = {
      version: "dep_v1",
      takenAt: initialResult?.takenAt || now,
      updatedAt: initialResult ? now : undefined,
      severityScore: scoring.severityScore,
      severityBand: scoring.severityBand,
      insights: scoring.insights,
      crisisFlag: scoring.crisisFlag,
      visibility: initialResult?.visibility || "private",
      isArchived: false,
      rawScores: scoring.rawScores,
    };
    onSave(result);
  };

  if (step === 0) {
    return (
      <div>
        <Section title="Advanced & Clinical Screens (prototype)">
          <p style={{ color: "#cbd5e1", lineHeight: 1.6, marginBottom: "1rem" }}>
            This short check-in looks for depressive load. It is <strong>not</strong> a diagnosis. Use it to
            notice when to lighten plans or seek support.
          </p>
          <p style={{ color: "#94a3b8", marginBottom: "1.25rem" }}>
            If you feel unsafe or stuck, please reach out to trusted people or a local helpline.
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button variant="secondary" onClick={onCancel}>
              Not now
            </Button>
            <Button variant="primary" onClick={() => setStep(1)}>
              Start depression check-in
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
        <Section title="Recent experiences">
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
                    {LIKERT_OPTIONS.map((option) => {
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

        </Section>
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
      </div>
    );
  }

  const scoring = scoreDepression(responses);

  return (
    <div>
      <Section title="Summary">
        <div
          style={{
            padding: "0.9rem",
            background: "rgba(15,23,42,0.6)",
            borderRadius: "0.85rem",
            border: "1px solid rgba(148,163,184,0.35)",
            marginBottom: "1rem",
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
            <span>Depression screen</span>
            <span style={{ color: "#94a3b8" }}>{scoring.severityScore} / 100</span>
          </div>
          <div
            style={{
              height: "10px",
              background: "rgba(15,23,42,0.75)",
              borderRadius: "999px",
              overflow: "hidden",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                width: `${scoring.severityScore}%`,
                height: "100%",
                background: "linear-gradient(90deg, rgba(248,113,113,0.6), rgba(59,130,246,0.45))",
              }}
            />
          </div>
          <div style={{ color: "#cbd5e1" }}>
            Band: <strong>{scoring.severityBand}</strong> — {BAND_DESCRIPTIONS[scoring.severityBand]}
          </div>
          <div style={{ color: "#94a3b8", marginTop: "0.35rem", fontSize: "0.9rem" }}>
            This is a reflective screen, not a diagnosis.
          </div>
          {scoring.crisisFlag && (
            <div style={{ color: "#f87171", marginTop: "0.5rem", fontWeight: 600 }}>
              High distress signal. Please reach out to trusted people or local helplines if you feel unsafe.
            </div>
          )}
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

        <div
          style={{
            padding: "0.9rem",
            background: "rgba(15,23,42,0.6)",
            borderRadius: "0.85rem",
            border: "1px solid rgba(148,163,184,0.25)",
            marginBottom: "1rem",
          }}
        >
          <div style={{ color: "#e5e7eb", fontWeight: 600, marginBottom: "0.35rem" }}>
            Anxiety & burnout screens
          </div>
          <p style={{ color: "#94a3b8", marginBottom: "0.65rem" }}>
            Coming soon. These will follow the same supportive, non-diagnostic pattern.
          </p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <Button variant="secondary" disabled>
              Anxiety check-in (soon)
            </Button>
            <Button variant="secondary" disabled>
              Burnout check-in (soon)
            </Button>
          </div>
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
              Save screen result
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { Button, Section } from "../../components";
import { bigFiveItems } from "./selfImageItems";
import { scoreBigFive } from "./selfImageScoring";

const LIKERT_OPTIONS = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
];

function chunkItems(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function ProgressText({ current, total }) {
  return (
    <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
      Step {current} of {total}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {import("./selfOsModel").BigFiveAssessment|null} props.initialResult
 * @param {() => void} props.onCancel
 * @param {(result: import("./selfOsModel").BigFiveAssessment) => void} props.onSave
 * @param {boolean} [props.startAtSummary]
 */
export default function BigFiveWizard({ initialResult, onCancel, onSave, startAtSummary = false }) {
  const groups = useMemo(() => chunkItems(bigFiveItems, 4), []);
  const summaryStep = groups.length + 1;
  const [step, setStep] = useState(startAtSummary ? summaryStep : 0);
  const [responses, setResponses] = useState(() => ({ ...(initialResult?.rawScores || {}) }));
  const [message, setMessage] = useState("");

  const handleSelect = (itemId, value) => {
    setResponses({ ...responses, [itemId]: value });
    setMessage("");
  };

  const goToNextQuestions = () => {
    const currentGroup = groups[step - 1] || [];
    const missing = currentGroup.filter((item) => !responses[item.id]);
    if (missing.length > 0) {
      setMessage("Please answer each statement before continuing.");
      return;
    }
    setStep(step + 1);
  };

  const handleSave = () => {
    const scoring = scoreBigFive(responses, bigFiveItems);
    const now = new Date().toISOString();
    const result = {
      version: "bf_v1",
      takenAt: initialResult?.takenAt || now,
      updatedAt: initialResult ? now : undefined,
      traits: scoring.traits,
      rawScores: scoring.rawScores,
      primaryLabels: scoring.primaryLabels,
      insights: scoring.insights,
      visibility: initialResult?.visibility || "private",
      isArchived: false,
    };
    onSave(result);
  };

  if (step === 0) {
    return (
      <div>
        <Section title="Big Five - Core Personality">
          <p style={{ color: "#cbd5e1", lineHeight: 1.6, marginBottom: "1rem" }}>
            This short check-in looks at five broad personality traits: openness, conscientiousness,
            extraversion, agreeableness, and emotional steadiness (neuroticism). It helps HumanOS tailor
            planning, tone, and suggestions.
          </p>
          <p style={{ color: "#94a3b8", marginBottom: "1.25rem" }}>Takes about 3-4 minutes.</p>
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
        <ProgressText current={step} total={groups.length} />
        <Section title="How much do these sound like you?">
          {message && <div style={{ color: "#fbbf24", marginBottom: "0.75rem" }}>{message}</div>}
          <div style={{ display: "grid", gap: "0.85rem" }}>
            {group.map((item) => {
              const currentValue = responses[item.id] || 0;
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
                  <div style={{ color: "#e5e7eb", marginBottom: "0.7rem" }}>{item.text}</div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {LIKERT_OPTIONS.map((option) => {
                      const isSelected = option.value === currentValue;
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
            <Button variant="primary" onClick={goToNextQuestions}>
              {step === groups.length ? "Review summary" : "Next"}
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  const scoring = scoreBigFive(responses, bigFiveItems);

  return (
    <div>
      <Section title="Summary">
        <p style={{ color: "#cbd5e1", marginBottom: "1rem" }}>
          You can tweak answers if something feels off, then save to your Self OS.
        </p>
        <div style={{ display: "grid", gap: "0.9rem", marginBottom: "1.25rem" }}>
          {Object.entries(scoring.traits).map(([trait, data]) => (
            <div
              key={trait}
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
                <span>{data.label}</span>
                <span style={{ color: "#94a3b8" }}>{data.score} / 100</span>
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
                    width: `${data.score}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, rgba(59,130,246,0.5), rgba(56,189,248,0.6))",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {scoring.insights.length > 0 && (
          <div
            style={{
              padding: "0.9rem",
              background: "rgba(15,23,42,0.55)",
              borderRadius: "0.8rem",
              border: "1px solid rgba(148,163,184,0.25)",
              marginBottom: "1rem",
            }}
          >
            <div style={{ color: "#e5e7eb", marginBottom: "0.5rem", fontWeight: 600 }}>Insights</div>
            <ul style={{ paddingLeft: "1.1rem", color: "#cbd5e1", lineHeight: 1.6 }}>
              {scoring.insights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
          <Button variant="secondary" onClick={() => setStep(groups.length)}>
            Back
          </Button>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save to my Self OS profile
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { Button, Section } from "../../components";
import { attachmentItems } from "./selfImageItems";

const ATTACHMENT_OPTIONS = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
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

function scoreAttachment(responses = {}) {
  const buckets = { anxiety: { total: 0, count: 0 }, avoidance: { total: 0, count: 0 } };
  const rawScores = {};

  attachmentItems.forEach((item) => {
    const raw = clampLikert(responses[item.id]);
    if (raw === null) return;
    rawScores[item.id] = raw;
    const norm = normalize(raw, item.reverse);
    buckets[item.dimension].total += norm;
    buckets[item.dimension].count += 1;
  });

  const anxiety = buckets.anxiety.count ? Math.round(buckets.anxiety.total / buckets.anxiety.count) : 50;
  const avoidance = buckets.avoidance.count ? Math.round(buckets.avoidance.total / buckets.avoidance.count) : 50;

  // NOTE: Prototype scoring; to be refined.
  let styleLabel = "Balanced / mixed";
  if (anxiety < 45 && avoidance < 45) {
    styleLabel = "Secure";
  } else if (anxiety >= 55 && avoidance < 55) {
    styleLabel = "Anxious";
  } else if (avoidance >= 55 && anxiety < 55) {
    styleLabel = "Avoidant";
  } else if (anxiety >= 55 && avoidance >= 55) {
    styleLabel = "Fearful / high-anxiety high-avoidance";
  }

  const insights = [
    anxiety >= 55
      ? "Reassurance and predictable check-ins may feel important when connections matter."
      : "You tend to trust that people will be present, which can make closeness easier.",
    avoidance >= 55
      ? "You might prefer space and self-reliance; gentle pacing helps when sharing more."
      : "You often welcome closeness and collaboration when it feels safe.",
  ];

  return { anxiety, avoidance, styleLabel, insights, rawScores };
}

/**
 * @param {Object} props
 * @param {import("./selfOsModel").AttachmentAssessment|null} props.initialResult
 * @param {() => void} props.onCancel
 * @param {(result: import("./selfOsModel").AttachmentAssessment) => void} props.onSave
 * @param {boolean} [props.startAtSummary]
 */
export default function AttachmentWizard({
  initialResult,
  onCancel,
  onSave,
  startAtSummary = false,
}) {
  const groups = useMemo(() => chunk(attachmentItems, 4), []);
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
    const scoring = scoreAttachment(responses);
    const now = new Date().toISOString();
    const result = {
      version: "attach_v1",
      takenAt: initialResult?.takenAt || now,
      updatedAt: initialResult ? now : undefined,
      dimensions: { anxiety: scoring.anxiety, avoidance: scoring.avoidance },
      styleLabel: scoring.styleLabel,
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
        <Section title="Attachment style (prototype)">
          <p style={{ color: "#cbd5e1", lineHeight: 1.6, marginBottom: "1rem" }}>
            A lightweight check-in on how you tend to approach closeness and independence. Results are for
            reflection, not diagnosis.
          </p>
          <p style={{ color: "#94a3b8", marginBottom: "1.25rem" }}>Takes about 2-3 minutes.</p>
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
        <Section title="Relationship tendencies">
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
                    {ATTACHMENT_OPTIONS.map((option) => {
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

  const scoring = scoreAttachment(responses);

  return (
    <div>
      <Section title="Summary">
        <p style={{ color: "#cbd5e1", marginBottom: "1rem" }}>
          Prototype summary based on anxiety and avoidance dimensions. You can adjust answers anytime.
        </p>

        <div style={{ display: "grid", gap: "0.85rem", marginBottom: "1rem" }}>
          <DimensionBar label="Attachment anxiety" score={scoring.anxiety} />
          <DimensionBar label="Attachment avoidance" score={scoring.avoidance} />
        </div>

        <div
          style={{
            padding: "0.85rem",
            background: "rgba(15,23,42,0.6)",
            borderRadius: "0.8rem",
            border: "1px solid rgba(148,163,184,0.3)",
            marginBottom: "1rem",
          }}
        >
          <div style={{ color: "#e5e7eb", fontWeight: 600, marginBottom: "0.35rem" }}>
            Style snapshot
          </div>
          <div style={{ color: "#cbd5e1" }}>{scoring.styleLabel}</div>
          <div style={{ color: "#94a3b8", marginTop: "0.35rem", fontSize: "0.9rem" }}>
            Results are reflective, not diagnostic.
          </div>
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

function DimensionBar({ label, score }) {
  return (
    <div
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
        <span>{label}</span>
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
            background: "linear-gradient(90deg, rgba(59,130,246,0.5), rgba(139,92,246,0.6))",
          }}
        />
      </div>
    </div>
  );
}

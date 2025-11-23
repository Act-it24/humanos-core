import React, { useEffect, useMemo, useState } from "react";
import { Card, Button, Section } from "../../components";
import {
  VALUE_OPTIONS,
  PERSONALITY_DIMENSIONS,
  CHRONOTYPE_OPTIONS,
  DEFAULT_SOCIAL_ENERGY_LABELS,
  LIFE_FLAG_OPTIONS,
  MAX_SELECTED_VALUES,
  MIN_CORE_VALUES,
  MAX_CORE_VALUES,
  calculatePercents,
  buildValuesFromSelections,
  buildPersonalityFromScores,
  createEnergyProfile,
  normalizeFocusWindows,
  buildFlagsFromKeys,
  buildProfileFromWizardData,
  profileToWizardState,
} from "./selfOsModel";

const MAX_FOCUS_WINDOWS = 3;
const WIZARD_STEP_COUNT = 6;

function ProgressLabel({ step }) {
  if (step === 0) return null;
  return (
    <div
      style={{
        color: "#94a3b8",
        fontSize: "0.85rem",
        marginBottom: "0.4rem",
      }}
    >
      Step {step} of {WIZARD_STEP_COUNT}
    </div>
  );
}

function HelperText({ children }) {
  return (
    <p
      style={{
        fontSize: "0.95rem",
        color: "#94a3b8",
        marginBottom: "1rem",
      }}
    >
      {children}
    </p>
  );
}

/**
 * Self OS Onboarding Wizard (v0.2)
 *
 * @param {Object} props
 * @param {Object|null} props.initialProfile
 * @param {Function} props.onCancel
 * @param {Function} props.onComplete
 */
export default function SelfOSWizard({ initialProfile = null, onCancel, onComplete }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(() => profileToWizardState(initialProfile));
  const [valueMessage, setValueMessage] = useState("");
  const [coreMessage, setCoreMessage] = useState("");
  const [focusMessage, setFocusMessage] = useState("");

  useEffect(() => {
    setFormData(profileToWizardState(initialProfile));
    setValueMessage("");
    setCoreMessage("");
    setFocusMessage("");
    setStep(0);
  }, [initialProfile]);

  const valueLookup = useMemo(() => {
    const map = VALUE_OPTIONS.reduce((acc, val) => {
      acc[val.key] = val;
      return acc;
    }, {});
    if (initialProfile?.values) {
      initialProfile.values.forEach((val) => {
        if (!map[val.key]) {
          map[val.key] = { key: val.key, label: val.label || val.key, description: val.description };
        }
      });
    }
    return map;
  }, [initialProfile]);

  const flagLabelLookup = useMemo(() => {
    const map = Object.values(LIFE_FLAG_OPTIONS)
      .flat()
      .reduce((acc, flag) => {
        acc[flag.key] = flag;
        return acc;
      }, {});
    if (initialProfile?.flags) {
      initialProfile.flags.forEach((flag) => {
        if (!map[flag.key]) {
          map[flag.key] = { key: flag.key, label: flag.label || flag.key, type: flag.type || "other" };
        }
      });
    }
    return map;
  }, [initialProfile]);

  const selectedValueKeys = formData.selectedValueKeys || [];
  const coreValueKeys = formData.coreValueKeys || [];
  const coreRanks = formData.coreRanks || {};
  const personalityScores = formData.personalityScores || {};
  const focusWindows = formData.focusWindows || [];
  const selectedFlagKeys = formData.selectedFlagKeys || [];
  const socialEnergyScore = Number.isFinite(formData.socialEnergyScore) ? formData.socialEnergyScore : 50;

  const selectedValues = selectedValueKeys.map((key) => valueLookup[key] || { key, label: key });
  const coreValues = coreValueKeys.map((key) => valueLookup[key] || { key, label: key });

  const coreRanksInUse = new Set(Object.values(coreRanks));
  const canProceedFromValues = selectedValueKeys.length >= MIN_CORE_VALUES;
  const canProceedFromRanking =
    coreValueKeys.length >= MIN_CORE_VALUES &&
    coreValueKeys.length <= MAX_CORE_VALUES &&
    coreValueKeys.every((key) => Number.isFinite(coreRanks[key])) &&
    coreRanksInUse.size === coreValueKeys.length;

  const personalityPreview = buildPersonalityFromScores(personalityScores);
  const energyPreview = createEnergyProfile({
    chronotype: formData.chronotype || "mixed",
    focusWindows: normalizeFocusWindows(focusWindows),
    socialEnergyScore,
  });
  const flagsPreview = buildFlagsFromKeys(selectedFlagKeys);

  const handleToggleValue = (key) => {
    if (selectedValueKeys.includes(key)) {
      const updatedSelection = selectedValueKeys.filter((k) => k !== key);
      const updatedCores = coreValueKeys.filter((k) => k !== key);
      const updatedRanks = { ...coreRanks };
      delete updatedRanks[key];
      setFormData({
        ...formData,
        selectedValueKeys: updatedSelection,
        coreValueKeys: updatedCores,
        coreRanks: updatedRanks,
      });
      setValueMessage("");
      setCoreMessage("");
      return;
    }

    if (selectedValueKeys.length >= MAX_SELECTED_VALUES) {
      setValueMessage(
        "Try to keep it focused. Choose up to 7 for now - you can always refine this later."
      );
      return;
    }

    setFormData({
      ...formData,
      selectedValueKeys: [...selectedValueKeys, key],
    });
    setValueMessage("");
  };

  const handleToggleCore = (key) => {
    if (coreValueKeys.includes(key)) {
      const updatedCores = coreValueKeys.filter((k) => k !== key);
      const updatedRanks = { ...coreRanks };
      delete updatedRanks[key];
      setFormData({
        ...formData,
        coreValueKeys: updatedCores,
        coreRanks: updatedRanks,
      });
      setCoreMessage("");
      return;
    }

    if (coreValueKeys.length >= MAX_CORE_VALUES) {
      setCoreMessage("Pick up to five core values for now.");
      return;
    }

    setFormData({
      ...formData,
      coreValueKeys: [...coreValueKeys, key],
    });
    setCoreMessage("");
  };

  const updateCoreRank = (key, rank) => {
    setFormData({
      ...formData,
      coreRanks: {
        ...coreRanks,
        [key]: rank,
      },
    });
  };

  const updatePersonalityScore = (key, score) => {
    setFormData({
      ...formData,
      personalityScores: {
        ...personalityScores,
        [key]: score,
      },
    });
  };

  const updateFocusWindow = (index, field, value) => {
    const updated = focusWindows.map((window, idx) =>
      idx === index ? { ...window, [field]: value } : window
    );
    setFormData({ ...formData, focusWindows: updated });
  };

  const addFocusWindow = () => {
    if (focusWindows.length >= MAX_FOCUS_WINDOWS) {
      setFocusMessage("You can add up to 3 focus windows for now.");
      return;
    }
    setFormData({
      ...formData,
      focusWindows: [...focusWindows, { label: "", startTime: "", endTime: "" }],
    });
    setFocusMessage("");
  };

  const removeFocusWindow = (index) => {
    const updated = focusWindows.filter((_, idx) => idx !== index);
    setFormData({ ...formData, focusWindows: updated });
  };

  const handleFlagToggle = (key) => {
    if (selectedFlagKeys.includes(key)) {
      setFormData({
        ...formData,
        selectedFlagKeys: selectedFlagKeys.filter((k) => k !== key),
      });
      return;
    }
    setFormData({
      ...formData,
      selectedFlagKeys: [...selectedFlagKeys, key],
    });
  };

  const handleSave = () => {
    const profile = buildProfileFromWizardData(formData, initialProfile);
    onComplete(profile);
  };

  const renderValueButton = (option) => {
    const isSelected = selectedValueKeys.includes(option.key);
    return (
      <button
        key={option.key}
        onClick={() => handleToggleValue(option.key)}
        style={{
          padding: "0.85rem 1rem",
          borderRadius: "0.75rem",
          border: isSelected ? "2px solid rgba(96,165,250,0.9)" : "1px solid rgba(148,163,184,0.35)",
          background: isSelected ? "rgba(59,130,246,0.14)" : "rgba(15,23,42,0.65)",
          color: "#e5e7eb",
          cursor: "pointer",
          fontSize: "0.92rem",
          textAlign: "left",
          transition: "all 0.18s ease",
        }}
      >
        <div style={{ fontWeight: 600 }}>{option.label}</div>
        {option.description && (
          <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.35rem" }}>
            {option.description}
          </div>
        )}
      </button>
    );
  };

  const renderFlagGroup = (title, items) => (
    <div style={{ marginBottom: "1.25rem" }}>
      <h4
        style={{
          fontSize: "1rem",
          marginBottom: "0.6rem",
          color: "#e5e7eb",
        }}
      >
        {title}
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {items.map((flag) => {
          const isChecked = selectedFlagKeys.includes(flag.key);
          return (
            <label
              key={flag.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem",
                background: "rgba(15,23,42,0.6)",
                borderRadius: "0.6rem",
                border: "1px solid rgba(148,163,184,0.25)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleFlagToggle(flag.key)}
                style={{ width: "1.1rem", height: "1.1rem", cursor: "pointer" }}
              />
              <div>
                <div style={{ color: "#e5e7eb", fontSize: "0.95rem" }}>{flag.label}</div>
                {flag.description && (
                  <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{flag.description}</div>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );

  // --- Step screens ---

  if (step === 0) {
    return (
      <Card>
        <Section title="Let's tune HumanOS to your inner world">
          <p
            style={{
              fontSize: "0.98rem",
              lineHeight: 1.7,
              color: "#e5e7eb",
              marginBottom: "1.5rem",
            }}
          >
            Self OS is your inner profile in HumanOS - your values, patterns, energy rhythms, and life
            context. This is not a test; there are no right answers. You can edit everything later, and we
            use it to keep plans and suggestions aligned with who you are.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Button variant="primary" onClick={() => setStep(1)}>
              Start Self OS Setup
            </Button>
            <Button variant="secondary" onClick={onCancel}>
              Skip for now
            </Button>
          </div>
        </Section>
      </Card>
    );
  }

  if (step === 1) {
    return (
      <Card>
        <ProgressLabel step={step} />
        <Section title="Values - Selection">
          <HelperText>Pick up to 7 values that feel important to you right now.</HelperText>
          {valueMessage && (
            <div style={{ color: "#f87171", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              {valueMessage}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "0.85rem",
              marginBottom: "1.5rem",
            }}
          >
            {VALUE_OPTIONS.map((value) => renderValueButton(value))}
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              marginTop: "1.5rem",
            }}
          >
            <Button variant="secondary" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(2)} disabled={!canProceedFromValues}>
              Next
            </Button>
          </div>
        </Section>
      </Card>
    );
  }

  if (step === 2) {
    return (
      <Card>
        <ProgressLabel step={step} />
        <Section title="Values - Ranking">
          <HelperText>
            Choose 3-5 of your selected values as your core set, then rank them (1 = most important).
          </HelperText>
          {coreMessage && (
            <div style={{ color: "#fbbf24", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              {coreMessage}
            </div>
          )}

          <div style={{ marginBottom: "1.25rem" }}>
            <h4
              style={{
                fontSize: "1.05rem",
                marginBottom: "0.75rem",
                color: "#e5e7eb",
              }}
            >
              Mark your core values (3-5)
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "0.9rem",
              }}
            >
              {selectedValues.map((value) => {
                const isCore = coreValueKeys.includes(value.key);
                return (
                  <button
                    key={value.key}
                    onClick={() => handleToggleCore(value.key)}
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: "0.75rem",
                      border: isCore
                        ? "2px solid rgba(96,165,250,0.9)"
                        : "1px solid rgba(148,163,184,0.35)",
                      background: isCore ? "rgba(59,130,246,0.14)" : "rgba(15,23,42,0.65)",
                      color: "#e5e7eb",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{value.label}</div>
                    <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.35rem" }}>
                      {isCore ? "Marked as core" : "Tap to mark as core"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {coreValues.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h4
                style={{
                  fontSize: "1.05rem",
                  marginBottom: "0.75rem",
                  color: "#e5e7eb",
                }}
              >
                Rank your core values
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {coreValues.map((value) => {
                  const usedByOthers = Object.entries(coreRanks).reduce((set, [key, rank]) => {
                    if (key !== value.key && Number.isFinite(rank)) set.add(rank);
                    return set;
                  }, new Set());

                  return (
                    <div
                      key={value.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "0.85rem",
                        background: "rgba(15,23,42,0.6)",
                        borderRadius: "0.75rem",
                        border: "1px solid rgba(148,163,184,0.25)",
                      }}
                    >
                      <div style={{ color: "#e5e7eb", minWidth: "180px" }}>{value.label}</div>
                      <select
                        value={coreRanks[value.key] || ""}
                        onChange={(e) => updateCoreRank(value.key, Number(e.target.value))}
                        style={{
                          padding: "0.45rem 0.65rem",
                          borderRadius: "0.6rem",
                          background: "rgba(15,23,42,0.85)",
                          border: "1px solid rgba(148,163,184,0.35)",
                          color: "#e5e7eb",
                          minWidth: "120px",
                        }}
                      >
                        <option value="" disabled>
                          Select rank
                        </option>
                        {[1, 2, 3, 4, 5].map((rank) => (
                          <option key={rank} value={rank} disabled={usedByOthers.has(rank)}>
                            {rank}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(3)} disabled={!canProceedFromRanking}>
              Next
            </Button>
          </div>
        </Section>
      </Card>
    );
  }

  if (step === 3) {
    return (
      <Card>
        <ProgressLabel step={step} />
        <Section title="Personality Style - Sliders">
          <HelperText>
            Sliders capture tendencies, not boxes. Move each slider to what feels true for daily life.
          </HelperText>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
            {PERSONALITY_DIMENSIONS.map((dim) => {
              const score = Number.isFinite(personalityScores[dim.key]) ? personalityScores[dim.key] : 50;
              const { percentLeft, percentRight } = calculatePercents(score);
              return (
                <div
                  key={dim.key}
                  style={{
                    padding: "1rem",
                    background: "rgba(15,23,42,0.6)",
                    borderRadius: "0.9rem",
                    border: "1px solid rgba(148,163,184,0.25)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{dim.labelLeft}</div>
                    <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{dim.description}</div>
                    <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{dim.labelRight}</div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => updatePersonalityScore(dim.key, Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "0.35rem",
                      color: "#cbd5e1",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>
                      {dim.labelLeft} {percentLeft}%
                    </span>
                    <span>
                      {dim.labelRight} {percentRight}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
            <Button variant="secondary" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(4)}>
              Next
            </Button>
          </div>
        </Section>
      </Card>
    );
  }

  if (step === 4) {
    const { percentLeft, percentRight } = calculatePercents(energyPreview.socialEnergy.score);

    return (
      <Card>
        <ProgressLabel step={step} />
        <Section title="Energy Rhythms">
          <HelperText>
            Help HumanOS respect your natural peaks and dips. You can skip or keep defaults if you are not
            sure.
          </HelperText>

          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ fontSize: "1.05rem", color: "#e5e7eb", marginBottom: "0.5rem" }}>
              When do you usually feel most clear and focused?
            </h4>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {CHRONOTYPE_OPTIONS.map((option) => {
                const isSelected = formData.chronotype === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, chronotype: option.value })}
                    style={{
                      padding: "0.7rem 1.1rem",
                      borderRadius: "0.6rem",
                      border: isSelected
                        ? "2px solid rgba(96,165,250,0.9)"
                        : "1px solid rgba(148,163,184,0.35)",
                      background: isSelected ? "rgba(59,130,246,0.14)" : "rgba(15,23,42,0.65)",
                      color: "#e5e7eb",
                      cursor: "pointer",
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ fontSize: "1.05rem", color: "#e5e7eb", marginBottom: "0.5rem" }}>
              Focus windows (optional, up to 3)
            </h4>
            {focusMessage && (
              <div style={{ color: "#fbbf24", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                {focusMessage}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {focusWindows.map((window, index) => (
                <div
                  key={`${index}-${window.label || "focus"}`}
                  style={{
                    padding: "0.85rem",
                    background: "rgba(15,23,42,0.6)",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(148,163,184,0.25)",
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr auto",
                    gap: "0.6rem",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Label (e.g., Morning deep work)"
                    value={window.label}
                    onChange={(e) => updateFocusWindow(index, "label", e.target.value)}
                    style={{
                      padding: "0.6rem",
                      borderRadius: "0.5rem",
                      background: "rgba(15,23,42,0.85)",
                      border: "1px solid rgba(148,163,184,0.3)",
                      color: "#e5e7eb",
                    }}
                  />
                  <input
                    type="time"
                    value={window.startTime}
                    onChange={(e) => updateFocusWindow(index, "startTime", e.target.value)}
                    style={{
                      padding: "0.6rem",
                      borderRadius: "0.5rem",
                      background: "rgba(15,23,42,0.85)",
                      border: "1px solid rgba(148,163,184,0.3)",
                      color: "#e5e7eb",
                    }}
                  />
                  <input
                    type="time"
                    value={window.endTime}
                    onChange={(e) => updateFocusWindow(index, "endTime", e.target.value)}
                    style={{
                      padding: "0.6rem",
                      borderRadius: "0.5rem",
                      background: "rgba(15,23,42,0.85)",
                      border: "1px solid rgba(148,163,184,0.3)",
                      color: "#e5e7eb",
                    }}
                  />
                  <Button variant="ghost" onClick={() => removeFocusWindow(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "0.75rem" }}>
              <Button
                variant="secondary"
                onClick={addFocusWindow}
                disabled={focusWindows.length >= MAX_FOCUS_WINDOWS}
              >
                Add focus window
              </Button>
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ fontSize: "1.05rem", color: "#e5e7eb", marginBottom: "0.5rem" }}>
              Social energy
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
              {DEFAULT_SOCIAL_ENERGY_LABELS.labelLeft} {percentLeft}% - {DEFAULT_SOCIAL_ENERGY_LABELS.labelRight}{" "}
              {percentRight}%
            </p>
            <input
              type="range"
              min="0"
              max="100"
              value={energyPreview.socialEnergy.score}
              onChange={(e) => setFormData({ ...formData, socialEnergyScore: Number(e.target.value) })}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
            <Button variant="secondary" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(5)}>
              Next
            </Button>
          </div>
        </Section>
      </Card>
    );
  }

  if (step === 5) {
    const customSelectedFlags = selectedFlagKeys
      .filter((key) => !flagLabelLookup[key])
      .map((key) => ({ key, label: flagLabelLookup[key]?.label || key, type: "other" }));

    return (
      <Card>
        <ProgressLabel step={step} />
        <Section title="Life Context & Flags">
          <HelperText>
            Pick any that give context for your life right now. These help tailor plans and expectations.
          </HelperText>

          {renderFlagGroup("Roles", LIFE_FLAG_OPTIONS.roles)}
          {renderFlagGroup("Constraints", LIFE_FLAG_OPTIONS.constraints)}
          {renderFlagGroup("Transitions", LIFE_FLAG_OPTIONS.transitions)}
          {renderFlagGroup("Other", [...LIFE_FLAG_OPTIONS.other, ...customSelectedFlags])}

          <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between", marginTop: "1.5rem" }}>
            <Button variant="secondary" onClick={() => setStep(4)}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(6)}>
              Next
            </Button>
          </div>
        </Section>
      </Card>
    );
  }

  if (step === 6) {
    const valuesPreview = buildValuesFromSelections(selectedValueKeys, coreValueKeys, coreRanks);
    const summaryCoreValues = valuesPreview
      .filter((v) => v.priorityBand === "core")
      .sort((a, b) => (a.rank || 99) - (b.rank || 99));
    const summarySupporting = valuesPreview.filter((v) => v.priorityBand === "supporting");
    const { percentLeft, percentRight } = calculatePercents(energyPreview.socialEnergy.score);
    const flagsByType = flagsPreview.reduce(
      (acc, flag) => {
        if (!flag.isActive) return acc;
        acc[flag.type] = acc[flag.type] || [];
        acc[flag.type].push(flag);
        return acc;
      },
      { role: [], constraint: [], transition: [], other: [] }
    );
    const chronotypeLabel =
      CHRONOTYPE_OPTIONS.find((option) => option.value === energyPreview.chronotype)?.label || "Mixed";

    return (
      <Card>
        <ProgressLabel step={step} />
        <Section title="Summary & Confirmation">
          <HelperText>Take a quick look. You can always adjust later.</HelperText>

          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <h4 style={{ color: "#e5e7eb", marginBottom: "0.5rem" }}>Core values</h4>
              {summaryCoreValues.length === 0 ? (
                <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>No core values selected.</div>
              ) : (
                <div
                  style={{
                    padding: "0.9rem",
                    background: "rgba(15,23,42,0.6)",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(148,163,184,0.25)",
                  }}
                >
                  {summaryCoreValues.map((value) => (
                    <div key={value.key} style={{ color: "#e5e7eb", marginBottom: "0.35rem" }}>
                      {value.rank}. {value.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 style={{ color: "#e5e7eb", marginBottom: "0.5rem" }}>Supporting values</h4>
              {summarySupporting.length === 0 ? (
                <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>None selected.</div>
              ) : (
                <div
                  style={{
                    padding: "0.9rem",
                    background: "rgba(15,23,42,0.6)",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(148,163,184,0.25)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  {summarySupporting.map((value) => (
                    <span
                      key={value.key}
                      style={{
                        padding: "0.4rem 0.7rem",
                        borderRadius: "0.6rem",
                        background: "rgba(59,130,246,0.12)",
                        color: "#e5e7eb",
                        fontSize: "0.9rem",
                        border: "1px solid rgba(96,165,250,0.4)",
                      }}
                    >
                      {value.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 style={{ color: "#e5e7eb", marginBottom: "0.5rem" }}>Personality sliders</h4>
              <div
                style={{
                  padding: "0.9rem",
                  background: "rgba(15,23,42,0.6)",
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(148,163,184,0.25)",
                  display: "grid",
                  gap: "0.5rem",
                }}
              >
                {personalityPreview.map((dim) => (
                  <div key={dim.key} style={{ color: "#e5e7eb", fontSize: "0.95rem" }}>
                    {dim.labelLeft} {dim.percentLeft}% - {dim.labelRight} {dim.percentRight}%
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ color: "#e5e7eb", marginBottom: "0.5rem" }}>Energy rhythms</h4>
              <div
                style={{
                  padding: "0.9rem",
                  background: "rgba(15,23,42,0.6)",
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(148,163,184,0.25)",
                  display: "grid",
                  gap: "0.4rem",
                }}
              >
                <div style={{ color: "#e5e7eb" }}>
                  Chronotype: {chronotypeLabel || "Mixed / It depends"}
                </div>
                {energyPreview.focusWindows.length > 0 && (
                  <div style={{ color: "#e5e7eb" }}>
                    Focus windows:
                    <ul style={{ paddingLeft: "1.2rem", marginTop: "0.35rem" }}>
                      {energyPreview.focusWindows.map((window, idx) => (
                        <li key={`${window.label}-${idx}`} style={{ marginBottom: "0.25rem" }}>
                          {window.label}: {window.startTime}-{window.endTime}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div style={{ color: "#e5e7eb" }}>
                  Social energy: {DEFAULT_SOCIAL_ENERGY_LABELS.labelLeft} {percentLeft}% -{" "}
                  {DEFAULT_SOCIAL_ENERGY_LABELS.labelRight} {percentRight}%
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ color: "#e5e7eb", marginBottom: "0.5rem" }}>Life context & flags</h4>
              {["role", "constraint", "transition", "other"].map((typeKey) => {
                const labelMap = {
                  role: "Roles",
                  constraint: "Constraints",
                  transition: "Transitions",
                  other: "Other",
                };
                const items = flagsByType[typeKey] || [];
                if (items.length === 0) return null;
                return (
                  <div key={typeKey} style={{ marginBottom: "0.5rem" }}>
                    <div style={{ color: "#94a3b8", marginBottom: "0.25rem" }}>{labelMap[typeKey]}</div>
                    <div
                      style={{
                        padding: "0.75rem",
                        background: "rgba(15,23,42,0.5)",
                        borderRadius: "0.65rem",
                        border: "1px solid rgba(148,163,184,0.25)",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.4rem",
                      }}
                    >
                      {items.map((flag) => (
                        <span
                          key={flag.key}
                          style={{
                            padding: "0.35rem 0.6rem",
                            borderRadius: "0.55rem",
                            background: "rgba(96,165,250,0.14)",
                            color: "#e5e7eb",
                            fontSize: "0.9rem",
                            border: "1px solid rgba(96,165,250,0.35)",
                          }}
                        >
                          {flag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
              {flagsPreview.length === 0 && (
                <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>No flags selected.</div>
              )}
            </div>

            <div>
              <h4 style={{ color: "#e5e7eb", marginBottom: "0.5rem" }}>Anything to add?</h4>
              <textarea
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Is there anything you'd like HumanOS to keep in mind about you right now?"
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "0.85rem",
                  borderRadius: "0.75rem",
                  background: "rgba(15,23,42,0.85)",
                  border: "1px solid rgba(148,163,184,0.35)",
                  color: "#e5e7eb",
                  fontSize: "0.95rem",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              marginTop: "1.5rem",
            }}
          >
            <Button variant="secondary" onClick={() => setStep(5)}>
              Back
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Self OS Profile
            </Button>
          </div>
        </Section>
      </Card>
    );
  }

  return null;
}

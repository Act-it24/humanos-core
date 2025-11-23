import React, { useState, useEffect } from "react";
import { Card, Button, Section } from "../../components";
import {
  createEmptySelfOsProfile,
  PREDEFINED_VALUES,
  PREDEFINED_TRAITS,
  CHRONOTYPE_OPTIONS,
  SOCIAL_ENERGY_OPTIONS,
  PREDEFINED_FLAGS,
  buildProfileFromFormData,
} from "./selfOsModel";

/**
 * Self OS Onboarding Wizard
 * 
 * Multi-step wizard for creating/editing a Self OS profile.
 * Based on docs/25_self_os_onboarding_spec.md
 * 
 * @param {Object} props
 * @param {Object|null} props.initialProfile - Existing profile to edit (optional)
 * @param {Function} props.onCancel - Callback when user cancels/skips
 * @param {Function} props.onComplete - Callback when user completes with profile
 */
export default function SelfOSWizard({ initialProfile = null, onCancel, onComplete }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(() => {
    if (initialProfile) {
      return {
        createdAt: initialProfile.createdAt,
        values: [...initialProfile.values],
        traits: [...initialProfile.traits],
        energy: [...initialProfile.energy],
        flags: [...initialProfile.flags],
        notes: initialProfile.notes || "",
      };
    }
    return {
      values: [],
      traits: [],
      energy: [],
      flags: [],
      notes: "",
    };
  });

  const totalSteps = 6; // 0-5

  // Screen 0: Intro
  if (step === 0) {
    return (
      <Card>
        <Section title="Let's set up your Self OS">
          <p
            style={{
              fontSize: "0.98rem",
              lineHeight: 1.7,
              color: "#e5e7eb",
              marginBottom: "2rem",
            }}
          >
            HumanOS uses your Self OS profile to personalize goals, plans and reflections.
            <br />
            <br />
            You stay in control; you can edit this later.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Button variant="primary" onClick={() => setStep(1)}>
              Start
            </Button>
            <Button variant="secondary" onClick={onCancel}>
              Skip for now
            </Button>
          </div>
        </Section>
      </Card>
    );
  }

  // Screen 1: Core Values
  if (step === 1) {
    const selectedValues = formData.values || [];
    const maxValues = 5;

    const toggleValue = (valueId) => {
      const existing = selectedValues.find((v) => v.id === valueId);
      if (existing) {
        setFormData({
          ...formData,
          values: selectedValues.filter((v) => v.id !== valueId),
        });
      } else if (selectedValues.length < maxValues) {
        const valueDef = PREDEFINED_VALUES.find((v) => v.id === valueId);
        setFormData({
          ...formData,
          values: [
            ...selectedValues,
            {
              id: valueId,
              label: valueDef.label,
              rank: selectedValues.length + 1,
            },
          ],
        });
      }
    };

    const updateRank = (valueId, newRank) => {
      const updated = selectedValues.map((v) => {
        if (v.id === valueId) {
          return { ...v, rank: newRank };
        }
        // Adjust other ranks if needed
        if (v.rank === newRank && v.id !== valueId) {
          return { ...v, rank: v.rank + 1 };
        }
        return v;
      });
      setFormData({ ...formData, values: updated });
    };

    return (
      <Card>
        <Section title="Core Values">
          <p
            style={{
              fontSize: "0.95rem",
              color: "#94a3b8",
              marginBottom: "1.5rem",
            }}
          >
            Which of these feel most important to you right now? (Select up to {maxValues})
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "0.75rem",
              marginBottom: "2rem",
            }}
          >
            {PREDEFINED_VALUES.map((value) => {
              const isSelected = selectedValues.some((v) => v.id === value.id);
              return (
                <button
                  key={value.id}
                  onClick={() => toggleValue(value.id)}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    border: isSelected
                      ? "2px solid rgba(96,165,250,0.9)"
                      : "1px solid rgba(148,163,184,0.3)",
                    background: isSelected
                      ? "rgba(59,130,246,0.15)"
                      : "rgba(15,23,42,0.5)",
                    color: "#e5e7eb",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  {value.label}
                </button>
              );
            })}
          </div>

          {selectedValues.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#94a3b8",
                  marginBottom: "1rem",
                }}
              >
                Rank your selected values (1 = most important):
              </p>
              {selectedValues
                .sort((a, b) => a.rank - b.rank)
                .map((value) => (
                  <div
                    key={value.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "0.75rem",
                      padding: "0.75rem",
                      background: "rgba(15,23,42,0.5)",
                      borderRadius: "0.5rem",
                    }}
                  >
                    <span style={{ minWidth: "80px", color: "#e5e7eb" }}>
                      {value.label}
                    </span>
                    <select
                      value={value.rank}
                      onChange={(e) => updateRank(value.id, parseInt(e.target.value))}
                      style={{
                        padding: "0.4rem 0.6rem",
                        borderRadius: "0.4rem",
                        background: "rgba(15,23,42,0.8)",
                        border: "1px solid rgba(148,163,184,0.3)",
                        color: "#e5e7eb",
                        cursor: "pointer",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((rank) => (
                        <option key={rank} value={rank}>
                          {rank}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
            <Button variant="secondary" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setStep(2)}
              disabled={selectedValues.length === 0}
            >
              Next
            </Button>
          </div>
        </Section>
      </Card>
    );
  }

  // Screen 2: Personality Style
  if (step === 2) {
    const updateTrait = (traitId, value) => {
      const existing = formData.traits.find((t) => t.id === traitId);
      const traitDef = PREDEFINED_TRAITS.find((t) => t.id === traitId);
      
      if (existing) {
        setFormData({
          ...formData,
          traits: formData.traits.map((t) =>
            t.id === traitId ? { ...t, value } : t
          ),
        });
      } else {
        setFormData({
          ...formData,
          traits: [
            ...formData.traits,
            {
              id: traitId,
              label: traitDef.label,
              dimension: "personality",
              value,
            },
          ],
        });
      }
    };

    const getTraitValue = (traitId) => {
      const trait = formData.traits.find((t) => t.id === traitId);
      return trait?.value || null;
    };

    return (
      <Card>
        <Section title="Personality Style">
          <p
            style={{
              fontSize: "0.95rem",
              color: "#94a3b8",
              marginBottom: "2rem",
            }}
          >
            Which side feels closer to you in daily life?
          </p>

          {PREDEFINED_TRAITS.map((trait) => {
            const currentValue = getTraitValue(trait.id);
            return (
              <div
                key={trait.id}
                style={{
                  marginBottom: "2rem",
                  padding: "1.25rem",
                  background: "rgba(15,23,42,0.5)",
                  borderRadius: "0.75rem",
                }}
              >
                <h4
                  style={{
                    fontSize: "1.1rem",
                    marginBottom: "0.5rem",
                    color: "#e5e7eb",
                  }}
                >
                  {trait.label}
                </h4>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                    marginBottom: "1rem",
                  }}
                >
                  {trait.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  {["low", "medium", "high"].map((val) => {
                    const isSelected = currentValue === val;
                    return (
                      <button
                        key={val}
                        onClick={() => updateTrait(trait.id, val)}
                        style={{
                          padding: "0.6rem 1.2rem",
                          borderRadius: "0.5rem",
                          border: isSelected
                            ? "2px solid rgba(96,165,250,0.9)"
                            : "1px solid rgba(148,163,184,0.3)",
                          background: isSelected
                            ? "rgba(59,130,246,0.15)"
                            : "rgba(15,23,42,0.8)",
                          color: "#e5e7eb",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          textTransform: "capitalize",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setStep(3)}
              disabled={formData.traits.length < PREDEFINED_TRAITS.length}
            >
              Next
            </Button>
          </div>
        </Section>
      </Card>
    );
  }

  // Screen 3: Energy Rhythms
  if (step === 3) {
    const updateEnergy = (energyId, value, label) => {
      const existing = formData.energy.find((e) => e.id === energyId);
      if (existing) {
        setFormData({
          ...formData,
          energy: formData.energy.map((e) =>
            e.id === energyId ? { ...e, value, label } : e
          ),
        });
      } else {
        setFormData({
          ...formData,
          energy: [
            ...formData.energy,
            {
              id: energyId,
              label,
              value,
            },
          ],
        });
      }
    };

    const getEnergyValue = (energyId) => {
      const energy = formData.energy.find((e) => e.id === energyId);
      return energy?.value || null;
    };

    return (
      <Card>
        <Section title="Energy Rhythms">
          <div style={{ marginBottom: "2rem" }}>
            <h4
              style={{
                fontSize: "1.1rem",
                marginBottom: "0.75rem",
                color: "#e5e7eb",
              }}
            >
              When do you usually feel most clear and focused?
            </h4>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              {CHRONOTYPE_OPTIONS.map((option) => {
                const isSelected = getEnergyValue("chronotype") === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => updateEnergy("chronotype", option.id, option.label)}
                    style={{
                      padding: "0.6rem 1.2rem",
                      borderRadius: "0.5rem",
                      border: isSelected
                        ? "2px solid rgba(96,165,250,0.9)"
                        : "1px solid rgba(148,163,184,0.3)",
                      background: isSelected
                        ? "rgba(59,130,246,0.15)"
                        : "rgba(15,23,42,0.8)",
                      color: "#e5e7eb",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h4
              style={{
                fontSize: "1.1rem",
                marginBottom: "0.75rem",
                color: "#e5e7eb",
              }}
            >
              How do you usually recharge your energy?
            </h4>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              {SOCIAL_ENERGY_OPTIONS.map((option) => {
                const isSelected = getEnergyValue("social_energy") === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => updateEnergy("social_energy", option.id, option.label)}
                    style={{
                      padding: "0.6rem 1.2rem",
                      borderRadius: "0.5rem",
                      border: isSelected
                        ? "2px solid rgba(96,165,250,0.9)"
                        : "1px solid rgba(148,163,184,0.3)",
                      background: isSelected
                        ? "rgba(59,130,246,0.15)"
                        : "rgba(15,23,42,0.8)",
                      color: "#e5e7eb",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
            <Button variant="secondary" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setStep(4)}
              disabled={
                !getEnergyValue("chronotype") || !getEnergyValue("social_energy")
              }
            >
              Next
            </Button>
          </div>
        </Section>
      </Card>
    );
  }

  // Screen 4: Life Context & Flags
  if (step === 4) {
    const toggleFlag = (flagId) => {
      const existing = formData.flags.find((f) => f.id === flagId);
      const flagDef = PREDEFINED_FLAGS.find((f) => f.id === flagId);
      
      if (existing) {
        setFormData({
          ...formData,
          flags: formData.flags.filter((f) => f.id !== flagId),
        });
      } else {
        setFormData({
          ...formData,
          flags: [
            ...formData.flags,
            {
              id: flagId,
              text: flagDef.text,
              type: flagDef.type,
              active: true,
            },
          ],
        });
      }
    };

    const isFlagSelected = (flagId) => {
      return formData.flags.some((f) => f.id === flagId);
    };

    const supportFlags = PREDEFINED_FLAGS.filter((f) => f.type === "identity");
    const riskFlags = PREDEFINED_FLAGS.filter((f) => f.type === "risk");

    return (
      <Card>
        <Section title="Life Context & Flags">
          <p
            style={{
              fontSize: "0.95rem",
              color: "#94a3b8",
              marginBottom: "2rem",
            }}
          >
            Select any that apply to you right now:
          </p>

          <div style={{ marginBottom: "2rem" }}>
            <h4
              style={{
                fontSize: "1.1rem",
                marginBottom: "1rem",
                color: "#e5e7eb",
              }}
            >
              Support / Identity
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {supportFlags.map((flag) => {
                const isSelected = isFlagSelected(flag.id);
                return (
                  <label
                    key={flag.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      background: "rgba(15,23,42,0.5)",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleFlag(flag.id)}
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ color: "#e5e7eb", fontSize: "0.95rem" }}>
                      {flag.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h4
              style={{
                fontSize: "1.1rem",
                marginBottom: "1rem",
                color: "#e5e7eb",
              }}
            >
              Risk / Stress
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {riskFlags.map((flag) => {
                const isSelected = isFlagSelected(flag.id);
                return (
                  <label
                    key={flag.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      background: "rgba(15,23,42,0.5)",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleFlag(flag.id)}
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ color: "#e5e7eb", fontSize: "0.95rem" }}>
                      {flag.text}
                    </span>
                  </label>
                );
              })}
            </div>
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

  // Screen 5: Summary & Confirmation
  if (step === 5) {
    const handleSave = () => {
      const profile = buildProfileFromFormData(formData);
      onComplete(profile);
    };

    return (
      <Card>
        <Section title="Summary & Confirmation">
          <p
            style={{
              fontSize: "0.95rem",
              color: "#94a3b8",
              marginBottom: "2rem",
            }}
          >
            Review your Self OS profile:
          </p>

          {/* Values Summary */}
          {formData.values.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h4
                style={{
                  fontSize: "1.1rem",
                  marginBottom: "0.75rem",
                  color: "#e5e7eb",
                }}
              >
                Core Values
              </h4>
              <div
                style={{
                  padding: "1rem",
                  background: "rgba(15,23,42,0.5)",
                  borderRadius: "0.5rem",
                }}
              >
                {formData.values
                  .sort((a, b) => a.rank - b.rank)
                  .map((value) => (
                    <div
                      key={value.id}
                      style={{
                        marginBottom: "0.5rem",
                        color: "#e5e7eb",
                        fontSize: "0.95rem",
                      }}
                    >
                      {value.rank}. {value.label}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Traits Summary */}
          {formData.traits.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h4
                style={{
                  fontSize: "1.1rem",
                  marginBottom: "0.75rem",
                  color: "#e5e7eb",
                }}
              >
                Personality Style
              </h4>
              <div
                style={{
                  padding: "1rem",
                  background: "rgba(15,23,42,0.5)",
                  borderRadius: "0.5rem",
                }}
              >
                {formData.traits.map((trait) => (
                  <div
                    key={trait.id}
                    style={{
                      marginBottom: "0.5rem",
                      color: "#e5e7eb",
                      fontSize: "0.95rem",
                    }}
                  >
                    <strong>{trait.label}:</strong> {trait.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Energy Summary */}
          {formData.energy.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h4
                style={{
                  fontSize: "1.1rem",
                  marginBottom: "0.75rem",
                  color: "#e5e7eb",
                }}
              >
                Energy Rhythms
              </h4>
              <div
                style={{
                  padding: "1rem",
                  background: "rgba(15,23,42,0.5)",
                  borderRadius: "0.5rem",
                }}
              >
                {formData.energy.map((energy) => (
                  <div
                    key={energy.id}
                    style={{
                      marginBottom: "0.5rem",
                      color: "#e5e7eb",
                      fontSize: "0.95rem",
                    }}
                  >
                    <strong>{energy.label}:</strong> {energy.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flags Summary */}
          {formData.flags.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h4
                style={{
                  fontSize: "1.1rem",
                  marginBottom: "0.75rem",
                  color: "#e5e7eb",
                }}
              >
                Life Context & Flags
              </h4>
              <div
                style={{
                  padding: "1rem",
                  background: "rgba(15,23,42,0.5)",
                  borderRadius: "0.5rem",
                }}
              >
                {formData.flags.map((flag) => (
                  <div
                    key={flag.id}
                    style={{
                      marginBottom: "0.5rem",
                      color: "#e5e7eb",
                      fontSize: "0.95rem",
                    }}
                  >
                    {flag.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Notes */}
          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "1.1rem",
                marginBottom: "0.75rem",
                color: "#e5e7eb",
              }}
            >
              Anything else you want to remember about where you are in life right now?
            </label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Optional notes..."
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                background: "rgba(15,23,42,0.8)",
                border: "1px solid rgba(148,163,184,0.3)",
                color: "#e5e7eb",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
            <Button variant="secondary" onClick={() => setStep(4)}>
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


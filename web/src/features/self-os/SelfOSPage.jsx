import React, { useState } from "react";
import { Card, Section, EmptyState, Button } from "../../components";
import SelfOSWizard from "./SelfOSWizard";
import { isProfileEmpty } from "./selfOsModel";

/**
 * Self OS Page - Core Identity & Inner World
 * 
 * Displays user's Self OS profile: values, traits, energy rhythms, and flags.
 * Based on docs/20_self_os_blueprint.md and docs/25_self_os_onboarding_spec.md
 */
export default function SelfOSPage() {
  const [profile, setProfile] = useState(null);
  const [showWizard, setShowWizard] = useState(false);

  const handleWizardComplete = (newProfile) => {
    setProfile(newProfile);
    setShowWizard(false);
  };

  const handleWizardCancel = () => {
    setShowWizard(false);
  };

  // Show wizard if requested
  if (showWizard) {
    return (
      <div className="page-container">
        <SelfOSWizard
          initialProfile={profile}
          onCancel={handleWizardCancel}
          onComplete={handleWizardComplete}
        />
      </div>
    );
  }

  // Empty state: no profile yet
  if (!profile || isProfileEmpty(profile)) {
    return (
      <div className="page-container">
        <Card>
          <h2 className="page-title">Self OS</h2>
          <p className="page-description">
            Your core identity: values, personality patterns, energy rhythms, and life context.
            This profile helps HumanOS understand who you are and how you operate.
          </p>

          <Section title="Profile Overview">
            <EmptyState
              title="You haven't set up your Self OS yet."
              description="Complete onboarding to build your Self OS profile. This will include your core values, personality patterns, and energy preferences. You can edit this later."
              action={
                <Button
                  variant="primary"
                  onClick={() => setShowWizard(true)}
                >
                  Start Self OS Setup
                </Button>
              }
            />
          </Section>
        </Card>
      </div>
    );
  }

  // Profile exists: show summary view
  const topValues = profile.values
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5);

  const chronotype = profile.energy.find((e) => e.id === "chronotype");
  const socialEnergy = profile.energy.find((e) => e.id === "social_energy");

  const activeFlags = profile.flags.filter((f) => f.active);
  const supportFlags = activeFlags.filter((f) => f.type === "identity" || f.type === "support");
  const riskFlags = activeFlags.filter((f) => f.type === "risk");

  return (
    <div className="page-container">
      <Card>
        <h2 className="page-title">Self OS</h2>
        <p className="page-description">
          Your core identity: values, personality patterns, energy rhythms, and life context.
          This profile helps HumanOS understand who you are and how you operate.
        </p>

        {/* Profile Overview Section */}
        <Section title="Profile Overview">
          {/* Top Values */}
          {topValues.length > 0 && (
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
                {topValues.map((value) => (
                  <div
                    key={value.id}
                    style={{
                      marginBottom: "0.5rem",
                      color: "#e5e7eb",
                      fontSize: "0.95rem",
                    }}
                  >
                    <strong>{value.rank}.</strong> {value.label}
                    {value.description && (
                      <span style={{ color: "#94a3b8", fontSize: "0.85rem", marginLeft: "0.5rem" }}>
                        – {value.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Traits Summary */}
          {profile.traits.length > 0 && (
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
                {profile.traits.map((trait) => {
                  const valueLabel =
                    trait.value === "low"
                      ? "More on the left side"
                      : trait.value === "high"
                      ? "More on the right side"
                      : "Somewhere in the middle";
                  return (
                    <div
                      key={trait.id}
                      style={{
                        marginBottom: "0.5rem",
                        color: "#e5e7eb",
                        fontSize: "0.95rem",
                      }}
                    >
                      <strong>{trait.label}:</strong> {valueLabel}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Energy Summary */}
          {(chronotype || socialEnergy) && (
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
                {chronotype && (
                  <div
                    style={{
                      marginBottom: "0.5rem",
                      color: "#e5e7eb",
                      fontSize: "0.95rem",
                    }}
                  >
                    <strong>Most focused:</strong> {chronotype.value}
                  </div>
                )}
                {socialEnergy && (
                  <div
                    style={{
                      color: "#e5e7eb",
                      fontSize: "0.95rem",
                    }}
                  >
                    <strong>Recharges:</strong> {socialEnergy.value}
                  </div>
                )}
              </div>
            </div>
          )}
        </Section>

        {/* Context & Flags Section */}
        {activeFlags.length > 0 && (
          <Section title="Context & Flags">
            {supportFlags.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <h4
                  style={{
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                    color: "#94a3b8",
                  }}
                >
                  Support / Identity
                </h4>
                <div
                  style={{
                    padding: "1rem",
                    background: "rgba(15,23,42,0.5)",
                    borderRadius: "0.5rem",
                  }}
                >
                  {supportFlags.map((flag) => (
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

            {riskFlags.length > 0 && (
              <div>
                <h4
                  style={{
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                    color: "#94a3b8",
                  }}
                >
                  Risk / Stress
                </h4>
                <div
                  style={{
                    padding: "1rem",
                    background: "rgba(15,23,42,0.5)",
                    borderRadius: "0.5rem",
                  }}
                >
                  {riskFlags.map((flag) => (
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
          </Section>
        )}

        {/* Optional Notes */}
        {profile.notes && (
          <Section title="Notes">
            <div
              style={{
                padding: "1rem",
                background: "rgba(15,23,42,0.5)",
                borderRadius: "0.5rem",
                color: "#e5e7eb",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {profile.notes}
            </div>
          </Section>
        )}

        {/* Actions */}
        <Section title="Actions">
          <Button
            variant="primary"
            onClick={() => setShowWizard(true)}
          >
            Review / Update Self OS
          </Button>
        </Section>
      </Card>
    </div>
  );
}

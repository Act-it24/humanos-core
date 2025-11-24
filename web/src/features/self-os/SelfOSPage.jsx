import React, { useState } from "react";
import { Card, Section, EmptyState, Button } from "../../components";
import SelfOSWizard from "./SelfOSWizard";
import SelfImageSection from "./SelfImageSection";
import {
  isProfileEmpty,
  calculatePercents,
  CHRONOTYPE_OPTIONS,
  DEFAULT_SOCIAL_ENERGY_LABELS,
  createEnergyProfile,
} from "./selfOsModel";

/**
 * Self OS Page - Core Identity & Inner World
 *
 * Displays the Self OS profile summary and hosts the onboarding wizard.
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
                <Button variant="primary" onClick={() => setShowWizard(true)}>
                  Start Self OS Setup
                </Button>
              }
            />
          </Section>
        </Card>
      </div>
    );
  }

  const coreValues = (profile.values || [])
    .filter((value) => value.priorityBand === "core")
    .sort((a, b) => (a.rank || 99) - (b.rank || 99));
  const supportingValues = (profile.values || []).filter((value) => value.priorityBand === "supporting");
  const personality = profile.personality || [];
  const energy = profile.energy || createEnergyProfile();
  const chronotypeLabel =
    CHRONOTYPE_OPTIONS.find((option) => option.value === energy.chronotype)?.label || "Mixed / It depends";
  const socialEnergyScore = energy.socialEnergy?.score ?? 50;
  const { percentLeft, percentRight } = calculatePercents(socialEnergyScore);
  const focusWindows = energy.focusWindows || [];

  const activeFlags = (profile.flags || []).filter((flag) => flag.isActive);
  const flagsByType = activeFlags.reduce(
    (acc, flag) => {
      acc[flag.type] = acc[flag.type] || [];
      acc[flag.type].push(flag);
      return acc;
    },
    { role: [], constraint: [], transition: [], other: [] }
  );

  return (
    <div className="page-container">
      <Card>
        <h2 className="page-title">Self OS</h2>
        <p className="page-description">
          Your core identity: values, personality patterns, energy rhythms, and life context.
          This profile helps HumanOS understand who you are and how you operate.
        </p>

        <Section title="Profile Overview">
          {coreValues.length > 0 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <h4 style={{ fontSize: "1.05rem", marginBottom: "0.5rem", color: "#e5e7eb" }}>
                Core values
              </h4>
              <div
                style={{
                  padding: "1rem",
                  background: "rgba(15,23,42,0.5)",
                  borderRadius: "0.65rem",
                  border: "1px solid rgba(148,163,184,0.25)",
                }}
              >
                {coreValues.map((value) => (
                  <div key={value.key} style={{ color: "#e5e7eb", marginBottom: "0.35rem" }}>
                    {value.rank ? `${value.rank}. ` : ""}
                    {value.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {supportingValues.length > 0 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <h4 style={{ fontSize: "1.05rem", marginBottom: "0.5rem", color: "#e5e7eb" }}>
                Supporting values
              </h4>
              <div
                style={{
                  padding: "0.9rem",
                  background: "rgba(15,23,42,0.5)",
                  borderRadius: "0.65rem",
                  border: "1px solid rgba(148,163,184,0.25)",
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {supportingValues.map((value) => (
                  <span
                    key={value.key}
                    style={{
                      padding: "0.4rem 0.7rem",
                      borderRadius: "0.55rem",
                      background: "rgba(59,130,246,0.12)",
                      color: "#e5e7eb",
                      fontSize: "0.9rem",
                      border: "1px solid rgba(96,165,250,0.35)",
                    }}
                  >
                    {value.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {personality.length > 0 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <h4 style={{ fontSize: "1.05rem", marginBottom: "0.5rem", color: "#e5e7eb" }}>
                Personality style
              </h4>
              <div
                style={{
                  padding: "0.9rem",
                  background: "rgba(15,23,42,0.5)",
                  borderRadius: "0.65rem",
                  border: "1px solid rgba(148,163,184,0.25)",
                  display: "grid",
                  gap: "0.45rem",
                }}
              >
                {personality.map((dim) => (
                  <div key={dim.key} style={{ color: "#e5e7eb", fontSize: "0.95rem" }}>
                    {dim.labelLeft} {dim.percentLeft}% - {dim.labelRight} {dim.percentRight}%
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: "1.25rem" }}>
            <h4 style={{ fontSize: "1.05rem", marginBottom: "0.5rem", color: "#e5e7eb" }}>Energy rhythms</h4>
            <div
              style={{
                padding: "0.9rem",
                background: "rgba(15,23,42,0.5)",
                borderRadius: "0.65rem",
                border: "1px solid rgba(148,163,184,0.25)",
                display: "grid",
                gap: "0.4rem",
              }}
            >
              <div style={{ color: "#e5e7eb" }}>Chronotype: {chronotypeLabel}</div>
              {focusWindows.length > 0 && (
                <div style={{ color: "#e5e7eb" }}>
                  Focus windows:
                  <ul style={{ paddingLeft: "1.2rem", marginTop: "0.35rem" }}>
                    {focusWindows.map((window, idx) => (
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
        </Section>

        <Section title="Life context & flags">
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
              <div key={typeKey} style={{ marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "1rem", marginBottom: "0.35rem", color: "#94a3b8" }}>
                  {labelMap[typeKey]}
                </h4>
                <div
                  style={{
                    padding: "0.9rem",
                    background: "rgba(15,23,42,0.5)",
                    borderRadius: "0.65rem",
                    border: "1px solid rgba(148,163,184,0.25)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.45rem",
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
          {activeFlags.length === 0 && (
            <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>No active flags selected.</div>
          )}
        </Section>

        {profile.notes && (
          <Section title="Notes">
            <div
              style={{
                padding: "1rem",
                background: "rgba(15,23,42,0.5)",
                borderRadius: "0.65rem",
                border: "1px solid rgba(148,163,184,0.25)",
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

        <SelfImageSection profile={profile} onUpdateProfile={setProfile} />

        <Section title="Actions">
          <Button variant="primary" onClick={() => setShowWizard(true)}>
            Review / Update Self OS
          </Button>
        </Section>
      </Card>
    </div>
  );
}

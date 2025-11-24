import React, { useMemo, useState } from "react";
import { Card, Section, EmptyState, Button, Modal } from "../../components";
import SelfOSWizard from "./SelfOSWizard";
import SelfImageSection from "./SelfImageSection";
import {
  isProfileEmpty,
  calculatePercents,
  CHRONOTYPE_OPTIONS,
  DEFAULT_SOCIAL_ENERGY_LABELS,
  createEnergyProfile,
} from "./selfOsModel";

function formatProfileStatus(profile) {
  const timestamp = profile?.updatedAt || profile?.createdAt;
  if (!timestamp) return "Profile saved locally";
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) return "Profile saved locally";
  const diffInDays = Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
  if (diffInDays <= 0) return "Profile updated today";
  if (diffInDays === 1) return "Profile updated 1 day ago";
  return `Profile updated ${diffInDays} days ago`;
}

export default function SelfOSPage() {
  const [profile, setProfile] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardInitialProfile, setWizardInitialProfile] = useState(null);

  const hasProfile = profile && !isProfileEmpty(profile);
  const profileStatusText = useMemo(() => formatProfileStatus(profile), [profile]);

  const openWizard = (initialProfile = null) => {
    setWizardInitialProfile(initialProfile);
    setIsWizardOpen(true);
  };

  const handleWizardComplete = (newProfile) => {
    setProfile(newProfile);
    setIsWizardOpen(false);
  };

  const handleWizardCancel = () => setIsWizardOpen(false);

  const coreValues = (profile?.values || [])
    .filter((value) => value.priorityBand === "core")
    .sort((a, b) => (a.rank || 99) - (b.rank || 99));
  const supportingValues = (profile?.values || []).filter((value) => value.priorityBand === "supporting");
  const personality = profile?.personality || [];
  const energy = profile?.energy || createEnergyProfile();
  const chronotypeLabel =
    CHRONOTYPE_OPTIONS.find((option) => option.value === energy.chronotype)?.label || "Mixed / It depends";
  const socialEnergyScore = energy.socialEnergy?.score ?? 50;
  const { percentLeft, percentRight } = calculatePercents(socialEnergyScore);
  const focusWindows = energy.focusWindows || [];

  const activeFlags = (profile?.flags || []).filter((flag) => flag.isActive);
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
      <Card style={{ maxWidth: "900px" }}>
        <h2 className="page-title">Self OS</h2>
        <p className="page-description">
          Your core identity: values, personality patterns, energy rhythms, and life context.
          This profile helps HumanOS understand who you are and how you operate.
        </p>
        <p style={{ color: "#94a3b8", marginTop: "0.75rem", lineHeight: 1.6 }}>
          Set up your core profile when you are ready, or jump straight into the assessments below to start
          exploring how you operate.
        </p>
      </Card>

      <Card style={{ maxWidth: "900px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.5rem" }}>
          <h3 style={{ fontSize: "1.35rem", margin: 0, color: "#e5e7eb" }}>Core Profile</h3>
          <p style={{ color: "#cbd5e1", lineHeight: 1.5 }}>
            Your values, patterns, energy and context. This powers HumanOS planning and suggestions.
          </p>
          {hasProfile && <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>{profileStatusText}</div>}
        </div>

        {!hasProfile && (
          <Section title="Profile Overview">
            <EmptyState
              title="You haven't set up your Self OS yet."
              description="Complete onboarding to build your Self OS profile. This will include your core values, personality patterns, and energy preferences. You can edit this later."
              action={
                <Button variant="primary" onClick={() => openWizard(profile || null)}>
                  Start Self OS setup
                </Button>
              }
            />
          </Section>
        )}

        {hasProfile && (
          <>
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
                <h4 style={{ fontSize: "1.05rem", marginBottom: "0.5rem", color: "#e5e7eb" }}>
                  Energy rhythms
                </h4>
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

            {profile?.notes && (
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

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="secondary" onClick={() => openWizard(profile)}>
                Review / update core profile
              </Button>
            </div>
          </>
        )}
      </Card>

      <Card style={{ maxWidth: "960px" }}>
        <SelfImageSection profile={profile} onUpdateProfile={setProfile} />
      </Card>

      <Modal isOpen={isWizardOpen} onClose={handleWizardCancel} title="Self OS setup">
        <SelfOSWizard
          initialProfile={wizardInitialProfile}
          onCancel={handleWizardCancel}
          onComplete={handleWizardComplete}
        />
      </Modal>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { Card, Section, EmptyState, Button } from "../../components";
import LifeMapWizard from "./LifeMapWizard";
import { isLifeMapEmpty } from "./lifeMapModel";

/**
 * Life Map Page - Goals, Domains & Projects
 *
 * Displays empty state, summary view, and hosts the onboarding wizard.
 */
export default function LifeMapPage() {
  const [lifeMap, setLifeMap] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // TODO: wire the real Self OS profile when shared state is available.
  const selfOsProfile = null;
  const horizonLabelMap = {
    "3_months": "Next 3 months",
    "6_months": "Next 6 months",
    "1_year": "Within a year",
    long_term: "Long term",
  };

  const hasLifeMap = lifeMap && !isLifeMapEmpty(lifeMap);
  const goalsByDomain = useMemo(() => {
    const map = {};
    (lifeMap?.goals || []).forEach((goal) => {
      if (!map[goal.domainId]) map[goal.domainId] = [];
      map[goal.domainId].push(goal);
    });
    return map;
  }, [lifeMap]);

  const projectsByGoal = useMemo(() => {
    const map = {};
    (lifeMap?.projects || []).forEach((project) => {
      map[project.goalId] = project;
    });
    return map;
  }, [lifeMap]);

  const renderDomainCard = (domain) => {
    const domainGoals = goalsByDomain[domain.id] || [];
    return (
      <div
        key={domain.id}
        style={{
          padding: "1rem",
          background: "rgba(15,23,42,0.55)",
          borderRadius: "0.9rem",
          border: "1px solid rgba(148,163,184,0.25)",
          display: "grid",
          gap: "0.65rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{domain.name}</div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {Number.isFinite(domain.currentScore) && (
              <span
                style={{
                  padding: "0.35rem 0.6rem",
                  borderRadius: "0.6rem",
                  background: "rgba(59,130,246,0.14)",
                  color: "#e5e7eb",
                  fontSize: "0.85rem",
                  border: "1px solid rgba(96,165,250,0.35)",
                }}
              >
                {domain.currentScore}/10
              </span>
            )}
            {domain.priority && (
              <span
                style={{
                  padding: "0.35rem 0.6rem",
                  borderRadius: "0.6rem",
                  background:
                    domain.priority === "high"
                      ? "rgba(52,211,153,0.12)"
                      : domain.priority === "medium"
                      ? "rgba(96,165,250,0.12)"
                      : "rgba(148,163,184,0.12)",
                  color: "#e5e7eb",
                  fontSize: "0.85rem",
                  border: "1px solid rgba(148,163,184,0.35)",
                }}
              >
                {domain.priority === "high" ? "High focus" : domain.priority === "medium" ? "Medium" : "Low"}
              </span>
            )}
          </div>
        </div>
        {domain.intention && (
          <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>{domain.intention}</div>
        )}
        {domainGoals.length > 0 && (
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {domainGoals.map((goal) => (
              <div
                key={goal.id}
                style={{
                  padding: "0.75rem",
                  background: "rgba(15,23,42,0.7)",
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(148,163,184,0.25)",
                  display: "grid",
                  gap: "0.35rem",
                }}
              >
                <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{goal.title}</div>
                {goal.horizon && (
                  <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                    Horizon: {horizonLabelMap[goal.horizon] || goal.horizon}
                  </div>
                )}
                {goal.linkedValues && goal.linkedValues.length > 0 && (
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {goal.linkedValues.map((value) => (
                      <span
                        key={value}
                        style={{
                          padding: "0.35rem 0.6rem",
                          borderRadius: "0.55rem",
                          background: "rgba(59,130,246,0.12)",
                          color: "#e5e7eb",
                          fontSize: "0.85rem",
                          border: "1px solid rgba(96,165,250,0.35)",
                        }}
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                )}
                {projectsByGoal[goal.id] && (
                  <div
                    style={{
                      padding: "0.65rem",
                      background: "rgba(15,23,42,0.65)",
                      borderRadius: "0.65rem",
                      border: "1px solid rgba(148,163,184,0.2)",
                      display: "grid",
                      gap: "0.3rem",
                    }}
                  >
                    <div style={{ color: "#e5e7eb", fontWeight: 600 }}>
                      Project: {projectsByGoal[goal.id].title || "Untitled project"}
                    </div>
                    {projectsByGoal[goal.id].description && (
                      <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                        {projectsByGoal[goal.id].description}
                      </div>
                    )}
                    {projectsByGoal[goal.id].firstSteps && projectsByGoal[goal.id].firstSteps.length > 0 && (
                      <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#cbd5e1", fontSize: "0.92rem" }}>
                        {projectsByGoal[goal.id].firstSteps.map((step, idx) => (
                          <li key={`${goal.id}-step-${idx}`} style={{ marginBottom: "0.25rem" }}>
                            {step}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Life Map OS (Domains, Goals & Projects)</h2>
      <p className="page-description">
        Map your life domains, focus areas, and meaningful goals. We keep this aligned with your Self OS values
        and context so planning stays realistic.
      </p>

      {isWizardOpen && (
        <LifeMapWizard
          initialLifeMap={lifeMap}
          selfOsProfile={selfOsProfile}
          onCancel={() => setIsWizardOpen(false)}
          onComplete={(updatedLifeMap) => {
            setLifeMap(updatedLifeMap);
            setIsWizardOpen(false);
          }}
        />
      )}

      {!isWizardOpen && (
        <Card>
          {!hasLifeMap ? (
            <>
              <Section title="Life Map Overview">
                <EmptyState
                  title="You haven't created a Life Map yet."
                  description="Life domains (Health, Work, Relationships, etc.) with goals and first projects help you see the bigger picture. Start with a quick wizard and adjust anytime."
                  action={
                    <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
                      Create My First Life Map
                    </Button>
                  }
                />
              </Section>
            </>
          ) : (
            <>
              <Section title="Domains, Goals & Projects">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {lifeMap.domains.map((domain) => renderDomainCard(domain))}
                </div>
              </Section>

              <Section title="Actions">
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
                    Review / Update Life Map
                  </Button>
                  <Button variant="secondary" disabled>
                    Send to Daily OS (coming soon)
                  </Button>
                </div>
              </Section>
            </>
          )}
        </Card>
      )}
    </div>
  );
}

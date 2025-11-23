import React, { useEffect, useMemo, useState } from "react";
import { Card, Button, Section } from "../../components";
import {
  buildLifeMapFromWizardState,
  hydrateWizardStateFromLifeMap,
  suggestDomainsFromSelfOs,
} from "./lifeMapModel";

const MIN_DOMAINS = 3;
const MAX_DOMAINS = 7;
const MAX_GOALS_PER_DOMAIN = 3;
const MAX_FIRST_STEPS = 5;
const WIZARD_STEP_COUNT = 6;

const HORIZON_OPTIONS = [
  { value: "3_months", label: "Next 3 months" },
  { value: "6_months", label: "Next 6 months" },
  { value: "1_year", label: "Within a year" },
  { value: "long_term", label: "Long term" },
];

const DEFAULT_VALUE_TAGS = [
  "Health",
  "Growth",
  "Creativity",
  "Security",
  "Connection",
  "Freedom",
  "Joy",
  "Impact",
];

const randomId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const ProgressLabel = ({ step }) => {
  if (step === 0) return null;
  return (
    <div
      style={{
        color: "#94a3b8",
        fontSize: "0.85rem",
        marginBottom: "0.35rem",
      }}
    >
      Step {step} of {WIZARD_STEP_COUNT}
    </div>
  );
};

const HelperText = ({ children }) => (
  <p
    style={{
      fontSize: "0.95rem",
      color: "#94a3b8",
      marginBottom: "0.75rem",
    }}
  >
    {children}
  </p>
);

/**
 * Life Map Onboarding Wizard (v0.1)
 * Mirrors the Self OS wizard feel; builds a LifeMap in memory.
 *
 * @param {Object} props
 * @param {import("./lifeMapModel").LifeMap|null} props.initialLifeMap
 * @param {import("../self-os/selfOsModel").SelfOsProfile|null} [props.selfOsProfile]
 * @param {Function} props.onCancel
 * @param {Function} props.onComplete
 */
export default function LifeMapWizard({
  initialLifeMap = null,
  selfOsProfile = null,
  onCancel,
  onComplete,
}) {
  const [step, setStep] = useState(0);
  const [wizardState, setWizardState] = useState(() => hydrateWizardStateFromLifeMap(initialLifeMap));
  const [newDomainName, setNewDomainName] = useState("");
  const [domainMessage, setDomainMessage] = useState("");
  const [focusMessage, setFocusMessage] = useState("");
  const [goalMessage, setGoalMessage] = useState("");

  useEffect(() => {
    setWizardState(hydrateWizardStateFromLifeMap(initialLifeMap));
    setStep(0);
    setNewDomainName("");
    setDomainMessage("");
    setFocusMessage("");
    setGoalMessage("");
  }, [initialLifeMap]);

  const suggestedDomains = useMemo(() => suggestDomainsFromSelfOs(selfOsProfile), [selfOsProfile]);
  const valueOptions = useMemo(() => {
    if (selfOsProfile?.values?.length) {
      return selfOsProfile.values.map((value) => value.label || value.key).filter(Boolean);
    }
    return DEFAULT_VALUE_TAGS;
  }, [selfOsProfile]);

  const domains = wizardState.domains || [];
  const goals = wizardState.goals || [];
  const projects = wizardState.projects || [];

  const focusDomains = domains.filter((domain) => domain.priority === "high");
  const updateDomains = (updater) => {
    setWizardState((prev) => ({ ...prev, domains: updater(prev.domains || []) }));
  };

  const updateGoals = (updater) => {
    setWizardState((prev) => ({ ...prev, goals: updater(prev.goals || []) }));
  };

  const updateProjects = (updater) => {
    setWizardState((prev) => ({ ...prev, projects: updater(prev.projects || []) }));
  };

  const normalizeName = (name) => (name || "").trim().toLowerCase();

  const addDomain = (name) => {
    if (!name || normalizeName(name).length === 0) return;
    if (domains.length >= MAX_DOMAINS) {
      setDomainMessage("You can keep up to 7 domains for now. You can refine later.");
      return;
    }
    const exists = domains.some((domain) => normalizeName(domain.name) === normalizeName(name));
    if (exists) return;

    const newDomain = {
      id: randomId("domain"),
      name: name.trim(),
      description: "",
      currentScore: undefined,
      intention: "",
      linkedValues: [],
      priority: undefined,
    };
    updateDomains((prev) => [...prev, newDomain]);
    setDomainMessage("");
  };

  const removeDomain = (domainId) => {
    const goalIdsToRemove = goals.filter((goal) => goal.domainId === domainId).map((goal) => goal.id);
    updateDomains((prev) => prev.filter((domain) => domain.id !== domainId));
    updateGoals((prev) => prev.filter((goal) => goal.domainId !== domainId));
    if (goalIdsToRemove.length) {
      updateProjects((prev) => prev.filter((project) => !goalIdsToRemove.includes(project.goalId)));
    }
  };

  const toggleSuggestedDomain = (name) => {
    const existing = domains.find((domain) => normalizeName(domain.name) === normalizeName(name));
    if (existing) {
      removeDomain(existing.id);
      return;
    }
    addDomain(name);
  };

  const updateDomainField = (domainId, field, value) => {
    updateDomains((prev) =>
      prev.map((domain) => (domain.id === domainId ? { ...domain, [field]: value } : domain))
    );
  };

  const handlePriorityChange = (domainId, priority) => {
    const goalIdsToRemove = goals.filter((goal) => goal.domainId === domainId).map((goal) => goal.id);
    updateDomains((prev) =>
      prev.map((domain) =>
        domain.id === domainId
          ? {
              ...domain,
              priority,
            }
          : domain
      )
    );

    if (priority !== "high") {
      updateGoals((prev) => prev.filter((goal) => goal.domainId !== domainId));
      if (goalIdsToRemove.length) {
        updateProjects((prev) => prev.filter((project) => !goalIdsToRemove.includes(project.goalId)));
      }
    }
  };
  const addGoalForDomain = (domainId) => {
    const domainGoals = goals.filter((goal) => goal.domainId === domainId);
    if (domainGoals.length >= MAX_GOALS_PER_DOMAIN) {
      setGoalMessage("Try to keep 1-3 goals per focus domain for now.");
      return;
    }
    const newGoal = {
      id: randomId("goal"),
      domainId,
      title: "",
      description: "",
      horizon: "6_months",
      linkedValues: [],
      status: "idea",
    };
    updateGoals((prev) => [...prev, newGoal]);
    setGoalMessage("");
  };

  const updateGoalField = (goalId, field, value) => {
    updateGoals((prev) => prev.map((goal) => (goal.id === goalId ? { ...goal, [field]: value } : goal)));
  };

  const toggleGoalValue = (goalId, value) => {
    updateGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;
        const current = goal.linkedValues || [];
        if (current.includes(value)) {
          return { ...goal, linkedValues: current.filter((val) => val !== value) };
        }
        return { ...goal, linkedValues: [...current, value] };
      })
    );
  };

  const removeGoal = (goalId) => {
    updateGoals((prev) => prev.filter((goal) => goal.id !== goalId));
    updateProjects((prev) => prev.filter((project) => project.goalId !== goalId));
  };

  const getGoalsForDomain = (domainId) => goals.filter((goal) => goal.domainId === domainId);

  const getProjectForGoal = (goalId) => projects.find((project) => project.goalId === goalId);

  const addProjectForGoal = (goalId) => {
    if (getProjectForGoal(goalId)) return;
    const project = {
      id: randomId("project"),
      goalId,
      title: "",
      description: "",
      firstSteps: [],
      status: "idea",
    };
    updateProjects((prev) => [...prev, project]);
  };

  const updateProjectField = (projectId, field, value) => {
    updateProjects((prev) =>
      prev.map((project) => (project.id === projectId ? { ...project, [field]: value } : project))
    );
  };

  const updateProjectStep = (projectId, index, value) => {
    updateProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const steps = Array.isArray(project.firstSteps) ? [...project.firstSteps] : [];
        if (index < 0 || index >= MAX_FIRST_STEPS) return project;
        steps[index] = value;
        return { ...project, firstSteps: steps };
      })
    );
  };

  const addProjectStep = (projectId) => {
    updateProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const steps = Array.isArray(project.firstSteps) ? [...project.firstSteps] : [];
        if (steps.length >= MAX_FIRST_STEPS) return project;
        return { ...project, firstSteps: [...steps, ""] };
      })
    );
  };

  const removeProject = (projectId) => {
    updateProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

  const domainsWithinBounds = domains.length >= MIN_DOMAINS && domains.length <= MAX_DOMAINS;
  const highFocusCount = focusDomains.length;
  const canMovePastFocus = domainsWithinBounds && highFocusCount >= 1;

  const canMovePastGoals = () => {
    if (!focusDomains.length) return false;
    const hasGoalForEach = focusDomains.every((domain) =>
      goals.some((goal) => goal.domainId === domain.id && (goal.title || "").trim().length > 0)
    );
    return hasGoalForEach;
  };

  const goToGoalsStep = () => {
    if (!canMovePastFocus) {
      setFocusMessage("Pick at least one High focus domain to continue.");
      return;
    }
    focusDomains.forEach((domain) => {
      const domainGoals = getGoalsForDomain(domain.id);
      if (domainGoals.length === 0) {
        addGoalForDomain(domain.id);
      }
    });
    setStep(4);
  };

  const goToProjectsStep = () => {
    if (!canMovePastGoals()) {
      setGoalMessage("Add at least one goal title for each High focus domain.");
      return;
    }
    setGoalMessage("");
    setStep(5);
  };

  const handleSaveLifeMap = () => {
    const lifeMap = buildLifeMapFromWizardState(wizardState, initialLifeMap);
    onComplete(lifeMap);
  };

  const renderDomainChip = (name) => {
    const isSelected = domains.some((domain) => normalizeName(domain.name) === normalizeName(name));
    const reachedMax = domains.length >= MAX_DOMAINS && !isSelected;
    return (
      <button
        key={name}
        onClick={() => toggleSuggestedDomain(name)}
        disabled={reachedMax}
        style={{
          padding: "0.75rem 1rem",
          borderRadius: "0.75rem",
          border: isSelected ? "2px solid rgba(96,165,250,0.9)" : "1px solid rgba(148,163,184,0.35)",
          background: isSelected ? "rgba(59,130,246,0.14)" : "rgba(15,23,42,0.65)",
          color: "#e5e7eb",
          cursor: reachedMax ? "not-allowed" : "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.25rem" }}>
          {isSelected ? "Selected" : "Tap to include"}
        </div>
      </button>
    );
  };

  // --- Step screens ---
  if (step === 0) {
    const hasExistingMap = Boolean(initialLifeMap);
    return (
      <Card>
        <Section title={hasExistingMap ? "Review your Life Map" : "What is your Life Map?"}>
          <p
            style={{
              fontSize: "0.98rem",
              lineHeight: 1.7,
              color: "#e5e7eb",
              marginBottom: "1.5rem",
            }}
          >
            Your Life Map is a calm, honest view of your domains, goals, and first projects. It connects what you do
            with what matters to you. You can adjust everything later.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="primary" onClick={() => setStep(1)}>
              {hasExistingMap ? "Start Life Map Review" : "Start Life Map Setup"}
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
        <Section title="Suggest & Choose Life Domains">
          <HelperText>
            Choose 3-7 domains that cover your life right now. We suggest some based on Self OS, but you can edit anything.
          </HelperText>
          {domainMessage && (
            <div style={{ color: "#fbbf24", marginBottom: "0.5rem", fontSize: "0.92rem" }}>{domainMessage}</div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "0.75rem",
              marginBottom: "1.25rem",
            }}
          >
            {suggestedDomains.map((name) => renderDomainChip(name))}
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "0.75rem",
            }}
          >
            <input
              type="text"
              placeholder="Add a custom domain"
              value={newDomainName}
              onChange={(e) => setNewDomainName(e.target.value)}
              style={{
                flex: "1 1 260px",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                background: "rgba(15,23,42,0.85)",
                border: "1px solid rgba(148,163,184,0.35)",
                color: "#e5e7eb",
              }}
            />
            <Button
              variant="secondary"
              onClick={() => {
                addDomain(newDomainName);
                setNewDomainName("");
              }}
              disabled={!newDomainName || domains.length >= MAX_DOMAINS}
            >
              Add
            </Button>
          </div>
          <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "1rem" }}>
            Keep it simple: aim for 3-7 domains.
          </div>

          {domains.length > 0 && (
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "0.75rem",
                    alignItems: "center",
                    background: "rgba(15,23,42,0.6)",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(148,163,184,0.25)",
                    padding: "0.75rem",
                  }}
                >
                  <input
                    type="text"
                    value={domain.name}
                    onChange={(e) => updateDomainField(domain.id, "name", e.target.value)}
                    style={{
                      padding: "0.65rem",
                      borderRadius: "0.6rem",
                      background: "rgba(15,23,42,0.85)",
                      border: "1px solid rgba(148,163,184,0.3)",
                      color: "#e5e7eb",
                    }}
                  />
                  <Button variant="ghost" onClick={() => removeDomain(domain.id)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              marginTop: "1.25rem",
            }}
          >
            <Button variant="secondary" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(2)} disabled={!domainsWithinBounds}>
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
        <Section title="Quick Domain Health Check">
          <HelperText>Give each domain a quick 1-10 pulse check. Add a short note if helpful.</HelperText>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {domains.map((domain) => {
              const score = Number.isFinite(domain.currentScore) ? domain.currentScore : 6;
              return (
                <div
                  key={domain.id}
                  style={{
                    padding: "1rem",
                    background: "rgba(15,23,42,0.6)",
                    borderRadius: "0.85rem",
                    border: "1px solid rgba(148,163,184,0.25)",
                    display: "grid",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{domain.name}</div>
                    <span
                      style={{
                        padding: "0.35rem 0.7rem",
                        borderRadius: "0.65rem",
                        background: "rgba(59,130,246,0.14)",
                        color: "#e5e7eb",
                        fontSize: "0.9rem",
                        border: "1px solid rgba(96,165,250,0.35)",
                      }}
                    >
                      {score}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={score}
                    onChange={(e) => updateDomainField(domain.id, "currentScore", Number(e.target.value))}
                  />
                  <input
                    type="text"
                    placeholder="One sentence about how this area feels right now (optional)"
                    value={domain.description || ""}
                    onChange={(e) => updateDomainField(domain.id, "description", e.target.value)}
                    style={{
                      padding: "0.7rem",
                      borderRadius: "0.65rem",
                      background: "rgba(15,23,42,0.85)",
                      border: "1px solid rgba(148,163,184,0.3)",
                      color: "#e5e7eb",
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              marginTop: "1.25rem",
            }}
          >
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(3)}>
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
        <Section title="Choose Focus Domains & Intentions">
          <HelperText>
            Pick 1-3 domains as High focus for the next few months. Add a short intention for each.
          </HelperText>
          {focusMessage && (
            <div style={{ color: "#fbbf24", marginBottom: "0.5rem", fontSize: "0.92rem" }}>{focusMessage}</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {domains.map((domain) => (
              <div
                key={domain.id}
                style={{
                  padding: "1rem",
                  background: "rgba(15,23,42,0.6)",
                  borderRadius: "0.85rem",
                  border: "1px solid rgba(148,163,184,0.25)",
                  display: "grid",
                  gap: "0.7rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{domain.name}</div>
                    {Number.isFinite(domain.currentScore) && (
                      <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                        Current score: {domain.currentScore}/10
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    {["high", "medium", "low"].map((priority) => {
                      const isSelected = domain.priority === priority;
                      return (
                        <button
                          key={priority}
                          onClick={() => handlePriorityChange(domain.id, priority)}
                          style={{
                            padding: "0.5rem 0.85rem",
                            borderRadius: "0.65rem",
                            border: isSelected
                              ? "2px solid rgba(96,165,250,0.9)"
                              : "1px solid rgba(148,163,184,0.3)",
                            background: isSelected ? "rgba(59,130,246,0.16)" : "rgba(15,23,42,0.65)",
                            color: "#e5e7eb",
                            cursor: "pointer",
                          }}
                        >
                          {priority === "high" ? "High" : priority === "medium" ? "Medium" : "Low"}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <textarea
                  value={domain.intention || ""}
                  onChange={(e) => updateDomainField(domain.id, "intention", e.target.value)}
                  placeholder="Intention for this domain (optional)"
                  style={{
                    width: "100%",
                    minHeight: "70px",
                    padding: "0.75rem",
                    borderRadius: "0.7rem",
                    background: "rgba(15,23,42,0.85)",
                    border: "1px solid rgba(148,163,184,0.3)",
                    color: "#e5e7eb",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.75rem" }}>
            It is okay to care about many things, but focusing on 1-3 domains helps you stay realistic.
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              marginTop: "1.25rem",
            }}
          >
            <Button variant="secondary" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button variant="primary" onClick={goToGoalsStep}>
              Next
            </Button>
          </div>
        </Section>
      </Card>
    );
  }
  if (step === 4) {
    const focusIds = new Set(focusDomains.map((domain) => domain.id));
    const totalGoals = goals.filter((goal) => focusIds.has(goal.domainId));
    return (
      <Card>
        <ProgressLabel step={step} />
        <Section title="Define Key Goals for Focus Domains">
          <HelperText>
            For each High focus domain, add 1-3 goals. Keep it real and aligned with your values. Placeholders are okay.
          </HelperText>
          {goalMessage && (
            <div style={{ color: "#fbbf24", marginBottom: "0.5rem", fontSize: "0.92rem" }}>{goalMessage}</div>
          )}
          {focusDomains.length === 0 && (
            <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              Choose at least one High focus domain to add goals.
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {focusDomains.map((domain) => {
              const domainGoals = getGoalsForDomain(domain.id);
              return (
                <div
                  key={domain.id}
                  style={{
                    padding: "1rem",
                    background: "rgba(15,23,42,0.6)",
                    borderRadius: "0.85rem",
                    border: "1px solid rgba(148,163,184,0.25)",
                    display: "grid",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ color: "#e5e7eb", fontWeight: 600 }}>
                    {domain.name}
                    {domain.intention && (
                      <span style={{ color: "#94a3b8", fontWeight: 400, marginLeft: "0.5rem" }}>
                        — {domain.intention}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    {domainGoals.map((goal) => (
                      <div
                        key={goal.id}
                        style={{
                          padding: "0.9rem",
                          background: "rgba(15,23,42,0.75)",
                          borderRadius: "0.8rem",
                          border: "1px solid rgba(148,163,184,0.25)",
                          display: "grid",
                          gap: "0.65rem",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <input
                            type="text"
                            placeholder="Goal title (required)"
                            value={goal.title}
                            onChange={(e) => updateGoalField(goal.id, "title", e.target.value)}
                            style={{
                              padding: "0.65rem",
                              borderRadius: "0.65rem",
                              background: "rgba(15,23,42,0.85)",
                              border: "1px solid rgba(148,163,184,0.3)",
                              color: "#e5e7eb",
                              flex: 1,
                            }}
                          />
                          <Button variant="ghost" onClick={() => removeGoal(goal.id)}>
                            Remove
                          </Button>
                        </div>
                        <textarea
                          placeholder="Optional description or success criteria"
                          value={goal.description || ""}
                          onChange={(e) => updateGoalField(goal.id, "description", e.target.value)}
                          style={{
                            width: "100%",
                            minHeight: "70px",
                            padding: "0.7rem",
                            borderRadius: "0.7rem",
                            background: "rgba(15,23,42,0.85)",
                            border: "1px solid rgba(148,163,184,0.3)",
                            color: "#e5e7eb",
                            fontFamily: "inherit",
                            resize: "vertical",
                          }}
                        />
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "0.75rem",
                          }}
                        >
                          <div>
                            <div style={{ color: "#94a3b8", marginBottom: "0.35rem", fontSize: "0.9rem" }}>
                              Horizon (optional)
                            </div>
                            <select
                              value={goal.horizon || ""}
                              onChange={(e) => updateGoalField(goal.id, "horizon", e.target.value)}
                              style={{
                                width: "100%",
                                padding: "0.6rem",
                                borderRadius: "0.6rem",
                                background: "rgba(15,23,42,0.85)",
                                border: "1px solid rgba(148,163,184,0.3)",
                                color: "#e5e7eb",
                              }}
                            >
                              <option value="">No horizon</option>
                              {HORIZON_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <div style={{ color: "#94a3b8", marginBottom: "0.35rem", fontSize: "0.9rem" }}>
                              Linked values (optional)
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                              }}
                            >
                              {valueOptions.map((value) => {
                                const isSelected = (goal.linkedValues || []).includes(value);
                                return (
                                  <button
                                    key={value}
                                    onClick={() => toggleGoalValue(goal.id, value)}
                                    style={{
                                      padding: "0.45rem 0.65rem",
                                      borderRadius: "0.65rem",
                                      border: isSelected
                                        ? "2px solid rgba(96,165,250,0.9)"
                                        : "1px solid rgba(148,163,184,0.35)",
                                      background: isSelected
                                        ? "rgba(59,130,246,0.14)"
                                        : "rgba(15,23,42,0.65)",
                                      color: "#e5e7eb",
                                      cursor: "pointer",
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    {value}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Button variant="secondary" onClick={() => addGoalForDomain(domain.id)}>
                      Add goal
                    </Button>
                    <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                      {domainGoals.length}/{MAX_GOALS_PER_DOMAIN} goals
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {totalGoals.length === 0 && (
            <div style={{ color: "#94a3b8", fontSize: "0.95rem", marginTop: "0.75rem" }}>
              Add at least one goal before moving on.
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              marginTop: "1.25rem",
            }}
          >
            <Button variant="secondary" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button variant="primary" onClick={goToProjectsStep}>
              Next
            </Button>
          </div>
        </Section>
      </Card>
    );
  }
  if (step === 5) {
    const focusIds = new Set(focusDomains.map((domain) => domain.id));
    const focusGoals = goals.filter((goal) => focusIds.has(goal.domainId));
    return (
      <Card>
        <ProgressLabel step={step} />
        <Section title="Optional First Projects & Next Steps">
          <HelperText>
            You can skip this for now. If helpful, add one project per goal and a few first steps.
          </HelperText>

          {focusGoals.length === 0 && (
            <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              Add at least one goal to see project suggestions.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {focusGoals.map((goal) => {
              const project = getProjectForGoal(goal.id);
              return (
                <div
                  key={goal.id}
                  style={{
                    padding: "1rem",
                    background: "rgba(15,23,42,0.6)",
                    borderRadius: "0.85rem",
                    border: "1px solid rgba(148,163,184,0.25)",
                    display: "grid",
                    gap: "0.7rem",
                  }}
                >
                  <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{goal.title || "Untitled goal"}</div>
                  {!project && (
                    <Button variant="secondary" onClick={() => addProjectForGoal(goal.id)}>
                      Add a first project (optional)
                    </Button>
                  )}

                  {project && (
                    <div
                      style={{
                        padding: "0.9rem",
                        background: "rgba(15,23,42,0.75)",
                        borderRadius: "0.8rem",
                        border: "1px solid rgba(148,163,184,0.25)",
                        display: "grid",
                        gap: "0.65rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <input
                          type="text"
                          placeholder="Project title"
                          value={project.title}
                          onChange={(e) => updateProjectField(project.id, "title", e.target.value)}
                          style={{
                            padding: "0.65rem",
                            borderRadius: "0.65rem",
                            background: "rgba(15,23,42,0.85)",
                            border: "1px solid rgba(148,163,184,0.3)",
                            color: "#e5e7eb",
                            flex: 1,
                          }}
                        />
                        <Button variant="ghost" onClick={() => removeProject(project.id)}>
                          Remove
                        </Button>
                      </div>
                      <textarea
                        placeholder="Optional description for this project"
                        value={project.description || ""}
                        onChange={(e) => updateProjectField(project.id, "description", e.target.value)}
                        style={{
                          width: "100%",
                          minHeight: "70px",
                          padding: "0.7rem",
                          borderRadius: "0.7rem",
                          background: "rgba(15,23,42,0.85)",
                          border: "1px solid rgba(148,163,184,0.3)",
                          color: "#e5e7eb",
                          fontFamily: "inherit",
                          resize: "vertical",
                        }}
                      />
                      <div>
                        <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "0.35rem" }}>
                          First steps (up to 5)
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          {(project.firstSteps || []).map((stepValue, index) => (
                            <input
                              key={`${project.id}-step-${index}`}
                              type="text"
                              value={stepValue}
                              onChange={(e) => updateProjectStep(project.id, index, e.target.value)}
                              placeholder="First step"
                              style={{
                                padding: "0.65rem",
                                borderRadius: "0.65rem",
                                background: "rgba(15,23,42,0.85)",
                                border: "1px solid rgba(148,163,184,0.3)",
                                color: "#e5e7eb",
                              }}
                            />
                          ))}
                        </div>
                        <div style={{ marginTop: "0.6rem" }}>
                          <Button
                            variant="secondary"
                            onClick={() => addProjectStep(project.id)}
                            disabled={(project.firstSteps || []).length >= MAX_FIRST_STEPS}
                          >
                            Add step
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              marginTop: "1.25rem",
            }}
          >
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
    const previewLifeMap = buildLifeMapFromWizardState(wizardState, initialLifeMap);
    const domainsById = previewLifeMap.domains.reduce((acc, domain) => {
      acc[domain.id] = domain;
      return acc;
    }, {});
    const goalsByDomain = previewLifeMap.goals.reduce((acc, goal) => {
      acc[goal.domainId] = acc[goal.domainId] || [];
      acc[goal.domainId].push(goal);
      return acc;
    }, {});
    const projectsByGoal = previewLifeMap.projects.reduce((acc, project) => {
      acc[project.goalId] = project;
      return acc;
    }, {});

    return (
      <Card>
        <ProgressLabel step={step} />
        <Section title="Summary & Confirmation">
          <HelperText>Here is your Life Map snapshot. You can go back and edit anything.</HelperText>

          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <h4 style={{ color: "#e5e7eb", marginBottom: "0.4rem" }}>Domains Overview</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {previewLifeMap.domains.map((domain) => (
                  <div
                    key={domain.id}
                    style={{
                      padding: "0.9rem",
                      background: "rgba(15,23,42,0.6)",
                      borderRadius: "0.75rem",
                      border: "1px solid rgba(148,163,184,0.25)",
                      display: "grid",
                      gap: "0.35rem",
                    }}
                  >
                    <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{domain.name}</div>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
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
                          {domain.priority === "high"
                            ? "High focus"
                            : domain.priority === "medium"
                            ? "Medium"
                            : "Low"}
                        </span>
                      )}
                    </div>
                    {domain.intention && (
                      <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{domain.intention}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ color: "#e5e7eb", marginBottom: "0.4rem" }}>Goals per Domain</h4>
              {previewLifeMap.goals.length === 0 ? (
                <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>No goals added yet.</div>
              ) : (
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {Object.entries(goalsByDomain).map(([domainId, domainGoals]) => {
                    const domain = domainsById[domainId];
                    return (
                      <div
                        key={domainId}
                        style={{
                          padding: "0.9rem",
                          background: "rgba(15,23,42,0.6)",
                          borderRadius: "0.75rem",
                          border: "1px solid rgba(148,163,184,0.25)",
                          display: "grid",
                          gap: "0.5rem",
                        }}
                      >
                        <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{domain?.name || "Domain"}</div>
                        <div style={{ display: "grid", gap: "0.6rem" }}>
                          {domainGoals.map((goal) => (
                            <div
                              key={goal.id}
                              style={{
                                padding: "0.75rem",
                                background: "rgba(15,23,42,0.75)",
                                borderRadius: "0.7rem",
                                border: "1px solid rgba(148,163,184,0.25)",
                                display: "grid",
                                gap: "0.35rem",
                              }}
                            >
                              <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{goal.title}</div>
                              {goal.horizon && (
                                <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                                  Horizon: {HORIZON_OPTIONS.find((opt) => opt.value === goal.horizon)?.label || goal.horizon}
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
                                    marginTop: "0.35rem",
                                    padding: "0.7rem",
                                    background: "rgba(15,23,42,0.7)",
                                    borderRadius: "0.65rem",
                                    border: "1px solid rgba(148,163,184,0.2)",
                                    display: "grid",
                                    gap: "0.35rem",
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
                                  {projectsByGoal[goal.id].firstSteps && (
                                    <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#cbd5e1", fontSize: "0.93rem" }}>
                                      {projectsByGoal[goal.id].firstSteps.map((stepText, idx) => (
                                        <li key={`${goal.id}-step-${idx}`} style={{ marginBottom: "0.25rem" }}>
                                          {stepText}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <p style={{ color: "#94a3b8", fontSize: "0.93rem", marginTop: "0.75rem" }}>
            Life Map links back to your Self OS values so plans stay aligned.
          </p>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginTop: "1.25rem",
            }}
          >
            <Button variant="primary" onClick={handleSaveLifeMap}>
              Save Life Map
            </Button>
            <Button variant="secondary" onClick={() => setStep(5)}>
              Back & Edit
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              Cancel without saving
            </Button>
          </div>
        </Section>
      </Card>
    );
  }

  return null;
}

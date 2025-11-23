import React, { useEffect, useMemo, useState } from "react";
import { Card, Section, Button } from "../../components";
import {
  createDailyTask,
  createEmptyDailyPlan,
  cloneDailyPlanWithUpdates,
} from "./dailyOsModel";

const SEGMENTS = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
  { key: "flex", label: "Flex" },
];

const INTENSITY_OPTIONS = [
  { value: "", label: "Pick intensity" },
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "deep", label: "Deep" },
];

const LOCATION_OPTIONS = [
  { value: "", label: "Location (optional)" },
  { value: "home", label: "Home" },
  { value: "office", label: "Office" },
  { value: "outside", label: "Outside" },
  { value: "mixed", label: "Mixed" },
];

const TASK_SOURCE_OPTIONS = [
  { value: "manual", label: "Manual" },
  { value: "maintenance", label: "Maintenance" },
];

const defaultSegmentState = () => ({
  use: false,
  id: undefined,
  label: "",
  intensity: "",
  domainId: "",
  goalId: "",
  projectId: "",
  locationType: "",
  note: "",
});

/**
 * Daily OS Planning Wizard (v0.1)
 *
 * @param {Object} props
 * @param {string} props.date ISO date string for the plan (YYYY-MM-DD)
 * @param {import("./dailyOsModel").DailyPlan|null} props.initialDailyPlan
 * @param {import("../self-os/selfOsModel").SelfOsProfile|null} props.selfOsProfile
 * @param {import("../life-map/lifeMapModel").LifeMap|null} props.lifeMap
 * @param {Function} props.onCancel
 * @param {Function} props.onComplete
 */
export default function DailyOSWizard({
  date,
  initialDailyPlan = null,
  selfOsProfile = null,
  lifeMap = null,
  onCancel,
  onComplete,
}) {
  const [step, setStep] = useState(0);
  const [focusTitle, setFocusTitle] = useState("");
  const [energyNote, setEnergyNote] = useState("");
  const [segmentBlocks, setSegmentBlocks] = useState({
    morning: defaultSegmentState(),
    afternoon: defaultSegmentState(),
    evening: defaultSegmentState(),
    flex: defaultSegmentState(),
  });
  const [selectedGoalIds, setSelectedGoalIds] = useState([]);
  const [goalTaskOverrides, setGoalTaskOverrides] = useState({});
  const [otherTasks, setOtherTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSource, setNewTaskSource] = useState("manual");

  useEffect(() => {
    hydrateFromPlan(initialDailyPlan);
    setStep(0);
  }, [initialDailyPlan, date]);

  const domains = lifeMap?.domains || [];
  const goals = lifeMap?.goals || [];

  const suggestedFocusChips = useMemo(() => {
    if (!domains || domains.length === 0) return [];
    const highPriority = domains.filter((domain) => domain.priority === "high").map((d) => d.name);
    if (highPriority.length > 0) return highPriority.slice(0, 3);
    return domains.slice(0, 3).map((d) => d.name);
  }, [domains]);

  const selfOsHint = useMemo(() => {
    if (!selfOsProfile?.energy) return "";
    const chronotype = selfOsProfile.energy.chronotype;
    if (chronotype === "evening") {
      return "You're a Night Owl — consider placing your deeper work later in the day.";
    }
    if (chronotype === "morning") {
      return "Morning type — protect your early blocks for deep work before distractions arrive.";
    }
    if (chronotype === "afternoon") {
      return "You peak in the afternoon — schedule demanding tasks in that window.";
    }
    if (chronotype === "mixed") {
      return "Mixed rhythm — anchor deep work to your stated focus windows when possible.";
    }
    return "";
  }, [selfOsProfile]);

  const goalSelectionCount = selectedGoalIds.length;
  const totalTasksCount = goalSelectionCount + otherTasks.length;

  const handleToggleGoal = (goalId) => {
    if (selectedGoalIds.includes(goalId)) {
      setSelectedGoalIds(selectedGoalIds.filter((id) => id !== goalId));
      return;
    }
    setSelectedGoalIds([...selectedGoalIds, goalId]);
  };

  const handleSegmentToggle = (key) => {
    setSegmentBlocks({
      ...segmentBlocks,
      [key]: {
        ...segmentBlocks[key],
        use: !segmentBlocks[key].use,
        label: segmentBlocks[key].label || `${capitalize(key)} focus`,
      },
    });
  };

  const updateSegmentField = (key, field, value) => {
    const nextState = { ...segmentBlocks[key], [field]: value };
    if (field === "domainId" && value !== segmentBlocks[key].domainId) {
      nextState.goalId = "";
    }
    setSegmentBlocks({
      ...segmentBlocks,
      [key]: nextState,
    });
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = createDailyTask({
      title: newTaskTitle.trim(),
      source: newTaskSource,
    });
    setOtherTasks([...otherTasks, newTask]);
    setNewTaskTitle("");
    setNewTaskSource("manual");
  };

  const handleUpdateOtherTask = (id, field, value) => {
    setOtherTasks(
      otherTasks.map((task) => (task.id === id ? { ...task, [field]: value } : task))
    );
  };

  const handleRemoveOtherTask = (id) => {
    setOtherTasks(otherTasks.filter((task) => task.id !== id));
  };

  const selectedGoalTasks = useMemo(() => {
    const lookup = goals.reduce((acc, goal) => {
      acc[goal.id] = goal;
      return acc;
    }, {});

    return selectedGoalIds.map((goalId) => {
      const goal = lookup[goalId];
      const existing = goalTaskOverrides[goalId];
      const title = existing?.title || (goal ? `Progress on: ${goal.title}` : "Goal task");
      const domainId = existing?.domainId || goal?.domainId;
      return createDailyTask({
        ...existing,
        title,
        goalId,
        domainId,
        source: "life_goal",
      });
    });
  }, [goals, selectedGoalIds, goalTaskOverrides]);

  const filteredGoalsByDomain = (domainId) =>
    goals.filter((goal) => !domainId || goal.domainId === domainId);

  const hydrateFromPlan = (plan) => {
    if (!plan) {
      setFocusTitle("");
      setEnergyNote("");
      setSegmentBlocks({
        morning: defaultSegmentState(),
        afternoon: defaultSegmentState(),
        evening: defaultSegmentState(),
        flex: defaultSegmentState(),
      });
      setSelectedGoalIds([]);
      setGoalTaskOverrides({});
      setOtherTasks([]);
      return;
    }

    const nextSegments = {
      morning: defaultSegmentState(),
      afternoon: defaultSegmentState(),
      evening: defaultSegmentState(),
      flex: defaultSegmentState(),
    };

    (plan.focusBlocks || []).forEach((block) => {
      if (!block?.segment || !nextSegments[block.segment]) return;
      nextSegments[block.segment] = {
        use: true,
        id: block.id,
        label: block.label || `${capitalize(block.segment)} focus`,
        intensity: block.intensity || "",
        domainId: block.domainId || "",
        goalId: block.goalId || "",
        projectId: block.projectId || "",
        locationType: block.locationType || "",
        note: block.note || "",
      };
    });

    const goalTasks = [];
    const other = [];

    (plan.tasks || []).forEach((task) => {
      if (task?.source === "life_goal" && task.goalId) {
        goalTasks.push(task);
      } else {
        other.push(task);
      }
    });

    const goalOverrides = goalTasks.reduce((acc, task) => {
      acc[task.goalId] = task;
      return acc;
    }, {});

    setFocusTitle(plan.focusTitle || "");
    setEnergyNote(plan.energyNote || "");
    setSegmentBlocks(nextSegments);
    setSelectedGoalIds(goalTasks.map((task) => task.goalId));
    setGoalTaskOverrides(goalOverrides);
    setOtherTasks(other);
  };

  const buildAndSavePlan = () => {
    const focusBlocks = SEGMENTS.map((segment) => ({ key: segment.key, data: segmentBlocks[segment.key] }))
      .filter((entry) => entry.data.use)
      .map((entry) => {
        const block = entry.data;
        const label = block.label?.trim() || `${capitalize(entry.key)} focus`;
        return {
          id: block.id || `block-${entry.key}-${Math.random().toString(36).slice(2, 8)}`,
          label,
          segment: entry.key,
          domainId: block.domainId || undefined,
          goalId: block.goalId || undefined,
          projectId: block.projectId || undefined,
          intensity: block.intensity || undefined,
          locationType: block.locationType || undefined,
          note: block.note?.trim() || undefined,
        };
      });

    const tasks = [...selectedGoalTasks, ...otherTasks].map((task) =>
      createDailyTask({
        ...task,
        title: (task.title || "").trim(),
      })
    );

    const cleanedFocusTitle = focusTitle.trim() || undefined;
    const cleanedEnergyNote = energyNote.trim() || undefined;

    const plan = initialDailyPlan
      ? cloneDailyPlanWithUpdates(initialDailyPlan, {
          date,
          focusTitle: cleanedFocusTitle,
          energyNote: cleanedEnergyNote,
          focusBlocks,
          tasks,
        })
      : {
          ...createEmptyDailyPlan(date),
          focusTitle: cleanedFocusTitle,
          energyNote: cleanedEnergyNote,
          focusBlocks,
          tasks,
        };

    onComplete(plan);
  };

  const renderStepActions = (options = {}) => (
    <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between", marginTop: "1.5rem" }}>
      <Button variant="secondary" onClick={options.onBack || onCancel}>
        {options.backLabel || "Back"}
      </Button>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        {options.showCancelLink && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button variant="primary" onClick={options.onNext}>
          {options.nextLabel || "Next"}
        </Button>
      </div>
    </div>
  );

  if (step === 0) {
    return (
      <Card>
        <Section title="Plan Today">
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#e5e7eb",
              marginBottom: "1rem",
            }}
          >
            Connect Self OS and Life Map to what you want to do today. This is a flexible outline, not a
            rigid calendar. You can edit it anytime.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Button variant="primary" onClick={() => setStep(1)}>
              Start planning
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Section>
      </Card>
    );
  }

  if (step === 1) {
    return (
      <Card>
        <Section title="Today's focus">
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "0.9rem" }}>
            Pick a simple tagline for what today is about. Aim for realistic focus that ties to your Life
            Map. Example: "Deep work + health + 1 admin block".
          </p>
          <input
            type="text"
            value={focusTitle}
            onChange={(e) => setFocusTitle(e.target.value)}
            placeholder="Example: Deep work + health + 1 admin block"
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "0.75rem",
              background: "rgba(15,23,42,0.85)",
              border: "1px solid rgba(148,163,184,0.35)",
              color: "#e5e7eb",
              marginBottom: "0.9rem",
              fontSize: "1rem",
            }}
          />
          {suggestedFocusChips.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                Suggestions from your Life Map
              </div>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                {suggestedFocusChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setFocusTitle(focusTitle ? `${focusTitle} | ${chip}` : chip)}
                    style={{
                      padding: "0.55rem 0.9rem",
                      borderRadius: "0.75rem",
                      border: "1px solid rgba(96,165,250,0.5)",
                      background: "rgba(59,130,246,0.12)",
                      color: "#e5e7eb",
                      cursor: "pointer",
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "0.35rem" }}>
              Energy / constraints for today (optional)
            </div>
            <textarea
              value={energyNote}
              onChange={(e) => setEnergyNote(e.target.value)}
              placeholder="Example: Low sleep, keep morning light. Protect one deep block."
              style={{
                width: "100%",
                minHeight: "90px",
                padding: "0.85rem",
                borderRadius: "0.75rem",
                background: "rgba(15,23,42,0.85)",
                border: "1px solid rgba(148,163,184,0.35)",
                color: "#e5e7eb",
                fontSize: "0.95rem",
                resize: "vertical",
              }}
            />
          </div>
          {selfOsHint && (
            <div
              style={{
                padding: "0.75rem",
                background: "rgba(59,130,246,0.12)",
                borderRadius: "0.75rem",
                border: "1px solid rgba(96,165,250,0.35)",
                color: "#cbd5e1",
                fontSize: "0.95rem",
              }}
            >
              {selfOsHint}
            </div>
          )}
          {renderStepActions({
            onBack: () => setStep(0),
            onNext: () => setStep(2),
            backLabel: "Back",
            nextLabel: "Next",
          })}
        </Section>
      </Card>
    );
  }

  if (step === 2) {
    return (
      <Card>
        <Section title="Focus blocks">
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "1rem" }}>
            Choose 2–4 blocks for the day. Start with Morning, Afternoon, Evening, and a flexible slot.
          </p>
          <div style={{ display: "grid", gap: "1rem" }}>
            {SEGMENTS.map((segment) => {
              const block = segmentBlocks[segment.key];
              const goalOptions = filteredGoalsByDomain(block.domainId || "");
              return (
                <div
                  key={segment.key}
                  style={{
                    padding: "1rem",
                    background: "rgba(15,23,42,0.65)",
                    borderRadius: "1rem",
                    border: "1px solid rgba(148,163,184,0.25)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{segment.label}</div>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1" }}>
                      <input
                        type="checkbox"
                        checked={block.use}
                        onChange={() => handleSegmentToggle(segment.key)}
                        style={{ width: "1.05rem", height: "1.05rem" }}
                      />
                      Use this segment today
                    </label>
                  </div>
                  {block.use && (
                    <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
                      <input
                        type="text"
                        value={block.label}
                        onChange={(e) => updateSegmentField(segment.key, "label", e.target.value)}
                        placeholder={`${segment.label} focus label`}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          borderRadius: "0.7rem",
                          background: "rgba(15,23,42,0.85)",
                          border: "1px solid rgba(148,163,184,0.3)",
                          color: "#e5e7eb",
                        }}
                      />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
                        <select
                          value={block.intensity}
                          onChange={(e) => updateSegmentField(segment.key, "intensity", e.target.value)}
                          style={{
                            padding: "0.7rem",
                            borderRadius: "0.7rem",
                            background: "rgba(15,23,42,0.85)",
                            border: "1px solid rgba(148,163,184,0.3)",
                            color: "#e5e7eb",
                          }}
                        >
                          {INTENSITY_OPTIONS.map((option) => (
                            <option key={option.value || "none"} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={block.locationType}
                          onChange={(e) => updateSegmentField(segment.key, "locationType", e.target.value)}
                          style={{
                            padding: "0.7rem",
                            borderRadius: "0.7rem",
                            background: "rgba(15,23,42,0.85)",
                            border: "1px solid rgba(148,163,184,0.3)",
                            color: "#e5e7eb",
                          }}
                        >
                          {LOCATION_OPTIONS.map((option) => (
                            <option key={option.value || "none"} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
                        <select
                          value={block.domainId}
                          onChange={(e) => updateSegmentField(segment.key, "domainId", e.target.value)}
                          style={{
                            padding: "0.7rem",
                            borderRadius: "0.7rem",
                            background: "rgba(15,23,42,0.85)",
                            border: "1px solid rgba(148,163,184,0.3)",
                            color: "#e5e7eb",
                          }}
                        >
                          <option value="">Link domain (optional)</option>
                          {domains.map((domain) => (
                            <option key={domain.id} value={domain.id}>
                              {domain.name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={block.goalId}
                          onChange={(e) => updateSegmentField(segment.key, "goalId", e.target.value)}
                          style={{
                            padding: "0.7rem",
                            borderRadius: "0.7rem",
                            background: "rgba(15,23,42,0.85)",
                            border: "1px solid rgba(148,163,184,0.3)",
                            color: "#e5e7eb",
                          }}
                        >
                          <option value="">Goal link (optional)</option>
                          {goalOptions.map((goal) => (
                            <option key={goal.id} value={goal.id}>
                              {goal.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        value={block.note}
                        onChange={(e) => updateSegmentField(segment.key, "note", e.target.value)}
                        placeholder="Notes for this block (prep, constraints, break reminders)"
                        style={{
                          width: "100%",
                          minHeight: "70px",
                          padding: "0.75rem",
                          borderRadius: "0.7rem",
                          background: "rgba(15,23,42,0.85)",
                          border: "1px solid rgba(148,163,184,0.3)",
                          color: "#e5e7eb",
                          resize: "vertical",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {selfOsProfile?.energy?.focusWindows?.length > 0 && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.8rem",
                borderRadius: "0.8rem",
                background: "rgba(52,211,153,0.12)",
                border: "1px solid rgba(52,211,153,0.35)",
                color: "#d1fae5",
              }}
            >
              Based on your focus windows ({selfOsProfile.energy.focusWindows
                .map((window) => `${window.label}: ${window.startTime}-${window.endTime}`)
                .join(", ")}), try placing at least one deep block there.
            </div>
          )}
          {renderStepActions({
            onBack: () => setStep(1),
            onNext: () => setStep(3),
          })}
        </Section>
      </Card>
    );
  }

  if (step === 3) {
    return (
      <Card>
        <Section title="Tasks for today">
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "1rem" }}>
            Aim for 3–7 tasks. Pull a couple from goals, then add supporting or maintenance items.
          </p>
          {goals.length > 0 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <h4 style={{ color: "#e5e7eb", marginBottom: "0.5rem" }}>From your goals</h4>
              <div style={{ display: "grid", gap: "0.65rem" }}>
                {goals.map((goal) => {
                  const domainName = domains.find((d) => d.id === goal.domainId)?.name;
                  const isChecked = selectedGoalIds.includes(goal.id);
                  return (
                    <label
                      key={goal.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem",
                        background: "rgba(15,23,42,0.65)",
                        borderRadius: "0.75rem",
                        border: "1px solid rgba(148,163,184,0.25)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleGoal(goal.id)}
                        style={{ width: "1.05rem", height: "1.05rem" }}
                      />
                      <div>
                        <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{goal.title}</div>
                        {domainName && (
                          <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Domain: {domainName}</div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginBottom: "1.25rem" }}>
            <h4 style={{ color: "#e5e7eb", marginBottom: "0.5rem" }}>Other tasks & maintenance</h4>
            <div style={{ display: "grid", gap: "0.6rem", marginBottom: "0.75rem" }}>
              {otherTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr auto",
                    gap: "0.6rem",
                    alignItems: "center",
                    padding: "0.75rem",
                    background: "rgba(15,23,42,0.65)",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(148,163,184,0.25)",
                  }}
                >
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleUpdateOtherTask(task.id, "title", e.target.value)}
                    placeholder="Task title"
                    style={{
                      padding: "0.65rem",
                      borderRadius: "0.65rem",
                      background: "rgba(15,23,42,0.85)",
                      border: "1px solid rgba(148,163,184,0.3)",
                      color: "#e5e7eb",
                    }}
                  />
                  <select
                    value={task.source || "manual"}
                    onChange={(e) => handleUpdateOtherTask(task.id, "source", e.target.value)}
                    style={{
                      padding: "0.65rem",
                      borderRadius: "0.65rem",
                      background: "rgba(15,23,42,0.85)",
                      border: "1px solid rgba(148,163,184,0.3)",
                      color: "#e5e7eb",
                    }}
                  >
                    {TASK_SOURCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Button variant="ghost" onClick={() => handleRemoveOtherTask(task.id)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr auto",
                gap: "0.6rem",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a task"
                style={{
                  padding: "0.65rem",
                  borderRadius: "0.65rem",
                  background: "rgba(15,23,42,0.85)",
                  border: "1px solid rgba(148,163,184,0.3)",
                  color: "#e5e7eb",
                }}
              />
              <select
                value={newTaskSource}
                onChange={(e) => setNewTaskSource(e.target.value)}
                style={{
                  padding: "0.65rem",
                  borderRadius: "0.65rem",
                  background: "rgba(15,23,42,0.85)",
                  border: "1px solid rgba(148,163,184,0.3)",
                  color: "#e5e7eb",
                }}
              >
                {TASK_SOURCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button variant="secondary" onClick={handleAddTask}>
                Add
              </Button>
            </div>
          </div>
          <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            You currently have {totalTasksCount} tasks selected.
          </div>
          {renderStepActions({
            onBack: () => setStep(2),
            onNext: () => setStep(4),
          })}
        </Section>
      </Card>
    );
  }

  if (step === 4) {
    const focusBlocks = SEGMENTS.map((segment) => ({ key: segment.key, data: segmentBlocks[segment.key] }))
      .filter((entry) => entry.data.use)
      .map((entry) => ({
        ...entry.data,
        segment: entry.key,
      }));

    return (
      <Card>
        <Section title="Summary & confirm">
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <div style={{ color: "#94a3b8", marginBottom: "0.35rem" }}>Date</div>
              <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{date}</div>
            </div>
            <div>
              <div style={{ color: "#94a3b8", marginBottom: "0.35rem" }}>Focus</div>
              <div style={{ color: "#e5e7eb" }}>{focusTitle || "No focus set"}</div>
              {energyNote && (
                <div style={{ color: "#cbd5e1", marginTop: "0.35rem" }}>Energy note: {energyNote}</div>
              )}
            </div>
            <div>
              <div style={{ color: "#94a3b8", marginBottom: "0.35rem" }}>Focus blocks</div>
              {focusBlocks.length === 0 ? (
                <div style={{ color: "#cbd5e1" }}>No blocks defined.</div>
              ) : (
                <div style={{ display: "grid", gap: "0.65rem" }}>
                  {focusBlocks.map((block) => (
                    <div
                      key={block.id || block.segment}
                      style={{
                        padding: "0.8rem",
                        background: "rgba(15,23,42,0.6)",
                        borderRadius: "0.8rem",
                        border: "1px solid rgba(148,163,184,0.25)",
                        display: "grid",
                        gap: "0.25rem",
                      }}
                    >
                      <div style={{ color: "#e5e7eb", fontWeight: 600 }}>
                        {capitalize(block.segment)} — {block.label || "Untitled block"}
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                        {block.intensity ? `Intensity: ${capitalize(block.intensity)}` : "No intensity set"}
                        {block.domainId && (
                          <span style={{ marginLeft: "0.75rem" }}>Domain linked</span>
                        )}
                        {block.goalId && <span style={{ marginLeft: "0.75rem" }}>Goal linked</span>}
                      </div>
                      {block.note && <div style={{ color: "#cbd5e1" }}>{block.note}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div style={{ color: "#94a3b8", marginBottom: "0.35rem" }}>Tasks</div>
              {totalTasksCount === 0 ? (
                <div style={{ color: "#cbd5e1" }}>No tasks added.</div>
              ) : (
                <>
                  {selectedGoalTasks.length > 0 && (
                    <div style={{ marginBottom: "0.6rem" }}>
                      <div style={{ color: "#e5e7eb", fontWeight: 600, marginBottom: "0.35rem" }}>
                        From goals
                      </div>
                      <div style={{ display: "grid", gap: "0.4rem" }}>
                        {selectedGoalTasks.map((task) => (
                          <div key={task.id} style={{ color: "#cbd5e1" }}>
                            {task.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {otherTasks.length > 0 && (
                    <div>
                      <div style={{ color: "#e5e7eb", fontWeight: 600, marginBottom: "0.35rem" }}>
                        Other
                      </div>
                      <div style={{ display: "grid", gap: "0.4rem" }}>
                        {otherTasks.map((task) => (
                          <div key={task.id} style={{ color: "#cbd5e1" }}>
                            {task.title} {task.source ? `(${task.source})` : ""}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              marginTop: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <Button variant="secondary" onClick={() => setStep(3)}>
              Back & Edit
            </Button>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Button variant="ghost" onClick={onCancel}>
                Cancel without saving
              </Button>
              <Button variant="primary" onClick={buildAndSavePlan}>
                Save Today's Plan
              </Button>
            </div>
          </div>
        </Section>
      </Card>
    );
  }

  return null;
}

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

import React, { useMemo, useState } from "react";
import { Card, Section, EmptyState, Button } from "../../components";
import DailyOSWizard from "./DailyOSWizard";
import {
  buildWeeklyPlanFromDailyPlans,
  cloneDailyPlanWithUpdates,
  getWeekStartForDate,
  isDailyPlanEmpty,
} from "./dailyOsModel";

const SEGMENT_ORDER = ["morning", "afternoon", "evening", "flex"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MS_IN_DAY = 24 * 60 * 60 * 1000;

const getTodayIsoDate = () => new Date().toISOString().slice(0, 10);

const parseIsoDate = (iso) => {
  if (!iso) return null;
  const parts = iso.split("-").map((part) => Number(part));
  if (parts.length !== 3) return null;
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
};

export default function DailyOSPage() {
  const [dailyPlansByDate, setDailyPlansByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(getTodayIsoDate());
  const [viewMode, setViewMode] = useState("today");
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // TODO: pull real Self OS profile and Life Map when shared state is available.
  const selfOsProfile = null;
  const lifeMap = null;

  const todayPlan = dailyPlansByDate[selectedDate] || null;
  const hasTodayPlan = todayPlan && !isDailyPlanEmpty(todayPlan);

  const weekStartDate = getWeekStartForDate(selectedDate);

  const weeklyPlan = useMemo(() => {
    const plans = Object.values(dailyPlansByDate);
    return buildWeeklyPlanFromDailyPlans(weekStartDate, plans);
  }, [dailyPlansByDate, weekStartDate]);

  const weeklyFocusDomains = useMemo(() => {
    return (weeklyPlan.focusDomains || []).map(
      (domainId) =>
        lifeMap?.domains?.find((domain) => domain.id === domainId)?.name || domainId
    );
  }, [weeklyPlan, lifeMap]);

  const weekDates = useMemo(() => {
    const startDate = parseIsoDate(weekStartDate);
    if (!startDate) return [];
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startDate.getTime() + index * MS_IN_DAY);
      const iso = date.toISOString().slice(0, 10);
      const label = `${DAY_NAMES[date.getUTCDay()]} ${date.getUTCDate()}`;
      return {
        iso,
        label,
        plan: dailyPlansByDate[iso] || null,
      };
    });
  }, [weekStartDate, dailyPlansByDate]);

  const handleTaskStatusChange = (taskId, status) => {
    if (!todayPlan) return;
    setDailyPlansByDate((prev) => {
      const plan = prev[selectedDate];
      if (!plan) return prev;
      const updatedTasks = (plan.tasks || []).map((task) =>
        task.id === taskId ? { ...task, status } : task
      );
      const updatedPlan = cloneDailyPlanWithUpdates(plan, { tasks: updatedTasks });
      return {
        ...prev,
        [selectedDate]: updatedPlan,
      };
    });
  };

  const handleSelectDay = (iso) => {
    setSelectedDate(iso);
    setViewMode("today");
  };

  const handleWizardComplete = (plan) => {
    setDailyPlansByDate((prev) => ({
      ...prev,
      [plan.date]: plan,
    }));
    setSelectedDate(plan.date);
    setViewMode("today");
    setIsWizardOpen(false);
  };

  const focusBlocks = useMemo(() => {
    if (!todayPlan?.focusBlocks) return [];
    const orderMap = SEGMENT_ORDER.reduce((acc, key, idx) => {
      acc[key] = idx;
      return acc;
    }, {});
    return [...todayPlan.focusBlocks].sort(
      (a, b) => (orderMap[a.segment] ?? 99) - (orderMap[b.segment] ?? 99)
    );
  }, [todayPlan]);

  const tasksFromGoals = (todayPlan?.tasks || []).filter((task) => task.source === "life_goal");
  const otherTasks = (todayPlan?.tasks || []).filter((task) => task.source !== "life_goal");

  const renderTaskRow = (task) => (
    <div
      key={task.id}
      style={{
        padding: "0.75rem",
        background: "rgba(15,23,42,0.6)",
        borderRadius: "0.75rem",
        border: "1px solid rgba(148,163,184,0.25)",
        display: "grid",
        gap: "0.35rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{task.title || "Untitled task"}</div>
        <span
          style={{
            padding: "0.25rem 0.6rem",
            borderRadius: "0.5rem",
            border: "1px solid rgba(96,165,250,0.35)",
            color: "#cbd5e1",
            fontSize: "0.85rem",
          }}
        >
          {task.status || "todo"}
        </span>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
          {task.source === "life_goal" ? "From goal" : "Task"}
        </div>
        <select
          value={task.status}
          onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
          style={{
            padding: "0.45rem 0.6rem",
            borderRadius: "0.6rem",
            background: "rgba(15,23,42,0.85)",
            border: "1px solid rgba(148,163,184,0.35)",
            color: "#e5e7eb",
          }}
        >
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
          <option value="skipped">Skipped</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <h2 className="page-title">Daily OS (Today & This Week)</h2>
      <p className="page-description">
        Plan realistic days and weeks that respect your energy and Life Map priorities. Start with a simple
        Today plan, then glance at the week to see coverage.
      </p>

      {isWizardOpen ? (
        <DailyOSWizard
          date={selectedDate}
          initialDailyPlan={todayPlan}
          selfOsProfile={selfOsProfile}
          lifeMap={lifeMap}
          onCancel={() => setIsWizardOpen(false)}
          onComplete={handleWizardComplete}
        />
      ) : (
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                variant={viewMode === "today" ? "primary" : "secondary"}
                onClick={() => setViewMode("today")}
              >
                Today
              </Button>
              <Button
                variant={viewMode === "week" ? "primary" : "secondary"}
                onClick={() => setViewMode("week")}
              >
                This Week
              </Button>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ color: "#cbd5e1" }}>{selectedDate}</span>
              <Button variant="secondary" onClick={() => setIsWizardOpen(true)}>
                {hasTodayPlan ? "Update today's plan" : "Plan today"}
              </Button>
            </div>
          </div>

          {viewMode === "today" ? (
            <>
              <Section title="Today's Focus">
                {!hasTodayPlan ? (
                  <EmptyState
                    title="No plan for today yet"
                    description="Create a short plan for today. Keep it light: 2-4 focus blocks and a handful of tasks."
                    action={
                      <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
                        Plan Today
                      </Button>
                    }
                  />
                ) : (
                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    <div style={{ color: "#e5e7eb", fontSize: "1.05rem", fontWeight: 600 }}>
                      {todayPlan.focusTitle || "No focus set"}
                    </div>
                    {todayPlan.energyNote && (
                      <div style={{ color: "#cbd5e1" }}>Energy note: {todayPlan.energyNote}</div>
                    )}
                    <Button variant="secondary" onClick={() => setIsWizardOpen(true)}>
                      Replan / edit today
                    </Button>
                  </div>
                )}
              </Section>

              {hasTodayPlan && (
                <>
                  <Section title="Focus blocks">
                    {focusBlocks.length === 0 ? (
                      <div style={{ color: "#94a3b8" }}>No focus blocks defined.</div>
                    ) : (
                      <div style={{ display: "grid", gap: "0.75rem" }}>
                        {focusBlocks.map((block) => (
                          <div
                            key={block.id}
                            style={{
                              padding: "0.9rem",
                              background: "rgba(15,23,42,0.6)",
                              borderRadius: "0.9rem",
                              border: "1px solid rgba(148,163,184,0.25)",
                              display: "grid",
                              gap: "0.35rem",
                            }}
                          >
                            <div style={{ color: "#e5e7eb", fontWeight: 600 }}>
                              {capitalize(block.segment)} — {block.label}
                            </div>
                            <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                              {block.intensity ? `Intensity: ${capitalize(block.intensity)}` : "No intensity set"}
                              {block.locationType && ` • Location: ${capitalize(block.locationType)}`}
                            </div>
                            {block.note && <div style={{ color: "#cbd5e1" }}>{block.note}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </Section>

                  <Section title="Tasks">
                    {tasksFromGoals.length === 0 && otherTasks.length === 0 ? (
                      <div style={{ color: "#94a3b8" }}>No tasks added for today.</div>
                    ) : (
                      <div style={{ display: "grid", gap: "1rem" }}>
                        {tasksFromGoals.length > 0 && (
                          <div>
                            <div style={{ color: "#e5e7eb", fontWeight: 600, marginBottom: "0.5rem" }}>
                              From goals
                            </div>
                            <div style={{ display: "grid", gap: "0.6rem" }}>
                              {tasksFromGoals.map((task) => renderTaskRow(task))}
                            </div>
                          </div>
                        )}
                        {otherTasks.length > 0 && (
                          <div>
                            <div style={{ color: "#e5e7eb", fontWeight: 600, marginBottom: "0.5rem" }}>
                              Other
                            </div>
                            <div style={{ display: "grid", gap: "0.6rem" }}>
                              {otherTasks.map((task) => renderTaskRow(task))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Section>
                </>
              )}
            </>
          ) : (
            <>
              <Section title="This Week">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "0.75rem",
                  }}
                >
                  {weekDates.map((day) => {
                    const planned = day.plan && !isDailyPlanEmpty(day.plan);
                    return (
                      <button
                        key={day.iso}
                        onClick={() => handleSelectDay(day.iso)}
                        style={{
                          padding: "0.85rem",
                          borderRadius: "0.9rem",
                          background: planned ? "rgba(59,130,246,0.14)" : "rgba(15,23,42,0.65)",
                          border: "1px solid rgba(148,163,184,0.25)",
                          color: "#e5e7eb",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>{day.label}</div>
                        <div style={{ color: "#cbd5e1", marginTop: "0.25rem" }}>
                          {planned ? "Planned" : "Not planned"}
                        </div>
                        {!planned && (
                          <div style={{ marginTop: "0.35rem", color: "#94a3b8", fontSize: "0.9rem" }}>
                            Set plan
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Section>

              <Section title="Weekly focus">
                {weeklyFocusDomains.length === 0 ? (
                  <div style={{ color: "#94a3b8" }}>
                    No linked domains yet. Plans tied to Life Map will show up here.
                  </div>
                ) : (
                  <div style={{ color: "#cbd5e1" }}>
                    This week you're focusing on: {weeklyFocusDomains.join(", ")}.
                  </div>
                )}
              </Section>
            </>
          )}
        </Card>
      )}
    </div>
  );
}

const capitalize = (value = "") => value.charAt(0).toUpperCase() + value.slice(1);

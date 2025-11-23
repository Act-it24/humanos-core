import React, { useEffect, useMemo, useState } from "react";
import { Card, Section, EmptyState, Button } from "../../components";
import {
  createJournalEntry,
  createMoodSnapshot,
  getDaySummaries,
  getEntriesForDate,
  getMainMoodForDate,
} from "./journalModel";

const moodScoreOptions = [
  { value: 1, label: "Very rough" },
  { value: 2, label: "Low" },
  { value: 3, label: "In the middle" },
  { value: 4, label: "Good" },
  { value: 5, label: "Great" },
];

const primaryEmotionOptions = [
  "Calm",
  "Anxious",
  "Sad",
  "Grateful",
  "Excited",
  "Tired",
  "Overwhelmed",
  "Curious",
];

const contextTagOptions = ["Work", "Family", "Health", "Money", "Social", "Creativity"];
const energyLevelOptions = ["very_low", "low", "medium", "high", "very_high"];
const tensionLevelOptions = ["relaxed", "neutral", "tense"];

const getTodayIsoDate = () => new Date().toISOString().slice(0, 10);

const buildMoodFormState = (snapshot) => ({
  moodScore: snapshot?.moodScore || 3,
  primaryEmotion: snapshot?.primaryEmotion || "",
  secondaryEmotions: snapshot?.secondaryEmotions || [],
  energyLevel: snapshot?.energyLevel || "",
  tensionLevel: snapshot?.tensionLevel || "",
  contextTags: snapshot?.contextTags || [],
  note: snapshot?.note || "",
});

const buildEntryFormState = (hasMood) => ({
  title: "",
  content: "",
  tagsText: "",
  attachMood: Boolean(hasMood),
});

export default function JournalMoodPage() {
  const [journalState, setJournalState] = useState({ moodSnapshots: [], entries: [] });
  const [activeView, setActiveView] = useState("today");
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [expandedEntryIds, setExpandedEntryIds] = useState([]);
  const [moodForm, setMoodForm] = useState(buildMoodFormState(null));
  const [entryForm, setEntryForm] = useState(buildEntryFormState(false));

  const today = getTodayIsoDate();
  const todaysMood = getMainMoodForDate(journalState, today);
  const todaysEntries = getEntriesForDate(journalState, today);
  const daySummaries = getDaySummaries(journalState);

  const selectedDayMood = selectedHistoryDate
    ? getMainMoodForDate(journalState, selectedHistoryDate)
    : undefined;
  const selectedDayEntries = selectedHistoryDate
    ? getEntriesForDate(journalState, selectedHistoryDate)
    : [];

  useEffect(() => {
    if (!selectedHistoryDate && daySummaries.length > 0) {
      setSelectedHistoryDate(daySummaries[0].date);
    }
  }, [daySummaries, selectedHistoryDate]);

  const handleToggleArrayValue = (key, value) => {
    setMoodForm((prev) => {
      const existing = prev[key] || [];
      const next = existing.includes(value)
        ? existing.filter((item) => item !== value)
        : [...existing, value];
      return { ...prev, [key]: next };
    });
  };

  const parseTags = (text) =>
    text
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

  const resetMoodForm = (snapshot) => {
    setMoodForm(buildMoodFormState(snapshot));
    setShowMoodForm(true);
  };

  const resetEntryForm = () => {
    setEntryForm(buildEntryFormState(Boolean(todaysMood)));
    setShowEntryForm(true);
  };

  const handleSaveMood = (event) => {
    event.preventDefault();
    if (!moodForm.moodScore || !moodForm.primaryEmotion) return;
    const snapshot = createMoodSnapshot({
      moodScore: moodForm.moodScore,
      primaryEmotion: moodForm.primaryEmotion,
      secondaryEmotions: moodForm.secondaryEmotions,
      energyLevel: moodForm.energyLevel || undefined,
      tensionLevel: moodForm.tensionLevel || undefined,
      contextTags: moodForm.contextTags,
      note: moodForm.note,
    });
    setJournalState((prev) => ({
      ...prev,
      moodSnapshots: [...prev.moodSnapshots, snapshot],
    }));
    setShowMoodForm(false);
  };

  const handleSaveEntry = (event) => {
    event.preventDefault();
    if (!entryForm.content.trim()) return;
    const tags = parseTags(entryForm.tagsText || "");
    const entry = createJournalEntry({
      title: entryForm.title?.trim(),
      content: entryForm.content.trim(),
      moodSnapshotId: entryForm.attachMood && todaysMood ? todaysMood.id : undefined,
      tags,
    });
    setJournalState((prev) => ({
      ...prev,
      entries: [entry, ...prev.entries],
    }));
    setEntryForm(buildEntryFormState(Boolean(todaysMood)));
    setShowEntryForm(false);
  };

  const toggleEntryExpansion = (entryId) => {
    setExpandedEntryIds((prev) =>
      prev.includes(entryId) ? prev.filter((id) => id !== entryId) : [...prev, entryId]
    );
  };

  const historyList = useMemo(
    () =>
      daySummaries.map((summary) => {
        const dateLabel = formatDate(summary.date);
        const hasMood = Boolean(summary.mainMoodSnapshot);
        return {
          ...summary,
          dateLabel,
          hasMood,
        };
      }),
    [daySummaries]
  );

  return (
    <div className="page-container">
      <h2 className="page-title">Journal & Mood OS</h2>
      <p className="page-description">
        A private space to log how you feel and capture what is on your mind. Track moods, jot quick
        reflections, and look back at how days felt.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <Button
          variant={activeView === "today" ? "primary" : "secondary"}
          onClick={() => setActiveView("today")}
        >
          Today
        </Button>
        <Button
          variant={activeView === "history" ? "primary" : "secondary"}
          onClick={() => setActiveView("history")}
        >
          History
        </Button>
      </div>

      {activeView === "today" ? (
        <>
          <Card>
            <Section title={!todaysMood ? "How are you feeling today?" : "Today's mood"}>
              {!todaysMood && !showMoodForm && (
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <p style={{ color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
                    This is a private space to track your mood and capture what is on your mind. There are
                    no right or wrong answers.
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <Button variant="primary" onClick={() => resetMoodForm(null)}>
                      Log Today&apos;s Mood
                    </Button>
                    <Button variant="secondary" onClick={() => resetEntryForm()}>
                      Write a journal entry
                    </Button>
                  </div>
                </div>
              )}

              {todaysMood && !showMoodForm && (
                <div
                  style={{
                    display: "grid",
                    gap: "0.6rem",
                    padding: "1rem",
                    borderRadius: "0.9rem",
                    border: "1px solid rgba(148,163,184,0.25)",
                    background: "rgba(15,23,42,0.65)",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <MoodBadge score={todaysMood.moodScore} />
                    <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{todaysMood.primaryEmotion}</div>
                  </div>
                  {todaysMood.note && (
                    <div style={{ color: "#cbd5e1" }}>Note: {todaysMood.note}</div>
                  )}
                  <Button variant="secondary" onClick={() => resetMoodForm(todaysMood)}>
                    Update today&apos;s mood
                  </Button>
                </div>
              )}

              {showMoodForm && (
                <form onSubmit={handleSaveMood} style={{ display: "grid", gap: "0.9rem" }}>
                  <div>
                    <div style={{ color: "#cbd5e1", marginBottom: "0.5rem" }}>Mood level</div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {moodScoreOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setMoodForm((prev) => ({ ...prev, moodScore: option.value }))}
                          style={{
                            padding: "0.65rem 0.9rem",
                            borderRadius: "0.7rem",
                            border:
                              moodForm.moodScore === option.value
                                ? "1px solid rgba(59,130,246,0.8)"
                                : "1px solid rgba(148,163,184,0.35)",
                            background:
                              moodForm.moodScore === option.value
                                ? "rgba(59,130,246,0.18)"
                                : "rgba(15,23,42,0.75)",
                            color: "#e5e7eb",
                            cursor: "pointer",
                          }}
                        >
                          {option.value} - {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: "#cbd5e1", marginBottom: "0.5rem" }}>Primary emotion</div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {primaryEmotionOptions.map((emotion) => (
                        <button
                          key={emotion}
                          type="button"
                          onClick={() => setMoodForm((prev) => ({ ...prev, primaryEmotion: emotion }))}
                          style={{
                            padding: "0.6rem 0.85rem",
                            borderRadius: "0.7rem",
                            border:
                              moodForm.primaryEmotion === emotion
                                ? "1px solid rgba(59,130,246,0.8)"
                                : "1px solid rgba(148,163,184,0.35)",
                            background:
                              moodForm.primaryEmotion === emotion
                                ? "rgba(59,130,246,0.18)"
                                : "rgba(15,23,42,0.75)",
                            color: "#e5e7eb",
                            cursor: "pointer",
                          }}
                        >
                          {emotion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: "#cbd5e1", marginBottom: "0.35rem" }}>Optional note</div>
                    <textarea
                      value={moodForm.note}
                      onChange={(e) => setMoodForm((prev) => ({ ...prev, note: e.target.value }))}
                      rows={3}
                      placeholder="Anything you want to add in a sentence or two?"
                      style={textAreaStyle}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "0.75rem",
                      border: "1px dashed rgba(148,163,184,0.35)",
                      background: "rgba(15,23,42,0.55)",
                    }}
                  >
                    <div style={{ color: "#e5e7eb", fontWeight: 600 }}>Optional context</div>
                    <div>
                      <div style={{ color: "#cbd5e1", marginBottom: "0.35rem" }}>Energy level</div>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {energyLevelOptions.map((level) => (
                          <ChipButton
                            key={level}
                            label={labelize(level)}
                            active={moodForm.energyLevel === level}
                            onClick={() =>
                              setMoodForm((prev) => ({
                                ...prev,
                                energyLevel: prev.energyLevel === level ? "" : level,
                              }))
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#cbd5e1", marginBottom: "0.35rem" }}>Tension level</div>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {tensionLevelOptions.map((level) => (
                          <ChipButton
                            key={level}
                            label={labelize(level)}
                            active={moodForm.tensionLevel === level}
                            onClick={() =>
                              setMoodForm((prev) => ({
                                ...prev,
                                tensionLevel: prev.tensionLevel === level ? "" : level,
                              }))
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#cbd5e1", marginBottom: "0.35rem" }}>Context tags</div>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {contextTagOptions.map((tag) => (
                          <ChipButton
                            key={tag}
                            label={tag}
                            active={moodForm.contextTags.includes(tag)}
                            onClick={() => handleToggleArrayValue("contextTags", tag)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <Button variant="primary" type="submit">
                      Save mood for today
                    </Button>
                    <Button variant="secondary" type="button" onClick={() => setShowMoodForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </Section>
          </Card>

          <Card>
            <Section title="Write a journal entry">
              {!showEntryForm && (
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  <p style={{ color: "#cbd5e1", margin: 0 }}>
                    Capture a thought, reflection, or quick note. Entries stay private and can optionally
                    attach today&apos;s mood.
                  </p>
                  <Button variant="primary" onClick={() => resetEntryForm()}>
                    Start writing
                  </Button>
                </div>
              )}

              {showEntryForm && (
                <form onSubmit={handleSaveEntry} style={{ display: "grid", gap: "0.8rem" }}>
                  <input
                    type="text"
                    value={entryForm.title}
                    onChange={(e) => setEntryForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Optional title"
                    style={inputStyle}
                  />
                  <textarea
                    value={entryForm.content}
                    onChange={(e) => setEntryForm((prev) => ({ ...prev, content: e.target.value }))}
                    rows={5}
                    placeholder="Write freely about today..."
                    style={textAreaStyle}
                  />
                  {todaysMood && (
                    <label style={{ color: "#cbd5e1", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={entryForm.attachMood}
                        onChange={(e) =>
                          setEntryForm((prev) => ({ ...prev, attachMood: e.target.checked }))
                        }
                      />
                      Attach today&apos;s mood
                    </label>
                  )}
                  <div>
                    <div style={{ color: "#cbd5e1", marginBottom: "0.35rem" }}>Tags (optional)</div>
                    <input
                      type="text"
                      value={entryForm.tagsText}
                      onChange={(e) => setEntryForm((prev) => ({ ...prev, tagsText: e.target.value }))}
                      placeholder="Comma separated, e.g. gratitude,idea"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <Button variant="primary" type="submit">
                      Save entry
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => {
                        setShowEntryForm(false);
                        setEntryForm(buildEntryFormState(Boolean(todaysMood)));
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </Section>
          </Card>

          <Card>
            <Section title="Today's entries">
              {todaysEntries.length === 0 ? (
                <EmptyState
                  title="No entries yet today"
                  description="Write a short reflection or note to capture what stood out."
                  action={
                    <Button variant="primary" onClick={() => resetEntryForm()}>
                      Write now
                    </Button>
                  }
                />
              ) : (
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {todaysEntries.map((entry) => {
                    const isExpanded = expandedEntryIds.includes(entry.id);
                    const title = entry.title || entry.content.split("\n")[0] || "Untitled entry";
                    return (
                      <div
                        key={entry.id}
                        style={{
                          padding: "0.95rem",
                          borderRadius: "0.85rem",
                          border: "1px solid rgba(148,163,184,0.25)",
                          background: "rgba(15,23,42,0.65)",
                          display: "grid",
                          gap: "0.45rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            {entry.moodSnapshotId && <MoodBadge small />}
                            <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{title}</div>
                          </div>
                          <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                            {formatTime(entry.timestamp)}
                          </div>
                        </div>
                        {isExpanded && (
                          <div style={{ color: "#cbd5e1", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                            {entry.content}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleEntryExpansion(entry.id)}
                          style={{
                            padding: "0.35rem 0.6rem",
                            borderRadius: "0.6rem",
                            border: "1px solid rgba(148,163,184,0.35)",
                            background: "rgba(15,23,42,0.8)",
                            color: "#cbd5e1",
                            cursor: "pointer",
                            justifySelf: "flex-start",
                          }}
                        >
                          {isExpanded ? "Hide" : "Read entry"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>
          </Card>
        </>
      ) : (
        <>
          <Card>
            <Section title="History">
              {historyList.length === 0 ? (
                <EmptyState
                  title="No history yet"
                  description="Log today to start building your Journal & Mood history."
                  action={
                    <Button variant="primary" onClick={() => setActiveView("today")}>
                      Go to Today
                    </Button>
                  }
                />
              ) : (
                <div style={{ display: "grid", gap: "0.65rem" }}>
                  {historyList.map((summary) => (
                    <button
                      key={summary.date}
                      onClick={() => setSelectedHistoryDate(summary.date)}
                      style={{
                        padding: "0.85rem",
                        borderRadius: "0.85rem",
                        border:
                          selectedHistoryDate === summary.date
                            ? "1px solid rgba(59,130,246,0.65)"
                            : "1px solid rgba(148,163,184,0.25)",
                        background:
                          selectedHistoryDate === summary.date
                            ? "rgba(59,130,246,0.12)"
                            : "rgba(15,23,42,0.65)",
                        color: "#e5e7eb",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "grid",
                        gap: "0.3rem",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{summary.dateLabel}</div>
                      <div style={{ color: "#cbd5e1", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        {summary.hasMood ? (
                          <>
                            <MoodBadge score={summary.mainMoodSnapshot?.moodScore} />
                            <span>{summary.mainMoodSnapshot?.primaryEmotion}</span>
                          </>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>No mood logged</span>
                        )}
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                        {summary.entryCount} {summary.entryCount === 1 ? "entry" : "entries"}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Section>
          </Card>

          <Card>
            <Section title="Day details">
              {!selectedHistoryDate ? (
                <div style={{ color: "#94a3b8" }}>Select a day to review its mood and entries.</div>
              ) : (
                <div style={{ display: "grid", gap: "0.9rem" }}>
                  <div style={{ color: "#cbd5e1", fontWeight: 600 }}>
                    {formatDate(selectedHistoryDate)}
                  </div>

                  {selectedDayMood ? (
                    <div
                      style={{
                        display: "grid",
                        gap: "0.35rem",
                        padding: "0.85rem",
                        borderRadius: "0.8rem",
                        border: "1px solid rgba(148,163,184,0.25)",
                        background: "rgba(15,23,42,0.6)",
                      }}
                    >
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <MoodBadge score={selectedDayMood.moodScore} />
                        <div style={{ color: "#e5e7eb", fontWeight: 600 }}>
                          {selectedDayMood.primaryEmotion}
                        </div>
                      </div>
                      {selectedDayMood.note && (
                        <div style={{ color: "#cbd5e1" }}>Note: {selectedDayMood.note}</div>
                      )}
                      {(selectedDayMood.contextTags || []).length > 0 && (
                        <div style={{ color: "#94a3b8" }}>
                          Context: {(selectedDayMood.contextTags || []).join(", ")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: "#94a3b8" }}>No mood logged for this day.</div>
                  )}

                  <div>
                    <div style={{ color: "#e5e7eb", fontWeight: 600, marginBottom: "0.5rem" }}>
                      Entries
                    </div>
                    {selectedDayEntries.length === 0 ? (
                      <div style={{ color: "#94a3b8" }}>No entries for this day.</div>
                    ) : (
                      <div style={{ display: "grid", gap: "0.7rem" }}>
                        {selectedDayEntries.map((entry) => {
                          const isExpanded = expandedEntryIds.includes(entry.id);
                          const title = entry.title || entry.content.split("\n")[0] || "Untitled entry";
                          return (
                            <div
                              key={entry.id}
                              style={{
                                padding: "0.9rem",
                                borderRadius: "0.85rem",
                                border: "1px solid rgba(148,163,184,0.25)",
                                background: "rgba(15,23,42,0.65)",
                                display: "grid",
                                gap: "0.4rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  {entry.moodSnapshotId && <MoodBadge small />}
                                  <div style={{ color: "#e5e7eb", fontWeight: 600 }}>{title}</div>
                                </div>
                                <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                                  {formatTime(entry.timestamp)}
                                </div>
                              </div>
                              {isExpanded && (
                                <div
                                  style={{
                                    color: "#cbd5e1",
                                    lineHeight: 1.6,
                                    whiteSpace: "pre-wrap",
                                  }}
                                >
                                  {entry.content}
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => toggleEntryExpansion(entry.id)}
                                style={{
                                  padding: "0.35rem 0.6rem",
                                  borderRadius: "0.6rem",
                                  border: "1px solid rgba(148,163,184,0.35)",
                                  background: "rgba(15,23,42,0.8)",
                                  color: "#cbd5e1",
                                  cursor: "pointer",
                                  justifySelf: "flex-start",
                                }}
                              >
                                {isExpanded ? "Hide" : "Read entry"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Section>
          </Card>
        </>
      )}
    </div>
  );
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function labelize(value = "") {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function MoodBadge({ score = 3, small = false }) {
  const label = moodScoreOptions.find((option) => option.value === score)?.label || "";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: small ? "0.25rem 0.45rem" : "0.35rem 0.65rem",
        borderRadius: "999px",
        background: "rgba(59,130,246,0.16)",
        color: "#e5e7eb",
        fontSize: small ? "0.85rem" : "0.95rem",
        border: "1px solid rgba(59,130,246,0.5)",
        minWidth: small ? "auto" : "fit-content",
      }}
    >
      <span style={{ fontWeight: 700 }}>{score}</span>
      {!small && <span style={{ color: "#cbd5e1" }}>{label}</span>}
    </span>
  );
}

function ChipButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "0.55rem 0.85rem",
        borderRadius: "0.7rem",
        border: active ? "1px solid rgba(59,130,246,0.8)" : "1px solid rgba(148,163,184,0.35)",
        background: active ? "rgba(59,130,246,0.18)" : "rgba(15,23,42,0.75)",
        color: "#e5e7eb",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.65rem 0.75rem",
  borderRadius: "0.7rem",
  border: "1px solid rgba(148,163,184,0.35)",
  background: "rgba(15,23,42,0.75)",
  color: "#e5e7eb",
};

const textAreaStyle = {
  ...inputStyle,
  resize: "vertical",
};


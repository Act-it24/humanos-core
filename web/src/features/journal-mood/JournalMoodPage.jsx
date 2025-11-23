import React, { useState } from "react";
import { Card, Section, EmptyState, Button } from "../../components";

/**
 * Journal & Mood Page - Reflection, Emotion & Meaning
 * 
 * Displays journal entries, mood check-ins, and pattern insights.
 * Based on docs/23_journal_mood_blueprint.md
 */
export default function JournalMoodPage() {
  const [activeTab, setActiveTab] = useState("journal"); // 'journal' or 'mood'

  return (
    <div className="page-container">
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 className="page-title" style={{ margin: 0 }}>Journal & Mood</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant={activeTab === "journal" ? "primary" : "secondary"}
              onClick={() => setActiveTab("journal")}
            >
              Journal
            </Button>
            <Button
              variant={activeTab === "mood" ? "primary" : "secondary"}
              onClick={() => setActiveTab("mood")}
            >
              Mood
            </Button>
          </div>
        </div>
        <p className="page-description">
          Capture your daily experiences, emotions, and reflections. This helps HumanOS
          understand what affects your energy, focus, and wellbeing.
        </p>

        {activeTab === "journal" ? (
          <>
            {/* Journal Tab */}
            <Section title="Recent Entries">
              <EmptyState
                title="No journal entries yet"
                description="Journal entries help you reflect on your experiences and connect your inner world with your plans and goals."
                action={
                  <Button variant="primary" onClick={() => alert("Journal editor coming soon")}>
                    New Entry
                  </Button>
                }
              />
            </Section>

            <Section title="Timeline">
              <EmptyState
                title="Timeline empty"
                description="Your journal timeline will show entries chronologically, with tags and links to goals or days."
              />
            </Section>
          </>
        ) : (
          <>
            {/* Mood Tab */}
            <Section title="Quick Check-In">
              <EmptyState
                title="No mood logged today"
                description="Quick mood check-ins take just seconds and help track emotional patterns over time."
                action={
                  <Button variant="primary" onClick={() => alert("Mood check-in coming soon")}>
                    Check In Now
                  </Button>
                }
              />
            </Section>

            <Section title="Mood Trends">
              <EmptyState
                title="No mood data yet"
                description="Mood trends will show patterns over time, helping you understand what affects your emotional state."
              />
            </Section>

            <Section title="Pattern Insights">
              <EmptyState
                title="No insights yet"
                description="AI-assisted insights will highlight patterns (e.g., 'Work-related entries often have low mood') once you have enough data."
              />
            </Section>
          </>
        )}
      </Card>
    </div>
  );
}

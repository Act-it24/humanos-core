import React, { useState } from "react";
import { Card, Section, EmptyState, Button } from "../../components";

/**
 * Daily OS Page - Today & This Week Planning
 * 
 * Displays daily and weekly planning views with focus items, routines, and realistic load management.
 * Based on docs/22_daily_os_blueprint.md
 */
export default function DailyOSPage() {
  const [view, setView] = useState("today"); // 'today' or 'week'

  return (
    <div className="page-container">
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 className="page-title" style={{ margin: 0 }}>Daily OS</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant={view === "today" ? "primary" : "secondary"}
              onClick={() => setView("today")}
            >
              Today
            </Button>
            <Button
              variant={view === "week" ? "primary" : "secondary"}
              onClick={() => setView("week")}
            >
              This Week
            </Button>
          </div>
        </div>
        <p className="page-description">
          Realistic daily and weekly planning that respects your energy, commitments, and priorities.
          Connect your Life Map goals with your actual calendar and capacity.
        </p>

        {view === "today" ? (
          <>
            {/* Today View */}
            <Section title="Today's Focus">
              <EmptyState
                title="No plan for today"
                description="Your daily plan will show 3-7 focus items, time-bound events from your calendar, and respect your energy patterns."
                action={
                  <Button variant="primary" onClick={() => alert("Planning coming soon")}>
                    Plan Today
                  </Button>
                }
              />
            </Section>

            <Section title="Today's Events">
              <EmptyState
                title="No events scheduled"
                description="Calendar events will appear here once you connect a calendar in Integrations."
              />
            </Section>

            <Section title="Routines">
              <EmptyState
                title="No routines set"
                description="Morning and evening routines help create structure and consistency in your daily rhythm."
              />
            </Section>
          </>
        ) : (
          <>
            {/* Week View */}
            <Section title="This Week's Plan">
              <EmptyState
                title="No week plan yet"
                description="Your weekly plan distributes tasks across days, balances load, and ensures you're making progress on your goals."
                action={
                  <Button variant="primary" onClick={() => alert("Weekly planning coming soon")}>
                    Plan This Week
                  </Button>
                }
              />
            </Section>

            <Section title="Active Goals This Week">
              <EmptyState
                title="No goals selected"
                description="Choose which goals to actively work on this week. Tasks from those goals will be suggested for your week plan."
              />
            </Section>

            <Section title="Weekly Review">
              <EmptyState
                title="No review yet"
                description="Weekly reviews help you reflect on what worked, what didn't, and adjust your plans and goals."
              />
            </Section>
          </>
        )}
      </Card>
    </div>
  );
}

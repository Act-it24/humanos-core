import React, { useState } from "react";
import { Card, Section, EmptyState, Button } from "../../components";

/**
 * Automations & AI Page - Orchestration & Intelligence
 * 
 * Manages AI agents and automation rules.
 * Based on docs/2A_ai_agents_automation_blueprint.md
 */
export default function AutomationsPage() {
  const [automations, setAutomations] = useState([
    {
      id: "burnout-protection",
      name: "Burnout Protection",
      enabled: false,
      description: "Automatically lightens your workload when low mood persists and burnout flags are active.",
    },
    {
      id: "meeting-overload",
      name: "Meeting Overload Protection",
      enabled: false,
      description: "Suggests moving deep work tasks when you have too many meetings in one day.",
    },
    {
      id: "neglected-goals",
      name: "Neglected Goal Reminders",
      enabled: false,
      description: "Gently reminds you to review goals that haven't seen progress in several weeks.",
    },
    {
      id: "high-joy-signal",
      name: "High Joy Signal Amplification",
      enabled: false,
      description: "Suggests making more space for activities that consistently correlate with positive mood.",
    },
  ]);

  const toggleAutomation = (id) => {
    setAutomations((prev) =>
      prev.map((auto) => (auto.id === id ? { ...auto, enabled: !auto.enabled } : auto))
    );
  };

  return (
    <div className="page-container">
      <Card>
        <h2 className="page-title">Automations & AI Co-pilot</h2>
        <p className="page-description">
          Intelligent rules and AI agents that help HumanOS adapt to your life automatically.
          Each automation is transparent, explainable, and under your control.
        </p>

        {/* Automation Rules */}
        <Section title="Automation Rules">
          {automations.length === 0 ? (
            <EmptyState
              title="No automations available"
              description="Automation rules will appear here once the AI system is set up."
            />
          ) : (
            <div style={{ marginTop: "1rem" }}>
              {automations.map((automation) => (
                <div
                  key={automation.id}
                  className="list-item"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <h4 style={{ margin: 0, fontWeight: 500, fontSize: "1rem" }}>
                        {automation.name}
                      </h4>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          background: automation.enabled
                            ? "rgba(34,197,94,0.2)"
                            : "rgba(148,163,184,0.2)",
                          color: automation.enabled ? "#4ade80" : "#94a3b8",
                        }}
                      >
                        {automation.enabled ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                        opacity: 0.8,
                        margin: 0,
                      }}
                    >
                      {automation.description}
                    </p>
                  </div>
                  <Button
                    variant={automation.enabled ? "primary" : "secondary"}
                    onClick={() => toggleAutomation(automation.id)}
                  >
                    {automation.enabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* AI Agents Info */}
        <Section title="AI Agents">
          <EmptyState
            title="Agents not yet active"
            description="AI agents (Planning, Reflection, Focus, etc.) will provide intelligent suggestions once the system is set up. Each agent has a specific role and clear boundaries."
          />
        </Section>

        {/* Automation History */}
        <Section title="Automation History">
          <EmptyState
            title="No history yet"
            description="When automations run, you'll see a log of what actions were taken and why, ensuring full transparency."
          />
        </Section>

        {/* Safety & Control */}
        <Section title="Safety & Control">
          <div style={{ fontSize: "0.9rem", lineHeight: 1.6, opacity: 0.8 }}>
            <p style={{ marginBottom: "0.75rem" }}>
              <strong>Transparency:</strong> Every automated action is logged and explainable.
              You can see what happened and why.
            </p>
            <p style={{ marginBottom: "0.75rem" }}>
              <strong>Control:</strong> You can disable any automation at any time. Your decisions
              always override automated suggestions.
            </p>
            <p>
              <strong>Safety:</strong> All automations follow the HumanOS Charter. They will never
              diagnose, manipulate, or act without your understanding.
            </p>
          </div>
        </Section>
      </Card>
    </div>
  );
}

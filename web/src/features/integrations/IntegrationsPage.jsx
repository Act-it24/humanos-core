import React from "react";
import { Card, Section, EmptyState, Button } from "../../components";

/**
 * Integrations Hub Page - App Orchestrator & Data Bridge
 * 
 * Manages connections to external services (calendar, tasks, etc.).
 * Based on docs/28_integrations_hub_blueprint.md
 */
export default function IntegrationsPage() {
  const availableIntegrations = [
    { id: "google-calendar", name: "Google Calendar", type: "calendar", status: "available" },
    { id: "todoist", name: "Todoist", type: "tasks", status: "available" },
    { id: "notion", name: "Notion", type: "notes", status: "coming-soon" },
  ];

  return (
    <div className="page-container">
      <Card>
        <h2 className="page-title">Integrations Hub</h2>
        <p className="page-description">
          Connect HumanOS to the tools you already use. This creates a unified view
          of your calendar, tasks, and commitments without leaving HumanOS.
        </p>

        {/* Connected Services */}
        <Section title="Connected Services">
          <EmptyState
            title="No integrations connected"
            description="Connect your calendar and task apps to see everything in one place. HumanOS will read your schedule and help plan realistically."
          />
        </Section>

        {/* Available Integrations */}
        <Section title="Available Integrations">
          <div className="grid grid-2" style={{ marginTop: "1rem" }}>
            {availableIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="list-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 500, marginBottom: "0.25rem" }}>
                    {integration.name}
                  </div>
                  <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                    {integration.type}
                  </div>
                </div>
                <Button
                  variant={integration.status === "available" ? "primary" : "secondary"}
                  disabled={integration.status !== "available"}
                  onClick={() => alert(`Connect ${integration.name} coming soon`)}
                >
                  {integration.status === "available" ? "Connect" : "Coming Soon"}
                </Button>
              </div>
            ))}
          </div>
        </Section>

        {/* Integration Info */}
        <Section title="How It Works">
          <div style={{ fontSize: "0.9rem", lineHeight: 1.6, opacity: 0.8 }}>
            <p style={{ marginBottom: "0.75rem" }}>
              <strong>Read Access:</strong> HumanOS reads your calendar events and tasks to build
              a complete picture of your commitments.
            </p>
            <p style={{ marginBottom: "0.75rem" }}>
              <strong>Write Access (Optional):</strong> With your permission, HumanOS can create
              time blocks in your calendar or add tasks to your task manager.
            </p>
            <p>
              <strong>Privacy:</strong> You control what's connected and what permissions are granted.
              You can disconnect at any time.
            </p>
          </div>
        </Section>
      </Card>
    </div>
  );
}

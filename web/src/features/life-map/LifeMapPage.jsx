import React from "react";
import { Card, Section, EmptyState, Button } from "../../components";

/**
 * Life Map Page - Goals, Domains & Projects
 * 
 * Displays user's life domains, goals, projects, and tasks hierarchy.
 * Based on docs/21_life_map_blueprint.md
 */
export default function LifeMapPage() {
  return (
    <div className="page-container">
      <Card>
        <h2 className="page-title">Life Map</h2>
        <p className="page-description">
          Your life organized into domains, goals, and projects. This map connects
          what you do day-to-day with what truly matters to you.
        </p>

        {/* Domains Overview */}
        <Section title="Life Domains">
          <EmptyState
            title="No domains set up"
            description="Life domains (Health, Work, Relationships, etc.) organize your goals and projects. Set up your domains to begin mapping your life."
            action={
              <Button variant="primary" onClick={() => alert("Domain setup coming soon")}>
                Set Up Domains
              </Button>
            }
          />
        </Section>

        {/* Active Goals Section */}
        <Section title="Active Goals">
          <EmptyState
            title="No goals yet"
            description="Goals are medium to long-term intentions in your life domains. Create goals that align with your values and current focus."
          />
        </Section>

        {/* Projects Section */}
        <Section title="Active Projects">
          <EmptyState
            title="No projects yet"
            description="Projects are concrete initiatives that support your goals. Break down goals into actionable projects with clear outcomes."
          />
        </Section>

        {/* Life Map Overview */}
        <Section title="Life Map Overview">
          <EmptyState
            title="Map not yet created"
            description="Once you have domains and goals, you'll see a visual overview of your life map showing how everything connects."
          />
        </Section>
      </Card>
    </div>
  );
}

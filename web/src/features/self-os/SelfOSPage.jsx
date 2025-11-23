import React from "react";
import { Card, Section, EmptyState, Button } from "../../components";

/**
 * Self OS Page - Core Identity & Inner World
 * 
 * Displays user's Self OS profile: values, traits, energy rhythms, and flags.
 * Based on docs/20_self_os_blueprint.md
 */
export default function SelfOSPage() {
  return (
    <div className="page-container">
      <Card>
        <h2 className="page-title">Self OS</h2>
        <p className="page-description">
          Your core identity: values, personality patterns, energy rhythms, and life context.
          This profile helps HumanOS understand who you are and how you operate.
        </p>

        {/* Profile Overview Section */}
        <Section title="Profile Overview">
          <EmptyState
            title="No profile yet"
            description="Complete onboarding to build your Self OS profile. This will include your core values, personality patterns, and energy preferences."
            action={
              <Button variant="primary" onClick={() => alert("Onboarding coming soon")}>
                Start Onboarding
              </Button>
            }
          />
        </Section>

        {/* Values Section */}
        <Section title="Core Values">
          <EmptyState
            title="Values not set"
            description="Your core values guide decision-making and goal alignment. You'll select 5-7 values during onboarding."
          />
        </Section>

        {/* Personality Traits Section */}
        <Section title="Personality Patterns">
          <EmptyState
            title="Traits not assessed"
            description="Personality patterns help HumanOS understand your working style, social energy, and decision-making approach."
          />
        </Section>

        {/* Energy Rhythms Section */}
        <Section title="Energy Rhythms">
          <EmptyState
            title="Energy patterns not set"
            description="Understanding when you have peak energy, how you recharge, and your daily rhythms helps create realistic plans."
          />
        </Section>

        {/* Flags Section */}
        <Section title="Life Context & Flags">
          <EmptyState
            title="No flags set"
            description="Flags provide crucial context (e.g., 'Parent of toddlers', 'Recovering from burnout') that shapes how HumanOS supports you."
          />
        </Section>
      </Card>
    </div>
  );
}

import React, { useState } from "react";
import { Button, Section, Modal } from "../../components";
import {
  mergeAssessments,
  createEmptySelfOsProfile,
} from "./selfOsModel";
import BigFiveWizard from "./BigFiveWizard";
import AttachmentWizard from "./AttachmentWizard";
import EmotionalIntelligenceWizard from "./EmotionalIntelligenceWizard";
import ClinicalScreensWizard from "./ClinicalScreensWizard";

function formatDate(dateString) {
  if (!dateString) return null;
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString();
}

function StatusRow({ label, date, onView }) {
  if (!date) {
    return <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No result yet.</div>;
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <div style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
        {label}: {date}
      </div>
      <Button variant="ghost" onClick={onView}>
        View last results
      </Button>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {import("./selfOsModel").SelfOsProfile|null} props.profile
 * @param {(next: import("./selfOsModel").SelfOsProfile) => void} props.onUpdateProfile
 */
export default function SelfImageSection({ profile, onUpdateProfile }) {
  const [activeModal, setActiveModal] = useState({ type: "none", startAtSummary: false });
  const baseProfile = profile || createEmptySelfOsProfile();
  const assessments = baseProfile.assessments || {};
  const bigFive = assessments.bigFive || null;
  const attachment = assessments.attachment || null;
  const eq = assessments.emotionalIntelligence || null;
  const depression = assessments.depressionScreen || null;

  const openModal = (type, startAtSummary = false) => {
    setActiveModal({ type, startAtSummary });
  };

  const closeModal = () => setActiveModal({ type: "none", startAtSummary: false });

  const handleSaveBigFive = (result) => {
    onUpdateProfile(mergeAssessments(baseProfile, { bigFive: result }));
    closeModal();
  };

  const handleSaveAttachment = (result) => {
    onUpdateProfile(mergeAssessments(baseProfile, { attachment: result }));
    closeModal();
  };

  const handleSaveEq = (result) => {
    onUpdateProfile(mergeAssessments(baseProfile, { emotionalIntelligence: result }));
    closeModal();
  };

  const handleSaveDepression = (result) => {
    onUpdateProfile(mergeAssessments(baseProfile, { depressionScreen: result }));
    closeModal();
  };

  const cardStyle = {
    padding: "1.25rem",
    background: "rgba(15,23,42,0.6)",
    borderRadius: "0.95rem",
    border: "1px solid rgba(148,163,184,0.35)",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  };

  return (
    <Section title="Self Image & Assessments">
      <p style={{ color: "#cbd5e1", marginBottom: "1rem", lineHeight: 1.5 }}>
        Explore structured reflections on personality, relationships, and wellbeing. Results stay local to
        this page for now.
      </p>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        <div style={cardStyle}>
          <div>
            <div style={{ color: "#e5e7eb", fontWeight: 600, marginBottom: "0.3rem" }}>
              Core Personality & Strengths
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              Big Five snapshot to help tailor tone, pacing, and planning.
            </div>
          </div>
          <Button variant="primary" onClick={() => openModal("core")}>
            Explore core personality
          </Button>
          <StatusRow
            label="Last updated"
            date={formatDate(bigFive?.updatedAt || bigFive?.takenAt)}
            onView={() => openModal("core", true)}
          />
        </div>

        <div style={cardStyle}>
          <div>
            <div style={{ color: "#e5e7eb", fontWeight: 600, marginBottom: "0.3rem" }}>
              Relational & Emotional Style
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              Prototype attachment and EQ check-ins to notice how you relate and regulate.
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            <Button variant="primary" onClick={() => openModal("attachment")}>
              Attachment style
            </Button>
            <Button variant="secondary" onClick={() => openModal("eq")}>
              EQ check-in
            </Button>
          </div>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <StatusRow
              label="Attachment"
              date={formatDate(attachment?.updatedAt || attachment?.takenAt)}
              onView={() => openModal("attachment", true)}
            />
            <StatusRow
              label="EQ"
              date={formatDate(eq?.updatedAt || eq?.takenAt)}
              onView={() => openModal("eq", true)}
            />
          </div>
        </div>

        <div style={cardStyle}>
          <div>
            <div style={{ color: "#e5e7eb", fontWeight: 600, marginBottom: "0.3rem" }}>
              Advanced & Clinical Screens
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              Gentle, non-diagnostic screeners. Use them to pace plans and notice when to seek support.
            </div>
          </div>
          <Button variant="primary" onClick={() => openModal("clinical")}>
            Check advanced screens
          </Button>
          <StatusRow
            label="Depression screen"
            date={formatDate(depression?.updatedAt || depression?.takenAt)}
            onView={() => openModal("clinical", true)}
          />
        </div>
      </div>

      <Modal
        isOpen={activeModal.type === "core"}
        onClose={closeModal}
        title="Self Image - Core Personality"
      >
        <BigFiveWizard
          initialResult={bigFive}
          onCancel={closeModal}
          onSave={handleSaveBigFive}
          startAtSummary={activeModal.startAtSummary && Boolean(bigFive)}
        />
      </Modal>

      <Modal
        isOpen={activeModal.type === "attachment"}
        onClose={closeModal}
        title="Self Image - Attachment style"
      >
        <AttachmentWizard
          initialResult={attachment}
          onCancel={closeModal}
          onSave={handleSaveAttachment}
          startAtSummary={activeModal.startAtSummary && Boolean(attachment)}
        />
      </Modal>

      <Modal isOpen={activeModal.type === "eq"} onClose={closeModal} title="Self Image - EQ prototype">
        <EmotionalIntelligenceWizard
          initialResult={eq}
          onCancel={closeModal}
          onSave={handleSaveEq}
          startAtSummary={activeModal.startAtSummary && Boolean(eq)}
        />
      </Modal>

      <Modal
        isOpen={activeModal.type === "clinical"}
        onClose={closeModal}
        title="Self Image - Advanced & clinical screens"
      >
        <ClinicalScreensWizard
          initialResult={depression}
          onCancel={closeModal}
          onSave={handleSaveDepression}
          startAtSummary={activeModal.startAtSummary && Boolean(depression)}
        />
      </Modal>
    </Section>
  );
}

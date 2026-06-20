import { baseEmailLayout, wrapContent, textBlock, button, infoTable, divider } from "./base";

interface CandidateNotificationData {
  recruiterName: string;
  candidateName: string;
  candidateEmail: string;
  positionTitle: string;
  company: string;
  status: "applied" | "shortlisted" | "interview" | "offer" | "rejected";
  message: string;
  dashboardUrl: string;
}

export function renderCandidateNotificationEmail(data: CandidateNotificationData) {
  const statusColors: Record<string, string> = {
    applied: "#7c3aed",
    shortlisted: "#06b6d4",
    interview: "#f59e0b",
    offer: "#10b981",
    rejected: "#ef4444",
  };

  const body = wrapContent(
    `Candidate ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`,
    textBlock(
      `Hi ${data.recruiterName}, here's an update on your candidate <strong>${data.candidateName}</strong> for <strong>${data.positionTitle}</strong> at ${data.company}.`
    ) +
      `<div style="text-align:center;margin:16px 0;">
      <span style="display:inline-block;padding:4px 20px;background:${statusColors[data.status]}20;border:1px solid ${statusColors[data.status]}40;border-radius:20px;color:${statusColors[data.status]};font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${data.status}</span>
    </div>` +
      infoTable([
        { label: "Candidate", value: `${data.candidateName} (${data.candidateEmail})` },
        { label: "Position", value: data.positionTitle },
        { label: "Company", value: data.company },
      ]) +
      divider() +
      textBlock(data.message) +
      button(data.dashboardUrl, "View in Dashboard")
  );
  return baseEmailLayout(body, {
    title: "Candidate Status Update",
    previewText: `${data.candidateName} - ${data.status}`,
  });
}

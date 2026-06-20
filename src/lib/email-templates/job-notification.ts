import { baseEmailLayout, wrapContent, textBlock, button, badge, list } from "./base";

interface JobNotificationData {
  firstName: string;
  jobTitle: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
  skills: string[];
  applyUrl: string;
}

export function renderJobNotificationEmail(data: JobNotificationData) {
  const body = wrapContent(
    `New Job Match: ${data.jobTitle}`,
    textBlock(`Hi ${data.firstName}, we found a job that matches your profile.`) +
      `<h2 style="margin:20px 0 4px 0;color:#fff;font-size:20px;font-weight:600;">${data.jobTitle}</h2>
    <p style="margin:0 0 12px 0;color:#a78bfa;font-size:15px;">${data.company} &mdash; ${data.location}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0;">
      <tr>
        <td style="padding:2px 0;">${badge(data.jobType, "#06b6d4")}</td>
        <td style="padding:2px 0;padding-left:8px;">${badge(data.salary, "#10b981")}</td>
      </tr>
    </table>` +
      textBlock(data.description) +
      (data.skills.length
        ? `<p style="margin:12px 0 4px 0;color:#9ca3af;font-size:13px;">Preferred skills:</p>${list(data.skills)}`
        : "") +
      button(data.applyUrl, "Apply Now")
  );
  return baseEmailLayout(body, {
    title: "Job Match Notification",
    previewText: `${data.jobTitle} at ${data.company}`,
  });
}

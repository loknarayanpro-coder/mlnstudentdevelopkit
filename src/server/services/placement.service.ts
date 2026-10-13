export type ApplicationStatus =
  | "saved"
  | "applied"
  | "assessment"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export const KANBAN_STAGES: Array<{ id: ApplicationStatus; title: string; color: string }> = [
  { id: "saved", title: "Saved Opportunities", color: "gray" },
  { id: "applied", title: "Applied", color: "blue" },
  { id: "assessment", title: "Online Assessment (OA)", color: "purple" },
  { id: "interview", title: "Interviewing", color: "amber" },
  { id: "offer", title: "Offers Received 🎉", color: "emerald" },
];

/**
 * Validates whether a state transition in the recruitment pipeline is permissible.
 */
export function isValidStatusTransition(
  current: ApplicationStatus,
  target: ApplicationStatus,
): boolean {
  if (current === target) return true;
  if (target === "rejected" || target === "withdrawn") return true;

  const validNext: Record<ApplicationStatus, ApplicationStatus[]> = {
    saved: ["applied", "rejected", "withdrawn"],
    applied: ["assessment", "interview", "rejected", "withdrawn"],
    assessment: ["interview", "offer", "rejected", "withdrawn"],
    interview: ["offer", "rejected", "withdrawn"],
    offer: ["withdrawn"],
    rejected: ["saved", "applied"],
    withdrawn: ["saved", "applied"],
  };

  return validNext[current]?.includes(target) ?? false;
}

/**
 * Computes urgency status based on application deadline.
 */
export function getDeadlineUrgency(
  deadlineStr: string | null | undefined,
  now = new Date(),
): "urgent" | "soon" | "plenty" | "expired" {
  if (!deadlineStr) return "plenty";

  const deadline = new Date(deadlineStr);
  deadline.setHours(23, 59, 59, 999);
  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 2) return "urgent";
  if (diffDays <= 7) return "soon";
  return "plenty";
}

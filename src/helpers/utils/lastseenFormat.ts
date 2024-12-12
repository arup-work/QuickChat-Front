import { format } from "date-fns";

export const formatLastSeen = (lastSeen: Date) => {
  const now = new Date();
  const lastSeenDate = new Date(lastSeen);

  // Check if it's today
  if (
    lastSeen.getDate() === now.getDate() &&
    lastSeen.getMonth() === now.getMonth() &&
    lastSeen.getFullYear === now.getFullYear
  ) {
    return `today at ${format(lastSeenDate, "hh:mm a")}`;
  }

  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    lastSeenDate.getDate() === yesterday.getDate() &&
    lastSeenDate.getMonth() === yesterday.getMonth() &&
    lastSeenDate.getFullYear() === yesterday.getFullYear()
  ) {
    return `yesterday at ${format(lastSeenDate, "hh:mm a")}`;
  }

  // Older dates
  return format(lastSeenDate, "dd/MM/yyyy 'at' hh:mm a");
};

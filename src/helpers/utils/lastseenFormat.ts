import { format } from "date-fns";

export const formatLastSeen = (lastSeen: Date, insideChat: boolean) => {
  const now = new Date();
  const lastSeenDate = new Date(lastSeen);

  // Check if it's today
  if (
    lastSeen.getDate() === now.getDate() &&
    lastSeen.getMonth() === now.getMonth() &&
    lastSeen.getFullYear === now.getFullYear
  ) {
    if (!insideChat) {
      return "hh:mm a";
    }
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
    if (!insideChat) {
      return "yesterday";
    }
    return `yesterday at ${format(lastSeenDate, "hh:mm a")}`;
  }

  if (!insideChat) {
    return format(lastSeenDate, "dd/MM/yyyy");
  }

  // Older dates
  return format(lastSeenDate, "dd/MM/yyyy 'at' hh:mm a");
};

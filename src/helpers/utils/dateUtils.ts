import { format, isToday, isYesterday } from "date-fns";

export const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString);

  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "dd-MMM-yyyy");
  }
};

export const formatTimeLabel = (dateString: string) => {
  // Get the logged user timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const date = new Date(dateString);

  // Format the date for a specific timezone
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Use 12-hour format with AM/PM
    timeZone
  };

  let formattedTime: string = new Intl.DateTimeFormat("en-US", options).format(date);
  formattedTime = formattedTime.replace(/AM|PM/, (match) => match.toLowerCase());

  return formattedTime;
};

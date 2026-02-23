/**
 * Formats a date string or Date object into a readable format.
 * Default format is DD/MM/YYYY HH:mm
 */
export const formatDate = (date: string | Date | undefined | null, options?: Intl.DateTimeFormatOptions) => {
  if (!date) return "—";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return date.toString();
    }

    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      ...options
    };

    return new Intl.DateTimeFormat('en-GB', defaultOptions).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return date.toString();
  }
};

/**
 * Formats a date to just the date part (e.g., 23 Feb 2026)
 */
export const formatJustDate = (date: string | Date | undefined | null) => {
  return formatDate(date, { hour: undefined, minute: undefined });
};

/**
 * Formats a date to just the time part (e.g., 18:16)
 */
export const formatJustTime = (date: string | Date | undefined | null) => {
  return formatDate(date, { 
    day: undefined, 
    month: undefined, 
    year: undefined,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

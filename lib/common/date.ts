export function formatDate(date: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const dateFormatter = new Intl.DateTimeFormat(undefined, options); // Use system default locale
    const dateString = dateFormatter.format(new Date(date));
    const parts = dateString.split(', ');

    // Ensure the parts are correctly ordered
    if (parts.length === 2) {
      const [datePart, timePart] = parts;
      return `${datePart} at ${timePart}`;
    } else {
      return dateString;
    }
  } catch (error) {
    return date;
  }
}

export function timeSince(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? 'a year ago' : `${interval} years ago`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? 'a month ago' : `${interval} months ago`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? 'a day ago' : `${interval} days ago`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? 'an hour ago' : `${interval} hours ago`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? 'a minute ago' : `${interval} minutes ago`;
  }
  return seconds === 1 ? 'a second ago' : `${seconds} seconds ago`;
}

export function formatDatesInObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => formatDatesInObject(item));
  } else if (typeof obj === 'object' && obj !== null) {
    const formattedObj = { ...obj };
    for (const key in formattedObj) {
      if (
        typeof formattedObj[key] === 'string' &&
        key.endsWith('At') &&
        !isNaN(Date.parse(formattedObj[key]))
      ) {
        formattedObj[key] = formatDate(formattedObj[key]);
      } else if (typeof formattedObj[key] === 'object') {
        formattedObj[key] = formatDatesInObject(formattedObj[key]);
      }
    }
    return formattedObj;
  }
  return obj;
}

export function isEmpty(element) {
  if (element === undefined || element === null || element.length === 0)
    return true
  else
    return false
}

export function timeAgo(date) {
  const now = new Date();
  const timeDifference = now - date;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (days === 1) {
    return '1 day ago';
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    const months = Math.floor(days / 30);
    if (months < 1) {
      return `${days} days ago`;
    } else if (months === 1) {
      return '1 month ago';
    } else {
      return `${months} months ago`;
    }
  }
}
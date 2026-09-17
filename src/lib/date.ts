/**
 * Format a date according to the current locale.
 * In Persian locale, uses Jalali calendar (fa-IR-u-ca-persian).
 */
export function formatDate(date: Date | string, locale: string = 'fa'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (locale === 'fa') {
    return d.toLocaleDateString('fa-IR-u-ca-persian', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date with time according to the current locale.
 */
export function formatDateTime(date: Date | string, locale: string = 'fa'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (locale === 'fa') {
    return d.toLocaleString('fa-IR-u-ca-persian', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

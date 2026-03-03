/**
 * Date utility functions for consistent date handling across the app
 * All functions use local timezone to avoid UTC conversion issues
 */

/**
 * Return current local date components.
 * @returns {{ year: number, month: number, date: number }} Current year, month (1-12), and day-of-month.
 * @example
 * // => { year: 2025, month: 12, date: 18 }
 */
export function getCurrentDateComponents() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
  };
}

/**
 * Formats a date into a YYYY-MM-DD string.
 * Accepts either a Date object or explicit numeric components.
 * @param {number|Date} yearOrDate - Year number (e.g. 2025) OR a Date object.
 * @param {number} [month] - Month number (1-12). Required if yearOrDate is a number.
 * @param {number} [date] - Day of month. Required if yearOrDate is a number.
 * @throws {Error} If month/date are missing when yearOrDate is a number.
 * @returns {string} Formatted date string in 'YYYY-MM-DD'.
 * @example
 * formatDate(new Date())        // '2025-12-18'
 * formatDate(2025, 1, 3)       // '2025-01-03'
 */
export function formatDate(
  yearOrDate: number | Date,
  month?: number,
  date?: number,
): string {
  if (yearOrDate instanceof Date) {
    const year = yearOrDate.getFullYear();
    const m = yearOrDate.getMonth() + 1;
    const d = yearOrDate.getDate();
    return `${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  if (month === undefined || date === undefined) {
    throw new Error(
      'formatDate: month and date are required when yearOrDate is a number',
    );
  }

  return `${yearOrDate}-${String(month).padStart(2, '0')}-${String(date).padStart(
    2,
    '0',
  )}`;
}

/**
 * Return today's date as YYYY-MM-DD using local timezone.
 * @returns {string} Today's date in 'YYYY-MM-DD'.
 * @example
 * getTodayString() // '2025-12-18'
 */
export function getTodayString(): string {
  const { year, month, date } = getCurrentDateComponents();
  return formatDate(year, month, date);
}

/**
 * Return the first day of a given month as YYYY-MM-DD.
 * @param {number} year - Full year (e.g. 2025).
 * @param {number} month - Month number (1-12).
 * @returns {string} First day of the month, e.g. '2025-09-01'.
 */
export function getMonthStartDate(year: number, month: number): string {
  return formatDate(year, month, 1);
}

/**
 * Return the last day of a given month as YYYY-MM-DD.
 * @param {number} year - Full year (e.g. 2025).
 * @param {number} month - Month number (1-12).
 * @returns {string} Last day of the month, e.g. '2025-02-28' (or 29 for leap years).
 */
export function getMonthEndDate(year: number, month: number): string {
  const lastDay = new Date(year, month, 0).getDate();
  return formatDate(year, month, lastDay);
}

/**
 * Return a date string for the provided year/month and the current day of month.
 * Useful for "month to date" endpoints.
 * @param {number} year - Full year (e.g. 2025).
 * @param {number} month - Month number (1-12).
 * @returns {string} Date in 'YYYY-MM-DD' using today's day-of-month.
 */
export function getCurrentMonthToDate(year: number, month: number): string {
  const { date } = getCurrentDateComponents();
  return formatDate(year, month, date);
}

/**
 * Check if a year/month pair is the current month.
 * @param {number} year - Full year.
 * @param {number} month - Month number (1-12).
 * @returns {boolean} True if the supplied year/month matches today's year/month.
 */
export function isCurrentMonth(year: number, month: number): boolean {
  const { year: currentYear, month: currentMonth } = getCurrentDateComponents();
  return currentYear === year && currentMonth === month;
}

/**
 * Produce a stable key for month-based maps.
 * @param {number} year - Full year.
 * @param {number} month - Month number (1-12).
 * @returns {string} Key in the format 'M-YYYY' (e.g., '9-2025').
 */
export function getMonthKey(year: number, month: number): string {
  return `${month}-${year}`;
}

/**
 * Extract the date portion from an ISO date-time string.
 * @param {string} isoString - An ISO timestamp like '2025-12-18T09:30:00Z' or '2025-12-18T09:30:00'.
 * @returns {string} Date in 'YYYY-MM-DD'. If input doesn't contain 'T', returns the original split[0].
 */
export function extractDateFromISO(isoString: string): string {
  return isoString.split('T')[0];
}

/**
 * Return the number of minutes elapsed since midnight in local time.
 * @returns {number} Minutes since 00:00 (0..1439).
 * @example
 * // 9:30 AM -> 570
 */
export function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Format times in 12-hour clock with optional space before AM/PM.
 * Supports two call signatures:
 *  - formatTime(timeString, withSpace?) where timeString may be '9.30', '14:45', '9:30 AM', etc.
 *  - formatTime(hours, minutes, withSpace?) where hours/minutes are numbers (24-hour input).
 * @param {number|string} hoursOrTimeString - Either numeric hours (0-23) or a time string to parse.
 * @param {number|boolean} [minutesOrWithSpace] - If numeric: minutes (0-59). If boolean: withSpace flag when first arg is string.
 * @param {boolean} [withSpace=true] - Whether to include a space before AM/PM (true -> '9:30 AM', false -> '9:30AM').
 * @returns {string} Formatted time like '9:30 AM' or original input if parsing fails.
 * @example
 * formatTime("9.30")            // "9:30 AM"
 * formatTime(14, 5, false)     // "2:05PM"
 */
export function formatTime(
  hoursOrTimeString: number | string,
  minutesOrWithSpace?: number | boolean,
  withSpace?: boolean,
): string {
  // Signature 1: formatTime(timeString, withSpace?)
  if (typeof hoursOrTimeString === 'string') {
    const parsed = parseTime(hoursOrTimeString);
    if (!parsed) return hoursOrTimeString;
    const space = typeof minutesOrWithSpace === 'boolean' ? minutesOrWithSpace : true;
    const period = parsed.hours >= 12 ? 'PM' : 'AM';
    const hour12 = parsed.hours % 12 || 12;
    const timeStr = `${hour12}:${String(parsed.minutes).padStart(2, '0')}`;
    return `${timeStr}${space ? ' ' : ''}${period}`;
  }

  // Signature 2: formatTime(hours, minutes, withSpace?)
  const hours = hoursOrTimeString;
  const minutes = minutesOrWithSpace as number;
  const space = typeof withSpace === 'boolean' ? withSpace : true;

  if (isNaN(hours) || isNaN(minutes)) {
    return `${hours}:${minutes}`;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const timeStr = `${hour12}:${String(minutes).padStart(2, '0')}`;
  return `${timeStr}${space ? ' ' : ''}${period}`;
}

/**
 * Parse a time string into 24-hour hours/minutes.
 * Accepts 'HH:MM', 'H.MM', and optional AM/PM (case-insensitive).
 * @param {string} timeStr - e.g. '09:30', '9.30 PM', '14:45'
 * @returns {{ hours: number, minutes: number } | null} Object with 24-hour hours and minutes, or null on parse failure.
 * @notes
 * - If AM/PM is present it converts to 24-hour format.
 * - Returns null if hours or minutes can't be parsed as numbers.
 */
export function parseTime(timeStr: string): { hours: number; minutes: number } | null {
  const normalized = timeStr.replace('.', ':').toUpperCase();
  const isPM = normalized.includes('PM');
  const isAM = normalized.includes('AM');
  const cleanTime = normalized.replace(/[AP]M/, '').trim();
  const [hStr, mStr] = cleanTime.split(':');
  let hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr, 10);

  if (isNaN(hours) || isNaN(minutes)) return null;

  // Convert to 24-hour format if AM/PM is specified
  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return { hours, minutes };
}

/**
 * Parse a period name string for start and end time components.
 * Expected format: '(HH.MM-HH.MM)' inside the string (e.g. 'Period 1 (09.00-09.45)').
 * @param {string} periodName - Period name containing a parenthesized time range.
 * @returns {{
 *   start: { hours: number, minutes: number },
 *   end: { hours: number, minutes: number }
 * } | null}
 * Returns null if the pattern is not found or numeric parsing fails.
 * @example
 * parsePeriodDetails('Period 1 (09.00-09.45)')
 * // -> { start: { hours: 9, minutes: 0 }, end: { hours: 9, minutes: 45 } }
 */
export function parsePeriodDetails(periodName: string): {
  start: { hours: number; minutes: number };
  end: { hours: number; minutes: number };
} | null {
  const match = periodName.match(/\((\d+)\.(\d+)-(\d+)\.(\d+)\)/);
  if (!match) return null;

  return {
    start: { hours: parseInt(match[1]), minutes: parseInt(match[2]) },
    end: { hours: parseInt(match[3]), minutes: parseInt(match[4]) },
  };
}

/**
 * Parse a time slot string and return start/end as string tokens.
 * Behavior:
 * 1. If parsePeriodDetails succeeds, returns 'H.MM' formatted tokens.
 * 2. Otherwise extracts the first parenthesized content and splits on '-'.
 * @param {string} periodName - e.g. 'Period 1 (09.00-09.45)' or 'Lab (9:00-10:00)'
 * @returns {{ start: string, end: string } | null} Strings for start and end (raw tokens), or null on failure.
 * @notes
 * - Tokens can be in 'HH.MM' or 'HH:MM' formats depending on source.
 */
export function parseTimeSlot(periodName: string): { start: string; end: string } | null {
  // Try standard format first
  const details = parsePeriodDetails(periodName);
  if (details) {
    return {
      start: `${details.start.hours}.${details.start.minutes
        .toString()
        .padStart(2, '0')}`,
      end: `${details.end.hours}.${details.end.minutes.toString().padStart(2, '0')}`,
    };
  }

  // Fallback to parentheses extraction
  const match = periodName.match(/\(([^)]+)\)/);
  if (!match) return null;
  const timeRange = match[1];
  const [start, end] = timeRange.split('-');
  return { start: start?.trim(), end: end?.trim() };
}

/**
 * Return an array of 7 Date objects starting from the given startDate (inclusive).
 * Each returned Date is a new Date instance (caller-safe).
 * @param {Date} startDate - Starting date (any time-of-day). The returned dates will preserve local timezone and increment day-by-day.
 * @returns {Date[]} Seven consecutive Date objects.
 */
export function getWeekDates(startDate: Date): Date[] {
  const dates: Date[] = [];
  const date = new Date(startDate);

  for (let i = 0; i < 7; i++) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

/**
 * Return the start of the week (Monday) for the supplied date.
 * Sets time to 00:00:00.000 local time.
 * @param {Date} date - Any Date.
 * @returns {Date} Date representing Monday (start of week). If input is Sunday, this returns the previous Monday.
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Return a short day label for a date.
 * @param {Date} date - Any Date object.
 * @returns {string} One of ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].
 */
export function getDayName(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}

/**
 * Return full month name from 1-based month number.
 * @param {number} month - Month number (1-12).
 * @returns {string} Full month name (e.g. 'January').
 * @throws {RangeError} If month is out of 1-12 range.
 */
export function getMonthName(month: number): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month - 1];
}

/**
 * Compare two Date objects for same calendar day in local timezone.
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean} True when year, month and day are equal.
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Determine whether a class (given by date string and period name) is in the future or still ongoing.
 * Rules:
 *  - If classDate > today -> true.
 *  - If classDate == today -> compare current time with class end time (parsed from periodName).
 *  - Otherwise -> false.
 * @param {string} dateStr - Date string accepted by `new Date(dateStr)` (prefer 'YYYY-MM-DD').
 * @param {string} periodName - Period name that includes a time range, e.g. 'Period 1 (09.00-09.45)'.
 * @returns {boolean} True if class is scheduled after now or still ongoing today.
 * @notes
 * - If parsing fails, function conservatively returns false.
 * - Prefer ISO 'YYYY-MM-DD' dateStr for reliable cross-platform parsing.
 */
export function isClassInFuture(dateStr: string, periodName: string): boolean {
  const now = new Date();
  const classDate = new Date(dateStr || '');

  classDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (classDate > today) {
    return true;
  }

  if (classDate.getTime() === today.getTime()) {
    const details = parsePeriodDetails(periodName || '');
    if (details) {
      const classEndTime = new Date();
      classEndTime.setHours(details.end.hours, details.end.minutes, 0, 0);
      return now < classEndTime;
    }

    const timeSlot = parseTimeSlot(periodName || '');
    if (timeSlot) {
      const parsedTime = parseTime(timeSlot.end);
      if (parsedTime) {
        const classEndTime = new Date();
        classEndTime.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);

        if (now < classEndTime) {
          return true;
        }
      }
    }
  }

  return false;
}

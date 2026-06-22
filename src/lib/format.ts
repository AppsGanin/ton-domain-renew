import { plural } from './plural';

const DAY_MS = 24 * 60 * 60 * 1000;

export type ExpiryStatus = 'expired' | 'critical' | 'soon' | 'ok';

export interface ExpiryInfo {
  /** Whole days until expiry; negative if already expired. */
  daysLeft: number;
  status: ExpiryStatus;
  /** Localized expiry date, e.g. "22 июня 2026". */
  dateLabel: string;
  /** Short human phrase, e.g. "через 34 дня" / "истёк 3 дня назад". */
  relativeLabel: string;
}

const dateFmt = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const DAY_FORMS: [string, string, string] = ['день', 'дня', 'дней'];

export function describeExpiry(expiringAtSeconds: number, now: number = Date.now()): ExpiryInfo {
  const expiryMs = expiringAtSeconds * 1000;
  const daysLeft = Math.floor((expiryMs - now) / DAY_MS);

  let status: ExpiryStatus;
  if (daysLeft < 0) status = 'expired';
  else if (daysLeft <= 30) status = 'critical';
  else if (daysLeft <= 90) status = 'soon';
  else status = 'ok';

  let relativeLabel: string;
  if (daysLeft < 0) {
    const d = Math.abs(daysLeft);
    relativeLabel = `истёк ${d} ${plural(d, DAY_FORMS)} назад`;
  } else if (daysLeft === 0) {
    relativeLabel = 'истекает сегодня';
  } else {
    relativeLabel = `через ${daysLeft} ${plural(daysLeft, DAY_FORMS)}`;
  }

  return {
    daysLeft,
    status,
    dateLabel: dateFmt.format(new Date(expiryMs)),
    relativeLabel,
  };
}

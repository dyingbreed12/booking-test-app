export const CONTACT_EMAIL = 'leeEgino1178@outlook.com';

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);

export function isDemoLocked() {
  return TRUE_VALUES.has((process.env.DISABLE_DEMO ?? '').trim().toLowerCase());
}

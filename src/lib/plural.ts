type PluralForms = [one: string, few: string, many: string];

/**
 * Pick the Russian plural form for `n` (e.g. 1 домен / 2 домена / 5 доменов).
 * Sign-agnostic — pass an absolute count.
 */
export function plural(n: number, forms: PluralForms): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (last === 1) return forms[0];
  if (last >= 2 && last <= 4) return forms[1];
  return forms[2];
}

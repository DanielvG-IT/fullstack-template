export function formatServerTime(iso: string, locale = "nl-NL"): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "medium" }).format(
    new Date(iso),
  );
}

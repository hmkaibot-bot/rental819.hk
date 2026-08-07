/**
 * Address handling shared by the Gmail layer and the reservation recipients.
 *
 * These values come from environment variables that a human types into a
 * hosting dashboard, and a wrong paste there is silent: production once held an
 * OAuth access token in GMAIL_SENDER, which went straight into the From: header
 * and broke every send with nothing to show for it. Anything that is not an
 * address is now ignored in favour of the safe default.
 */

/** Deliberately loose — this rejects obvious junk, it is not RFC validation. */
const ADDRESS = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;

/** The bare address out of either `addr` or `Name <addr>`. */
export function addressOf(value: string): string {
  const v = value.trim();
  return (v.match(/<([^>]+)>/)?.[1] ?? v).trim();
}

export function isEmailAddress(value: string | null | undefined): boolean {
  return ADDRESS.test(addressOf(String(value ?? "")));
}

/**
 * Read an address (or `Name <addr>`) from the environment, falling back when it
 * is unset or not an address. Returns null when there is no fallback, so the
 * caller can omit the header entirely rather than emit something invalid.
 */
export function addressFromEnv<T extends string | null>(
  name: string,
  fallback: T,
): string | T {
  const raw = (process.env[name] ?? "").trim();
  if (!raw) return fallback;
  if (isEmailAddress(raw)) return raw;
  console.warn(
    `[email] ${name} is not an email address — ignoring it and using ${
      fallback ?? "the authorised account"
    }`,
  );
  return fallback;
}

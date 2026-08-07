import "server-only";

/**
 * Fixed recipients for the two operator emails sent from the reservation
 * back-office. Each can be overridden from the environment so the addresses can
 * change without a deploy, but the defaults are the live ones.
 */

/** Rental819 Japan — the partner that actually holds the bikes. */
export const JP_PARTNER_EMAIL =
  process.env.RENTAL819_JP_EMAIL || "info@mototoursjapan.com";

/**
 * Hong Kong staff who keep a copy of every reservation mail. Copied openly (Cc)
 * on the Japan mail, blind (Bcc) on the customer mail so the customer only ever
 * sees the company address.
 */
export const INTERNAL_COPY: string[] = (
  process.env.RESERVATION_COPY_EMAILS ||
  "rj.kwan@helmetking.com,matthew.tang@helmetking.com"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

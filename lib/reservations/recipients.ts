import "server-only";
import { addressFromEnv, isEmailAddress } from "@/lib/email-address";

/**
 * Fixed recipients for the two operator emails sent from the reservation
 * back-office. Each can be overridden from the environment so the addresses can
 * change without a deploy, but the defaults are the live ones. An override that
 * is not an address is ignored rather than posted as a recipient.
 */

/** Rental819 Japan — the partner that actually holds the bikes. */
export const JP_PARTNER_EMAIL = addressFromEnv(
  "RENTAL819_JP_EMAIL",
  "inquiry@mototoursjapan.com",
);

/**
 * Hong Kong staff who keep a copy of every reservation mail. Copied openly (Cc)
 * on the Japan mail, blind (Bcc) on the customer mail so the customer only ever
 * sees the company address.
 */
export const INTERNAL_COPY: string[] = (() => {
  const fallback = "rj.kwan@helmetking.com,matthew.tang@helmetking.com";
  const raw = (process.env.RESERVATION_COPY_EMAILS ?? "").trim() || fallback;
  const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const good = list.filter(isEmailAddress);
  if (good.length !== list.length) {
    console.warn(
      "[recipients] RESERVATION_COPY_EMAILS contains entries that are not addresses — dropping them",
    );
  }
  return good.length ? good : fallback.split(",");
})();

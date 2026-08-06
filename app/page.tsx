import { permanentRedirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n";

// Concrete route for `/` so it is always served (and redirects to the default
// locale) regardless of routing-config quirks on the host. `permanentRedirect`
// emits 308, matching the edge redirect in next.config.mjs and the legacy map.
export default function RootPage() {
  permanentRedirect(`/${defaultLocale}`);
}

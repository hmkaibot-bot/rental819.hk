import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n";

// Concrete route for `/` so it is always served (and redirects to the default
// locale) regardless of routing-config quirks on the host.
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}

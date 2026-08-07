import "server-only";
import { cookies } from "next/headers";
import { ADMIN_LANG_COOKIE, adminDict, isAdminLang, type AdminLang } from "./i18n";

/** The admin UI language for this request. Defaults to 中文. */
export function getAdminLang(): AdminLang {
  const v = cookies().get(ADMIN_LANG_COOKIE)?.value;
  return isAdminLang(v) ? v : "zh";
}

/** Resolved dictionary for this request — `const t = getAdminDict()`. */
export function getAdminDict() {
  return adminDict(getAdminLang());
}

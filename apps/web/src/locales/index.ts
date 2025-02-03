import { createI18n } from "next-international";

export const {
  useScopedI18n,
  I18nProvider,
  getLocaleProps,
  useChangeLocale,
  useCurrentLocale,
} = createI18n({
  en: () => import("./en"),
  de: () => import("./de"),
  id: () => import("./id"),
  fr: () => import("./fr"),
});

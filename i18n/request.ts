import { getRequestConfig } from "next-intl/server";
import enMessages from "../messages/en.json";
import esMessages from "../messages/es.json";

const messages: Record<string, unknown> = {
  en: enMessages,
  es: esMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? "en";
  const validLocale = ["en", "es"].includes(locale) ? locale : "en";
  return {
    locale: validLocale,
    messages: (messages[validLocale] || enMessages) as Record<string, unknown>,
  };
});

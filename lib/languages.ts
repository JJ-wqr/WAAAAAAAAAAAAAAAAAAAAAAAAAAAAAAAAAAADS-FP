export type LangCode = "ja" | "en" | "es" | "fr" | "id";

export type LangInfo = { code: LangCode; flag: string; name: string };

export const LANGUAGES: LangInfo[] = [
  { code: "ja", flag: "🇯🇵", name: "Japanese" },
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "es", flag: "🇪🇸", name: "Spanish" },
  { code: "fr", flag: "🇫🇷", name: "French" },
  { code: "id", flag: "🇮🇩", name: "Indonesian" },
];

export function getLangInfo(code: LangCode) {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

/** Returns the Firestore lessonProgress key for a given language + lesson id */
export function progressKey(lang: LangCode, id: string | number): string {
  return lang === "ja" ? String(id) : `${lang}_${id}`;
}

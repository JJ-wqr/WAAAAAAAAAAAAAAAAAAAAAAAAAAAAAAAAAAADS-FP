"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { type LangCode } from "@/lib/languages";

const LangContext = createContext<{
  lang: LangCode;
  setLang: (l: LangCode) => void;
}>({ lang: "ja", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("ja");

  useEffect(() => {
    const saved = localStorage.getItem("linguiny_lang") as LangCode;
    if (saved && ["ja", "en", "es", "fr"].includes(saved)) setLangState(saved);
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("linguiny_lang", l);
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

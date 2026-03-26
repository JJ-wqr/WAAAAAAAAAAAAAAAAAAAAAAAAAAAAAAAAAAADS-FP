import { type LangCode } from "@/lib/languages";

export interface VocabWord {
  word: string;
  romaji: string;
  meaning: string;
  category: string;
  mastery: number;
  known: boolean;
}

export const vocabularyData: Record<LangCode, VocabWord[]> = {
  ja: [
    { word: "食べる", romaji: "taberu", meaning: "to eat", category: "Verbs", mastery: 90, known: true },
    { word: "飲む", romaji: "nomu", meaning: "to drink", category: "Verbs", mastery: 75, known: true },
    { word: "学校", romaji: "gakkō", meaning: "school", category: "Nouns", mastery: 100, known: true },
    { word: "電車", romaji: "densha", meaning: "train", category: "Nouns", mastery: 60, known: true },
    { word: "走る", romaji: "hashiru", meaning: "to run", category: "Verbs", mastery: 40, known: false },
    { word: "綺麗", romaji: "kirei", meaning: "beautiful / clean", category: "Adjectives", mastery: 85, known: true },
    { word: "難しい", romaji: "muzukashii", meaning: "difficult", category: "Adjectives", mastery: 30, known: false },
    { word: "友達", romaji: "tomodachi", meaning: "friend", category: "Nouns", mastery: 95, known: true },
    { word: "仕事", romaji: "shigoto", meaning: "work / job", category: "Nouns", mastery: 70, known: true },
    { word: "読む", romaji: "yomu", meaning: "to read", category: "Verbs", mastery: 55, known: false },
    { word: "可愛い", romaji: "kawaii", meaning: "cute", category: "Adjectives", mastery: 80, known: true },
    { word: "忘れる", romaji: "wasureru", meaning: "to forget", category: "Verbs", mastery: 25, known: false },
  ],
  en: [
    { word: "achieve", romaji: "uh-CHEEV", meaning: "to succeed in reaching a goal", category: "Verbs", mastery: 85, known: true },
    { word: "explore", romaji: "ex-PLOR", meaning: "to travel or investigate to learn", category: "Verbs", mastery: 70, known: true },
    { word: "communicate", romaji: "kuh-MYOO-ni-kayt", meaning: "to share information", category: "Verbs", mastery: 40, known: false },
    { word: "improve", romaji: "im-PROOV", meaning: "to become better", category: "Verbs", mastery: 35, known: false },
    { word: "discover", romaji: "dis-KUV-er", meaning: "to find out or learn about", category: "Verbs", mastery: 75, known: true },
    { word: "journey", romaji: "JER-nee", meaning: "a long trip or travel", category: "Nouns", mastery: 90, known: true },
    { word: "knowledge", romaji: "NOL-ij", meaning: "information and understanding", category: "Nouns", mastery: 75, known: true },
    { word: "challenge", romaji: "CHAL-enj", meaning: "something difficult", category: "Nouns", mastery: 65, known: true },
    { word: "opportunity", romaji: "op-er-TYOO-ni-tee", meaning: "a chance to do something", category: "Nouns", mastery: 60, known: true },
    { word: "confident", romaji: "KON-fi-dent", meaning: "feeling sure of yourself", category: "Adjectives", mastery: 80, known: true },
    { word: "brilliant", romaji: "BRIL-yent", meaning: "very clever or bright", category: "Adjectives", mastery: 55, known: false },
    { word: "determined", romaji: "dih-TER-mind", meaning: "firmly decided to do something", category: "Adjectives", mastery: 50, known: false },
  ],
  es: [
    { word: "comer", romaji: "koh-MER", meaning: "to eat", category: "Verbs", mastery: 90, known: true },
    { word: "hablar", romaji: "ah-BLAR", meaning: "to speak", category: "Verbs", mastery: 80, known: true },
    { word: "correr", romaji: "koh-RER", meaning: "to run", category: "Verbs", mastery: 45, known: false },
    { word: "leer", romaji: "leh-ER", meaning: "to read", category: "Verbs", mastery: 60, known: true },
    { word: "olvidar", romaji: "ol-vee-DAR", meaning: "to forget", category: "Verbs", mastery: 30, known: false },
    { word: "escuela", romaji: "es-KWEH-lah", meaning: "school", category: "Nouns", mastery: 95, known: true },
    { word: "tren", romaji: "TREN", meaning: "train", category: "Nouns", mastery: 70, known: true },
    { word: "amigo", romaji: "ah-MEE-goh", meaning: "friend", category: "Nouns", mastery: 100, known: true },
    { word: "trabajo", romaji: "trah-BAH-hoh", meaning: "work / job", category: "Nouns", mastery: 75, known: true },
    { word: "bonito", romaji: "boh-NEE-toh", meaning: "pretty / nice", category: "Adjectives", mastery: 65, known: true },
    { word: "difícil", romaji: "dee-FEE-seel", meaning: "difficult", category: "Adjectives", mastery: 35, known: false },
    { word: "simpático", romaji: "seem-PAH-tee-koh", meaning: "friendly / nice", category: "Adjectives", mastery: 50, known: false },
  ],
  fr: [
    { word: "manger", romaji: "mahn-ZHAY", meaning: "to eat", category: "Verbs", mastery: 90, known: true },
    { word: "parler", romaji: "par-LAY", meaning: "to speak", category: "Verbs", mastery: 85, known: true },
    { word: "courir", romaji: "koo-REER", meaning: "to run", category: "Verbs", mastery: 40, known: false },
    { word: "lire", romaji: "LEER", meaning: "to read", category: "Verbs", mastery: 55, known: false },
    { word: "oublier", romaji: "oo-blee-AY", meaning: "to forget", category: "Verbs", mastery: 25, known: false },
    { word: "école", romaji: "ay-KOL", meaning: "school", category: "Nouns", mastery: 95, known: true },
    { word: "train", romaji: "TRAN", meaning: "train", category: "Nouns", mastery: 80, known: true },
    { word: "ami / amie", romaji: "ah-MEE", meaning: "friend", category: "Nouns", mastery: 100, known: true },
    { word: "travail", romaji: "trah-VYE", meaning: "work / job", category: "Nouns", mastery: 70, known: true },
    { word: "beau / belle", romaji: "BOH / BEL", meaning: "beautiful / handsome", category: "Adjectives", mastery: 75, known: true },
    { word: "difficile", romaji: "dee-fee-SEEL", meaning: "difficult", category: "Adjectives", mastery: 30, known: false },
    { word: "sympathique", romaji: "san-pah-TEEK", meaning: "friendly / nice", category: "Adjectives", mastery: 60, known: true },
  ],
};

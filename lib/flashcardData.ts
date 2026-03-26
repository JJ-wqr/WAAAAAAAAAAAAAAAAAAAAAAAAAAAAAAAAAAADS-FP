import { type LangCode } from "@/lib/languages";

export interface Flashcard {
  front: string;
  hint: string;
  back: string;
  example: string;
}

export const flashcardDecks: Record<LangCode, Flashcard[]> = {
  ja: [
    { front: "食べる", hint: "taberu", back: "to eat", example: "私は毎日ご飯を食べる。\n(I eat rice every day.)" },
    { front: "飲む", hint: "nomu", back: "to drink", example: "水を飲む。\n(I drink water.)" },
    { front: "学校", hint: "gakkō", back: "school", example: "学校に行く。\n(I go to school.)" },
    { front: "電車", hint: "densha", back: "train", example: "電車で来た。\n(I came by train.)" },
    { front: "友達", hint: "tomodachi", back: "friend", example: "友達と遊ぶ。\n(I play with friends.)" },
    { front: "仕事", hint: "shigoto", back: "work / job", example: "仕事が好きです。\n(I like my job.)" },
  ],
  en: [
    { front: "achieve", hint: "uh-CHEEV", back: "to succeed in reaching a goal", example: "She worked hard to achieve her dreams.\n(Verb: to accomplish something)" },
    { front: "journey", hint: "JER-nee", back: "a long trip or travel", example: "Life is a beautiful journey.\n(Noun: an act of travelling)" },
    { front: "knowledge", hint: "NOL-ij", back: "information and understanding", example: "Reading books increases your knowledge.\n(Noun: facts acquired through experience)" },
    { front: "confident", hint: "KON-fi-dent", back: "feeling sure about yourself", example: "She is confident in her abilities.\n(Adjective: self-assured)" },
    { front: "explore", hint: "ex-PLOR", back: "to travel or investigate to learn", example: "Let's explore the new city together.\n(Verb: to investigate or discover)" },
    { front: "challenge", hint: "CHAL-enj", back: "something difficult that requires effort", example: "Learning a language is a rewarding challenge.\n(Noun: a difficult but worthwhile task)" },
  ],
  es: [
    { front: "comer", hint: "koh-MER", back: "to eat", example: "Yo como arroz cada día.\n(I eat rice every day.)" },
    { front: "hablar", hint: "ah-BLAR", back: "to speak / to talk", example: "Ella habla español muy bien.\n(She speaks Spanish very well.)" },
    { front: "amigo", hint: "ah-MEE-goh", back: "friend", example: "Mi amigo se llama Carlos.\n(My friend's name is Carlos.)" },
    { front: "agua", hint: "AH-gwah", back: "water", example: "Necesito agua, por favor.\n(I need water, please.)" },
    { front: "casa", hint: "KAH-sah", back: "house / home", example: "Mi casa es grande.\n(My house is big.)" },
    { front: "trabajo", hint: "trah-BAH-hoh", back: "work / job", example: "Me gusta mi trabajo.\n(I like my job.)" },
  ],
  fr: [
    { front: "manger", hint: "mahn-ZHAY", back: "to eat", example: "Je mange du pain chaque matin.\n(I eat bread every morning.)" },
    { front: "parler", hint: "par-LAY", back: "to speak / to talk", example: "Elle parle français très bien.\n(She speaks French very well.)" },
    { front: "ami / amie", hint: "ah-MEE", back: "friend", example: "Mon ami s'appelle Pierre.\n(My friend's name is Pierre.)" },
    { front: "eau", hint: "OH", back: "water", example: "Je bois de l'eau chaque jour.\n(I drink water every day.)" },
    { front: "maison", hint: "meh-ZOHN", back: "house / home", example: "Ma maison est grande.\n(My house is big.)" },
    { front: "travail", hint: "trah-VYE", back: "work / job", example: "J'aime beaucoup mon travail.\n(I love my work very much.)" },
  ],
};

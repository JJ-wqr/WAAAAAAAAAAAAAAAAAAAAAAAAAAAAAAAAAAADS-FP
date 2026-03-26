import { type LangCode } from "@/lib/languages";

export interface Question {
  question: string;
  options: string[];
  answer: number;
}

export interface LessonQuiz {
  title: string;
  xp: number;
  questions: Question[];
}

export interface LessonMeta {
  id: number;
  title: string;
  duration: string;
  xp: number;
}

export interface UnitData {
  unit: number;
  title: string;
  lessons: LessonMeta[];
}

export const unitData: Record<LangCode, UnitData[]> = {
  ja: [
    {
      unit: 1, title: "Basics & Greetings",
      lessons: [
        { id: 1, title: "Hello & Goodbye", duration: "5 min", xp: 10 },
        { id: 2, title: "Introductions", duration: "8 min", xp: 15 },
        { id: 3, title: "Numbers 1–10", duration: "6 min", xp: 10 },
        { id: 4, title: "Colors & Shapes", duration: "10 min", xp: 20 },
      ],
    },
    {
      unit: 2, title: "Daily Life",
      lessons: [
        { id: 5, title: "Food & Drinks", duration: "12 min", xp: 20 },
        { id: 6, title: "At the Market", duration: "10 min", xp: 20 },
        { id: 7, title: "Time & Days", duration: "8 min", xp: 15 },
      ],
    },
    {
      unit: 3, title: "Grammar Foundations",
      lessons: [
        { id: 8, title: "Present Tense", duration: "15 min", xp: 25 },
        { id: 9, title: "Past Tense", duration: "18 min", xp: 30 },
        { id: 10, title: "Question Forms", duration: "12 min", xp: 25 },
      ],
    },
  ],
  en: [
    {
      unit: 1, title: "Basics & Greetings",
      lessons: [
        { id: 1, title: "Hello & Goodbye", duration: "5 min", xp: 10 },
        { id: 2, title: "Introductions", duration: "8 min", xp: 15 },
        { id: 3, title: "Numbers 1–10", duration: "6 min", xp: 10 },
        { id: 4, title: "Colors & Shapes", duration: "10 min", xp: 20 },
      ],
    },
    {
      unit: 2, title: "Daily Life",
      lessons: [
        { id: 5, title: "Food & Drinks", duration: "12 min", xp: 20 },
        { id: 6, title: "At the Store", duration: "10 min", xp: 20 },
        { id: 7, title: "Time & Days", duration: "8 min", xp: 15 },
      ],
    },
    {
      unit: 3, title: "Grammar Foundations",
      lessons: [
        { id: 8, title: "Present Tense", duration: "15 min", xp: 25 },
        { id: 9, title: "Past Tense", duration: "18 min", xp: 30 },
        { id: 10, title: "Question Forms", duration: "12 min", xp: 25 },
      ],
    },
  ],
  es: [
    {
      unit: 1, title: "Básicos y Saludos",
      lessons: [
        { id: 1, title: "Hello & Goodbye", duration: "5 min", xp: 10 },
        { id: 2, title: "Introductions", duration: "8 min", xp: 15 },
        { id: 3, title: "Numbers 1–10", duration: "6 min", xp: 10 },
        { id: 4, title: "Colors & Shapes", duration: "10 min", xp: 20 },
      ],
    },
    {
      unit: 2, title: "Vida Cotidiana",
      lessons: [
        { id: 5, title: "Food & Drinks", duration: "12 min", xp: 20 },
        { id: 6, title: "At the Market", duration: "10 min", xp: 20 },
        { id: 7, title: "Time & Days", duration: "8 min", xp: 15 },
      ],
    },
    {
      unit: 3, title: "Fundamentos de Gramática",
      lessons: [
        { id: 8, title: "Present Tense", duration: "15 min", xp: 25 },
        { id: 9, title: "Past Tense", duration: "18 min", xp: 30 },
        { id: 10, title: "Question Forms", duration: "12 min", xp: 25 },
      ],
    },
  ],
  fr: [
    {
      unit: 1, title: "Bases & Salutations",
      lessons: [
        { id: 1, title: "Hello & Goodbye", duration: "5 min", xp: 10 },
        { id: 2, title: "Introductions", duration: "8 min", xp: 15 },
        { id: 3, title: "Numbers 1–10", duration: "6 min", xp: 10 },
        { id: 4, title: "Colors & Shapes", duration: "10 min", xp: 20 },
      ],
    },
    {
      unit: 2, title: "La Vie Quotidienne",
      lessons: [
        { id: 5, title: "Food & Drinks", duration: "12 min", xp: 20 },
        { id: 6, title: "At the Market", duration: "10 min", xp: 20 },
        { id: 7, title: "Time & Days", duration: "8 min", xp: 15 },
      ],
    },
    {
      unit: 3, title: "Fondements de Grammaire",
      lessons: [
        { id: 8, title: "Present Tense", duration: "15 min", xp: 25 },
        { id: 9, title: "Past Tense", duration: "18 min", xp: 30 },
        { id: 10, title: "Question Forms", duration: "12 min", xp: 25 },
      ],
    },
  ],
};

export const lessonQuizzes: Record<LangCode, Record<string, LessonQuiz>> = {
  ja: {
    "1": {
      title: "Hello & Goodbye", xp: 10,
      questions: [
        { question: "How do you say 'Hello' in Japanese?", options: ["さようなら", "ありがとう", "こんにちは", "すみません"], answer: 2 },
        { question: "What does 'さようなら' mean?", options: ["Hello", "Thank you", "Sorry", "Goodbye"], answer: 3 },
        { question: "How do you say 'Good morning'?", options: ["こんばんは", "おはようございます", "こんにちは", "おやすみ"], answer: 1 },
        { question: "What does 'おやすみ' mean?", options: ["Good morning", "Good afternoon", "Goodnight", "Goodbye"], answer: 2 },
        { question: "How do you greet someone in the evening?", options: ["おはよう", "こんにちは", "こんばんは", "さようなら"], answer: 2 },
      ],
    },
    "2": {
      title: "Introductions", xp: 15,
      questions: [
        { question: "How do you say 'My name is...' in Japanese?", options: ["わたしは〜です", "わたしの〜", "〜がすきです", "〜をください"], answer: 0 },
        { question: "What does 'よろしくおねがいします' mean?", options: ["Goodbye", "Thank you", "Nice to meet you", "Sorry"], answer: 2 },
        { question: "How do you ask 'What is your name?'", options: ["おなまえはなんですか", "どこですか", "なんさいですか", "どうですか"], answer: 0 },
        { question: "What does 'はじめまして' mean?", options: ["See you later", "Nice to meet you", "Thank you", "Excuse me"], answer: 1 },
        { question: "How do you say 'I am a student'?", options: ["わたしはせんせいです", "わたしはがくせいです", "わたしはいしゃです", "わたしはかいしゃいんです"], answer: 1 },
      ],
    },
    "3": {
      title: "Numbers 1–10", xp: 10,
      questions: [
        { question: "What is 三 (さん)?", options: ["1", "2", "3", "4"], answer: 2 },
        { question: "How do you say '7' in Japanese?", options: ["ろく", "しち", "はち", "きゅう"], answer: 1 },
        { question: "What is 十 (じゅう)?", options: ["8", "9", "10", "6"], answer: 2 },
        { question: "How do you say '2' in Japanese?", options: ["いち", "に", "さん", "し"], answer: 1 },
        { question: "What does 五 mean?", options: ["3", "4", "5", "6"], answer: 2 },
      ],
    },
    "4": {
      title: "Colors & Shapes", xp: 20,
      questions: [
        { question: "What is 赤 (あか) in English?", options: ["Blue", "Red", "Green", "Yellow"], answer: 1 },
        { question: "How do you say 'circle' in Japanese?", options: ["三角形", "四角形", "丸", "星"], answer: 2 },
        { question: "What color is 青 (あお)?", options: ["Red", "White", "Black", "Blue"], answer: 3 },
        { question: "What is 黄色 (きいろ) in English?", options: ["Pink", "Purple", "Yellow", "Orange"], answer: 2 },
        { question: "How do you say 'triangle' in Japanese?", options: ["丸", "三角形", "四角形", "星"], answer: 1 },
      ],
    },
    "5": {
      title: "Food & Drinks", xp: 20,
      questions: [
        { question: "What is ごはん (ご飯) in English?", options: ["Bread", "Rice", "Noodles", "Soup"], answer: 1 },
        { question: "How do you say 'water' in Japanese?", options: ["ジュース", "ミルク", "お茶", "水"], answer: 3 },
        { question: "What is パン in English?", options: ["Cake", "Cookie", "Bread", "Rice"], answer: 2 },
        { question: "How do you say 'delicious' in Japanese?", options: ["まずい", "おいしい", "からい", "あまい"], answer: 1 },
        { question: "What is 牛乳 (ぎゅうにゅう)?", options: ["Juice", "Tea", "Water", "Milk"], answer: 3 },
      ],
    },
    "6": {
      title: "At the Market", xp: 20,
      questions: [
        { question: "How do you say 'How much is this?' in Japanese?", options: ["これはなんですか", "これはいくらですか", "これをください", "ここはどこですか"], answer: 1 },
        { question: "What does 安い (やすい) mean?", options: ["Expensive", "Cheap", "Free", "Sold out"], answer: 1 },
        { question: "How do you say 'I'll take this'?", options: ["いりません", "これはいくら", "これをください", "ありがとう"], answer: 2 },
        { question: "What is 高い (たかい) in English?", options: ["Cheap", "Big", "Expensive", "Small"], answer: 2 },
        { question: "How do you say 'Do you have...?' in Japanese?", options: ["〜がありますか", "〜をください", "〜はどこ", "〜はいくら"], answer: 0 },
      ],
    },
    "7": {
      title: "Time & Days", xp: 15,
      questions: [
        { question: "How do you say 'Monday' in Japanese?", options: ["火曜日", "水曜日", "月曜日", "木曜日"], answer: 2 },
        { question: "What does 今日 (きょう) mean?", options: ["Yesterday", "Tomorrow", "Today", "This week"], answer: 2 },
        { question: "How do you say '3 o'clock'?", options: ["さんじ", "みっつ", "さんにち", "さんかい"], answer: 0 },
        { question: "What is 明日 (あした)?", options: ["Today", "Yesterday", "Tomorrow", "Next week"], answer: 2 },
        { question: "How do you say 'Sunday' in Japanese?", options: ["土曜日", "金曜日", "日曜日", "月曜日"], answer: 2 },
      ],
    },
    "8": {
      title: "Present Tense", xp: 25,
      questions: [
        { question: "What is the present form of 食べる (to eat)?", options: ["食べた", "食べる", "食べて", "食べない"], answer: 1 },
        { question: "How do you say 'I go to school'?", options: ["がっこうにいった", "がっこうにいく", "がっこうにいて", "がっこうにいない"], answer: 1 },
        { question: "What does 〜ます mean at the end of a verb?", options: ["Past tense", "Negative", "Polite present/future", "Request"], answer: 2 },
        { question: "How do you say 'I read a book'?", options: ["ほんをよんだ", "ほんをよむ", "ほんをよんで", "ほんをよまない"], answer: 1 },
        { question: "What is the polite form of 行く (いく)?", options: ["いきます", "いきました", "いきません", "いきたい"], answer: 0 },
      ],
    },
    "9": {
      title: "Past Tense", xp: 30,
      questions: [
        { question: "What is the past form of 食べる (to eat)?", options: ["食べる", "食べます", "食べた", "食べない"], answer: 2 },
        { question: "How do you say 'I went to Japan'?", options: ["にほんにいく", "にほんにいった", "にほんにいきます", "にほんにいない"], answer: 1 },
        { question: "What is the polite past of 飲む (to drink)?", options: ["のみます", "のみました", "のんだ", "のみません"], answer: 1 },
        { question: "How do you say 'I studied'?", options: ["べんきょうする", "べんきょうします", "べんきょうした", "べんきょうしない"], answer: 2 },
        { question: "What does 〜ました mean?", options: ["Polite present", "Polite past", "Negative past", "Future"], answer: 1 },
      ],
    },
    "10": {
      title: "Question Forms", xp: 25,
      questions: [
        { question: "How do you form a yes/no question in Japanese?", options: ["Add か at the end", "Add は at the start", "Add の at the end", "Change word order"], answer: 0 },
        { question: "How do you say 'Where is it?'", options: ["なんですか", "どこですか", "だれですか", "いつですか"], answer: 1 },
        { question: "What does いつ mean?", options: ["Who", "Where", "When", "What"], answer: 2 },
        { question: "How do you say 'Why?' in Japanese?", options: ["なに", "どこ", "なぜ", "どれ"], answer: 2 },
        { question: "What particle marks a question in Japanese?", options: ["は", "が", "か", "を"], answer: 2 },
      ],
    },
  },

  en: {
    "1": {
      title: "Hello & Goodbye", xp: 10,
      questions: [
        { question: "What is the most common greeting in English?", options: ["Good evening", "How are you", "Hello", "See you later"], answer: 2 },
        { question: "Which is the formal way to say goodbye?", options: ["Later!", "Goodbye", "Ciao", "Bye-bye"], answer: 1 },
        { question: "What greeting is used in the morning?", options: ["Good afternoon", "Good evening", "Goodnight", "Good morning"], answer: 3 },
        { question: "Which is a casual way to say hello?", options: ["Farewell", "Greetings", "Hi", "Good day"], answer: 2 },
        { question: "What do you say when you'll see someone later?", options: ["Goodbye forever", "See you later", "Good morning", "Hello"], answer: 1 },
      ],
    },
    "2": {
      title: "Introductions", xp: 15,
      questions: [
        { question: "How do you introduce yourself in English?", options: ["I is...", "My name is...", "Me called...", "Called I..."], answer: 1 },
        { question: "How do you ask someone's name?", options: ["Who is you?", "What your name?", "What is your name?", "Your name?"], answer: 2 },
        { question: "How do you say where you are from?", options: ["I from is...", "I am from...", "From I...", "I comes from..."], answer: 1 },
        { question: "What do you say when meeting someone new?", options: ["See you later", "Goodbye", "Nice to meet you", "Good evening"], answer: 2 },
        { question: "How do you ask someone how they are?", options: ["What are you?", "How do you do?", "What do you do?", "How is your?"], answer: 1 },
      ],
    },
    "3": {
      title: "Numbers 1–10", xp: 10,
      questions: [
        { question: "How do you spell the number 3?", options: ["Two", "Four", "Three", "Five"], answer: 2 },
        { question: "What number comes after seven?", options: ["Six", "Nine", "Eight", "Ten"], answer: 2 },
        { question: "How do you write 10 in words?", options: ["Nine", "Eleven", "Seven", "Ten"], answer: 3 },
        { question: "What is the number after five in words?", options: ["Four", "Six", "Seven", "Eight"], answer: 1 },
        { question: "How do you spell the number 2?", options: ["One", "Three", "Two", "Four"], answer: 2 },
      ],
    },
    "4": {
      title: "Colors & Shapes", xp: 20,
      questions: [
        { question: "What color is the sky on a clear day?", options: ["Red", "Green", "Blue", "Yellow"], answer: 2 },
        { question: "What shape has 4 equal sides?", options: ["Circle", "Triangle", "Rectangle", "Square"], answer: 3 },
        { question: "What color is a ripe tomato?", options: ["Blue", "Green", "Purple", "Red"], answer: 3 },
        { question: "How many sides does a triangle have?", options: ["2", "4", "3", "5"], answer: 2 },
        { question: "What color is grass?", options: ["Yellow", "Blue", "Green", "Orange"], answer: 2 },
      ],
    },
    "5": {
      title: "Food & Drinks", xp: 20,
      questions: [
        { question: "Which of these is a drink?", options: ["Apple", "Sandwich", "Water", "Pizza"], answer: 2 },
        { question: "What do you call the first meal of the day?", options: ["Dinner", "Lunch", "Snack", "Breakfast"], answer: 3 },
        { question: "Which of these is a fruit?", options: ["Carrot", "Bread", "Banana", "Cheese"], answer: 2 },
        { question: "What is a common hot drink?", options: ["Juice", "Tea", "Lemonade", "Milk"], answer: 1 },
        { question: "Which word means the evening meal?", options: ["Breakfast", "Brunch", "Lunch", "Dinner"], answer: 3 },
      ],
    },
    "6": {
      title: "At the Store", xp: 20,
      questions: [
        { question: "How do you ask the price of something?", options: ["What color is this?", "How much is this?", "What is this?", "Is this good?"], answer: 1 },
        { question: "What does 'expensive' mean?", options: ["Cheap", "Free", "Costly", "On sale"], answer: 2 },
        { question: "Where do you pay for items in a shop?", options: ["Entrance", "Fitting room", "Aisle", "Checkout"], answer: 3 },
        { question: "What is a 'receipt'?", options: ["A price tag", "A shopping list", "Proof of purchase", "Store hours"], answer: 2 },
        { question: "What word means not expensive?", options: ["Pricey", "Cheap", "Costly", "Rare"], answer: 1 },
      ],
    },
    "7": {
      title: "Time & Days", xp: 15,
      questions: [
        { question: "What day comes after Monday?", options: ["Sunday", "Wednesday", "Tuesday", "Thursday"], answer: 2 },
        { question: "What does 'yesterday' mean?", options: ["Tomorrow", "Today", "The day before today", "Next week"], answer: 2 },
        { question: "How many days are in a week?", options: ["5", "6", "7", "8"], answer: 2 },
        { question: "What is the first month of the year?", options: ["February", "March", "December", "January"], answer: 3 },
        { question: "What does 'noon' mean?", options: ["Midnight", "12 o'clock at night", "12 o'clock midday", "Early morning"], answer: 2 },
      ],
    },
    "8": {
      title: "Present Tense", xp: 25,
      questions: [
        { question: "Which sentence is in the present tense?", options: ["She walked home", "She walks home", "She will walk home", "She had walked home"], answer: 1 },
        { question: "What is the third-person singular of 'to go'?", options: ["go", "goes", "went", "going"], answer: 1 },
        { question: "Which sentence is correct present tense?", options: ["They reads books", "They readed books", "They read books", "They is read books"], answer: 2 },
        { question: "What does 'She is running' express?", options: ["A past action", "A future plan", "A current ongoing action", "A habitual action"], answer: 2 },
        { question: "How do you express a habitual action in English?", options: ["I am eating lunch", "I ate lunch", "I eat lunch every day", "I will eat lunch"], answer: 2 },
      ],
    },
    "9": {
      title: "Past Tense", xp: 30,
      questions: [
        { question: "What is the past tense of 'eat'?", options: ["eats", "eating", "eaten", "ate"], answer: 3 },
        { question: "What is the past tense of 'go'?", options: ["goes", "goed", "gone", "went"], answer: 3 },
        { question: "How do you form regular past tense in English?", options: ["Add -s", "Add -ing", "Add -ed", "Add -es"], answer: 2 },
        { question: "What is the past tense of 'see'?", options: ["seed", "sawed", "saw", "seen"], answer: 2 },
        { question: "Which sentence is in the past tense?", options: ["I walk to school", "I am walking", "I walked to school", "I will walk"], answer: 2 },
      ],
    },
    "10": {
      title: "Question Forms", xp: 25,
      questions: [
        { question: "How do you form a yes/no question in English?", options: ["Put verb at end", "Add '?' at start", "Use do/does/is + subject", "Change word order only"], answer: 2 },
        { question: "Which word asks about a place?", options: ["Who", "When", "Where", "What"], answer: 2 },
        { question: "What does 'When' ask about?", options: ["Person", "Place", "Time", "Reason"], answer: 2 },
        { question: "How do you ask 'for what reason'?", options: ["Who", "What", "Where", "Why"], answer: 3 },
        { question: "Which is a correct question?", options: ["You are happy?", "Are you happy?", "Happy are you?", "Is you happy?"], answer: 1 },
      ],
    },
  },

  es: {
    "1": {
      title: "Hello & Goodbye", xp: 10,
      questions: [
        { question: "How do you say 'Hello' in Spanish?", options: ["Adiós", "Gracias", "Hola", "Por favor"], answer: 2 },
        { question: "What does 'Adiós' mean?", options: ["Hello", "Thank you", "Goodbye", "Please"], answer: 2 },
        { question: "How do you say 'Good morning' in Spanish?", options: ["Buenas noches", "Buenas tardes", "Buenos días", "Hasta luego"], answer: 2 },
        { question: "What does 'Hasta luego' mean?", options: ["Good morning", "Hello", "Good night", "See you later"], answer: 3 },
        { question: "How do you greet someone in the afternoon?", options: ["Buenos días", "Hola", "Buenas noches", "Buenas tardes"], answer: 3 },
      ],
    },
    "2": {
      title: "Introductions", xp: 15,
      questions: [
        { question: "How do you say 'My name is...' in Spanish?", options: ["Yo soy de...", "Me llamo...", "Tengo...", "Vivo en..."], answer: 1 },
        { question: "What does '¿Cómo te llamas?' mean?", options: ["Where are you from?", "How old are you?", "What is your name?", "How are you?"], answer: 2 },
        { question: "How do you say 'Nice to meet you' in Spanish?", options: ["Lo siento", "Hasta luego", "Mucho gusto", "De nada"], answer: 2 },
        { question: "How do you ask 'How are you?' informally?", options: ["¿Cómo estás?", "¿Dónde estás?", "¿Quién eres?", "¿Qué haces?"], answer: 0 },
        { question: "How do you say 'I am a student' in Spanish?", options: ["Soy profesora", "Soy estudiante", "Tengo un trabajo", "Vivo en la escuela"], answer: 1 },
      ],
    },
    "3": {
      title: "Numbers 1–10", xp: 10,
      questions: [
        { question: "What is 'tres' in English?", options: ["1", "2", "3", "4"], answer: 2 },
        { question: "How do you say '7' in Spanish?", options: ["seis", "siete", "ocho", "nueve"], answer: 1 },
        { question: "What is 'diez' in English?", options: ["8", "9", "10", "6"], answer: 2 },
        { question: "How do you say '2' in Spanish?", options: ["uno", "dos", "tres", "cuatro"], answer: 1 },
        { question: "What does 'cinco' mean?", options: ["3", "4", "5", "6"], answer: 2 },
      ],
    },
    "4": {
      title: "Colors & Shapes", xp: 20,
      questions: [
        { question: "What is 'rojo' in English?", options: ["Blue", "Red", "Green", "Yellow"], answer: 1 },
        { question: "How do you say 'circle' in Spanish?", options: ["cuadrado", "triángulo", "círculo", "estrella"], answer: 2 },
        { question: "What color is 'azul'?", options: ["Red", "White", "Black", "Blue"], answer: 3 },
        { question: "What is 'amarillo' in English?", options: ["Pink", "Purple", "Yellow", "Orange"], answer: 2 },
        { question: "How do you say 'triangle' in Spanish?", options: ["círculo", "triángulo", "cuadrado", "rectángulo"], answer: 1 },
      ],
    },
    "5": {
      title: "Food & Drinks", xp: 20,
      questions: [
        { question: "What is 'arroz' in English?", options: ["Bread", "Rice", "Noodles", "Soup"], answer: 1 },
        { question: "How do you say 'water' in Spanish?", options: ["leche", "café", "té", "agua"], answer: 3 },
        { question: "What is 'pan' in English?", options: ["Cake", "Cookie", "Bread", "Rice"], answer: 2 },
        { question: "How do you say 'delicious' in Spanish?", options: ["malo", "delicioso", "picante", "dulce"], answer: 1 },
        { question: "What is 'leche' in English?", options: ["Juice", "Tea", "Water", "Milk"], answer: 3 },
      ],
    },
    "6": {
      title: "At the Market", xp: 20,
      questions: [
        { question: "How do you say 'How much is this?' in Spanish?", options: ["¿Qué es esto?", "¿Cuánto cuesta esto?", "Quiero esto", "¿Dónde está?"], answer: 1 },
        { question: "What does 'barato' mean?", options: ["Expensive", "Cheap", "Free", "Sold out"], answer: 1 },
        { question: "How do you say 'I'll take this' in Spanish?", options: ["No lo quiero", "¿Cuánto cuesta?", "Me lo llevo", "Gracias"], answer: 2 },
        { question: "What is 'caro' in English?", options: ["Cheap", "Big", "Expensive", "Small"], answer: 2 },
        { question: "How do you say 'Do you have...?' in Spanish?", options: ["¿Tiene...?", "¿Quiere...?", "¿Dónde está...?", "¿Cuánto cuesta...?"], answer: 0 },
      ],
    },
    "7": {
      title: "Time & Days", xp: 15,
      questions: [
        { question: "How do you say 'Monday' in Spanish?", options: ["martes", "miércoles", "lunes", "jueves"], answer: 2 },
        { question: "What does 'hoy' mean?", options: ["Yesterday", "Tomorrow", "Today", "This week"], answer: 2 },
        { question: "How do you say '3 o'clock' in Spanish?", options: ["las tres", "tres minutos", "tercer día", "tres veces"], answer: 0 },
        { question: "What is 'mañana' (time) in English?", options: ["Today", "Yesterday", "Tomorrow", "Next week"], answer: 2 },
        { question: "How do you say 'Sunday' in Spanish?", options: ["sábado", "viernes", "domingo", "lunes"], answer: 2 },
      ],
    },
    "8": {
      title: "Present Tense", xp: 25,
      questions: [
        { question: "What is 'comer' for 'yo' in present tense?", options: ["comí", "como", "comeré", "comía"], answer: 1 },
        { question: "How do you say 'I go to school' in Spanish?", options: ["fui a la escuela", "voy a la escuela", "iré a la escuela", "iba a la escuela"], answer: 1 },
        { question: "What ending do regular -AR verbs take for 'él/ella'?", options: ["-o", "-as", "-a", "-amos"], answer: 2 },
        { question: "How do you say 'I read a book' in Spanish?", options: ["leí un libro", "leeré un libro", "leo un libro", "leía un libro"], answer: 2 },
        { question: "What is the present tense of 'ir' for 'nosotros'?", options: ["vamos", "voy", "vas", "va"], answer: 0 },
      ],
    },
    "9": {
      title: "Past Tense", xp: 30,
      questions: [
        { question: "What is 'comer' for 'yo' in preterite tense?", options: ["como", "comerá", "comí", "comía"], answer: 2 },
        { question: "How do you say 'I went to Spain' in Spanish?", options: ["voy a España", "fui a España", "iré a España", "iba a España"], answer: 1 },
        { question: "What ending do regular -AR verbs take for 'yo' in preterite?", options: ["-o", "-as", "-é", "-aba"], answer: 2 },
        { question: "How do you say 'I studied' in Spanish?", options: ["estudio", "estudiaré", "estudié", "estudiaba"], answer: 2 },
        { question: "What does the ending '-aron' indicate?", options: ["Present tense", "Future tense", "Preterite (they)", "Imperfect"], answer: 2 },
      ],
    },
    "10": {
      title: "Question Forms", xp: 25,
      questions: [
        { question: "How do you form a yes/no question in Spanish?", options: ["Add 'sí' at start", "Use ¿...? around the sentence", "Add '-ción' at end", "Change word order only"], answer: 1 },
        { question: "How do you say 'Where is it?' in Spanish?", options: ["¿Qué es?", "¿Dónde está?", "¿Quién es?", "¿Cuándo es?"], answer: 1 },
        { question: "What does '¿Cuándo?' mean?", options: ["Who", "Where", "When", "What"], answer: 2 },
        { question: "How do you ask 'Why?' in Spanish?", options: ["¿Qué?", "¿Dónde?", "¿Por qué?", "¿Cómo?"], answer: 2 },
        { question: "How do you ask 'How?' in Spanish?", options: ["¿Qué?", "¿Cuándo?", "¿Por qué?", "¿Cómo?"], answer: 3 },
      ],
    },
  },

  fr: {
    "1": {
      title: "Hello & Goodbye", xp: 10,
      questions: [
        { question: "How do you say 'Hello' in French?", options: ["Au revoir", "Merci", "Bonjour", "S'il vous plaît"], answer: 2 },
        { question: "What does 'Au revoir' mean?", options: ["Hello", "Thank you", "Goodbye", "Please"], answer: 2 },
        { question: "How do you say 'Good evening' in French?", options: ["Bonne nuit", "Bonjour", "Bonsoir", "À bientôt"], answer: 2 },
        { question: "What does 'À bientôt' mean?", options: ["Good morning", "Hello", "Goodnight", "See you soon"], answer: 3 },
        { question: "How do you say 'Goodnight' in French?", options: ["Bonjour", "Salut", "Bonsoir", "Bonne nuit"], answer: 3 },
      ],
    },
    "2": {
      title: "Introductions", xp: 15,
      questions: [
        { question: "How do you say 'My name is...' in French?", options: ["Je suis de...", "Je m'appelle...", "J'ai...", "J'habite à..."], answer: 1 },
        { question: "What does 'Comment t'appelles-tu?' mean?", options: ["Where are you from?", "How old are you?", "What is your name?", "How are you?"], answer: 2 },
        { question: "How do you say 'Nice to meet you' in French?", options: ["Je suis désolé", "Au revoir", "Enchanté(e)", "De rien"], answer: 2 },
        { question: "How do you ask 'How are you?' informally in French?", options: ["Comment allez-vous?", "Où es-tu?", "Qui es-tu?", "Comment vas-tu?"], answer: 3 },
        { question: "How do you say 'I am a student' in French?", options: ["Je suis professeur", "Je suis étudiant(e)", "J'ai un travail", "Je vis à l'école"], answer: 1 },
      ],
    },
    "3": {
      title: "Numbers 1–10", xp: 10,
      questions: [
        { question: "What is 'trois' in English?", options: ["1", "2", "3", "4"], answer: 2 },
        { question: "How do you say '7' in French?", options: ["six", "sept", "huit", "neuf"], answer: 1 },
        { question: "What is 'dix' in English?", options: ["8", "9", "10", "6"], answer: 2 },
        { question: "How do you say '2' in French?", options: ["un", "deux", "trois", "quatre"], answer: 1 },
        { question: "What does 'cinq' mean?", options: ["3", "4", "5", "6"], answer: 2 },
      ],
    },
    "4": {
      title: "Colors & Shapes", xp: 20,
      questions: [
        { question: "What is 'rouge' in English?", options: ["Blue", "Red", "Green", "Yellow"], answer: 1 },
        { question: "How do you say 'circle' in French?", options: ["carré", "triangle", "cercle", "étoile"], answer: 2 },
        { question: "What color is 'bleu'?", options: ["Red", "White", "Black", "Blue"], answer: 3 },
        { question: "What is 'jaune' in English?", options: ["Pink", "Purple", "Yellow", "Orange"], answer: 2 },
        { question: "How do you say 'triangle' in French?", options: ["cercle", "triangle", "carré", "rectangle"], answer: 1 },
      ],
    },
    "5": {
      title: "Food & Drinks", xp: 20,
      questions: [
        { question: "What is 'riz' in English?", options: ["Bread", "Rice", "Noodles", "Soup"], answer: 1 },
        { question: "How do you say 'water' in French?", options: ["lait", "café", "thé", "eau"], answer: 3 },
        { question: "What is 'pain' in English?", options: ["Cake", "Cookie", "Bread", "Rice"], answer: 2 },
        { question: "How do you say 'delicious' in French?", options: ["mauvais", "délicieux", "épicé", "sucré"], answer: 1 },
        { question: "What is 'lait' in English?", options: ["Juice", "Tea", "Water", "Milk"], answer: 3 },
      ],
    },
    "6": {
      title: "At the Market", xp: 20,
      questions: [
        { question: "How do you say 'How much is this?' in French?", options: ["Qu'est-ce que c'est?", "Combien ça coûte?", "Je veux ça", "Où est-il?"], answer: 1 },
        { question: "What does 'bon marché' mean?", options: ["Expensive", "Cheap", "Free", "Sold out"], answer: 1 },
        { question: "How do you say 'I'll take this' in French?", options: ["Je n'en veux pas", "Combien ça coûte?", "Je prends ça", "Merci"], answer: 2 },
        { question: "What is 'cher / chère' in English?", options: ["Cheap", "Big", "Expensive", "Small"], answer: 2 },
        { question: "How do you say 'Do you have...?' in French?", options: ["Avez-vous...?", "Voulez-vous...?", "Où est...?", "Combien coûte...?"], answer: 0 },
      ],
    },
    "7": {
      title: "Time & Days", xp: 15,
      questions: [
        { question: "How do you say 'Monday' in French?", options: ["mardi", "mercredi", "lundi", "jeudi"], answer: 2 },
        { question: "What does 'aujourd'hui' mean?", options: ["Yesterday", "Tomorrow", "Today", "This week"], answer: 2 },
        { question: "How do you say '3 o'clock' in French?", options: ["trois heures", "trois minutes", "troisième jour", "trois fois"], answer: 0 },
        { question: "What is 'demain' in English?", options: ["Today", "Yesterday", "Tomorrow", "Next week"], answer: 2 },
        { question: "How do you say 'Sunday' in French?", options: ["samedi", "vendredi", "dimanche", "lundi"], answer: 2 },
      ],
    },
    "8": {
      title: "Present Tense", xp: 25,
      questions: [
        { question: "What is 'manger' for 'je' in present tense?", options: ["mangeai", "mange", "mangera", "mangeais"], answer: 1 },
        { question: "How do you say 'I go to school' in French?", options: ["j'allais à l'école", "je vais à l'école", "j'irai à l'école", "je suis allé à l'école"], answer: 1 },
        { question: "What is the present tense of 'parler' for 'nous'?", options: ["parle", "parles", "parlons", "parlent"], answer: 2 },
        { question: "How do you say 'I read a book' in French?", options: ["j'ai lu un livre", "je lirai un livre", "je lis un livre", "je lisais un livre"], answer: 2 },
        { question: "What is the present tense of 'aller' for 'ils/elles'?", options: ["vont", "vais", "vas", "va"], answer: 0 },
      ],
    },
    "9": {
      title: "Past Tense", xp: 30,
      questions: [
        { question: "What is the passé composé of 'manger' for 'je'?", options: ["mange", "mangera", "j'ai mangé", "mangeais"], answer: 2 },
        { question: "How do you say 'I went to France' in French?", options: ["je vais en France", "je suis allé(e) en France", "j'irai en France", "j'allais en France"], answer: 1 },
        { question: "Which auxiliary verb is used for movement verbs in passé composé?", options: ["avoir", "être", "aller", "faire"], answer: 1 },
        { question: "How do you say 'I studied' in French?", options: ["j'étudie", "j'étudierai", "j'ai étudié", "j'étudiais"], answer: 2 },
        { question: "What does 'Il a mangé' mean in English?", options: ["He eats", "He will eat", "He ate / has eaten", "He was eating"], answer: 2 },
      ],
    },
    "10": {
      title: "Question Forms", xp: 25,
      questions: [
        { question: "How do you form a simple question in French?", options: ["Add 'oui' at start", "Use 'Est-ce que' + statement", "Add '-tion' at end", "Change word order only"], answer: 1 },
        { question: "How do you say 'Where is it?' in French?", options: ["Qu'est-ce que c'est?", "Où est-il?", "Qui est-il?", "Quand est-il?"], answer: 1 },
        { question: "What does 'Quand?' mean?", options: ["Who", "Where", "When", "What"], answer: 2 },
        { question: "How do you ask 'Why?' in French?", options: ["Quoi?", "Où?", "Pourquoi?", "Comment?"], answer: 2 },
        { question: "How do you ask 'How?' in French?", options: ["Quoi?", "Quand?", "Pourquoi?", "Comment?"], answer: 3 },
      ],
    },
  },
};

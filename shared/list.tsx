export type LanguageAgent = {
    id: number;
    specialist: string;
    language: string;
    languageCode: string;
    flag: string;
    description: string;
    image: string;
    agentPrompt: string;
    voiceId?: string;
    gender: "male" | "female";
    subscriptionRequired: boolean;
    primaryLanguage?: "Hindi" | "English";
    targetLanguage?: string;
    level?: string;
};

export const AITeacherAgents: LanguageAgent[] = [
    {
        id: 1,
        specialist: "German Tutor (Deutsch)",
        language: "German",
        languageCode: "de",
        flag: "🇩🇪",
        description: "Master German from basics to fluency. Learn cases (Nominativ, Dativ), vocabulary, pronunciation, and daily German dialogues.",
        image: "/physics1.jpg",
        agentPrompt: "Hallo! Guten Tag! I am your German Language Tutor. Whether your preferred language is English or Hindi, I will explain German grammar, cases, vocabulary, and sentence structures step-by-step. Let's start with basic greetings. Wie geht es dir? (How are you? / आप कैसे हैं?)",
        voiceId: "Arjun",
        gender: "male",
        subscriptionRequired: false,
    },
    {
        id: 2,
        specialist: "French Tutor (Français)",
        language: "French",
        languageCode: "fr",
        flag: "🇫🇷",
        description: "Master French pronunciation, essential everyday vocabulary, verb conjugations, and conversational elegance.",
        image: "/english.jpg",
        agentPrompt: "Bonjour! Enchanté! I am your French Language Coach. We will learn French step-by-step with clear explanations in your primary language (Hindi or English). Let's start with a warm greeting! Comment vous vous appelez? (What is your name? / आपका नाम क्या है?)",
        voiceId: "charlotte",
        gender: "female",
        subscriptionRequired: false,
    },
    {
        id: 3,
        specialist: "Spanish Tutor (Español)",
        language: "Spanish",
        languageCode: "es",
        flag: "🇪🇸",
        description: "Speak conversational Spanish naturally. Focus on everyday conversation, verbs (ser/estar), listening, and vocabulary.",
        image: "/science1.jpg",
        agentPrompt: "¡Hola! ¿Cómo estás? I am your Spanish Language Tutor. Spanish is vibrant, musical, and fun to learn. I will explain everything simply in Hindi or English so you can converse naturally. ¿Cómo te llamas? (What is your name? / आपका नाम क्या है?)",
        voiceId: "chris",
        gender: "male",
        subscriptionRequired: false,
    },
    {
        id: 4,
        specialist: "Italian Tutor (Italiano)",
        language: "Italian",
        languageCode: "it",
        flag: "🇮🇹",
        description: "Learn beautiful Italian, melodic pronunciation, everyday phrases, ordering at restaurants, and cultural expressions.",
        image: "/biology1.jpg",
        agentPrompt: "Ciao! Benvenuto! I am your Italian Language Tutor. I will guide you through Italian pronunciation, travel phrases, and daily speech with easy explanations in English or Hindi. Piacere di conoscerti! (Nice to meet you!) Shall we begin?",
        voiceId: "eileen",
        gender: "female",
        subscriptionRequired: false,
    },
    {
        id: 5,
        specialist: "Portuguese Tutor (Português)",
        language: "Portuguese",
        languageCode: "pt",
        flag: "🇵🇹",
        description: "Learn European & Brazilian Portuguese fundamentals, pronunciation, practical grammar, and social dialogues.",
        image: "/chemistry2.jpg",
        agentPrompt: "Olá! Tudo bem? I am your Portuguese Language Tutor. I will help you speak fluent Portuguese with comfortable explanations in English or Hindi. Vamos começar? (Shall we start? / क्या हम शुरू करें?)",
        voiceId: "atlas",
        gender: "male",
        subscriptionRequired: false,
    },
    {
        id: 6,
        specialist: "Dutch Tutor (Nederlands)",
        language: "Dutch",
        languageCode: "nl",
        flag: "🇳🇱",
        description: "Learn Dutch words, sentence structure, pronunciation, and practical daily conversation for the Netherlands & Belgium.",
        image: "/socialscience3.jpg",
        agentPrompt: "Hallo! Welkom! I am your Dutch Language Coach. Dutch has great similarities to English and German. I will explain every rule simply in Hindi or English. Hoe gaat het met jou? (How are you? / आप कैसे हैं?)",
        voiceId: "ayla",
        gender: "female",
        subscriptionRequired: false,
    },
];

export const PrimaryLanguages = [
    { id: "English", name: "English", label: "English", sublabel: "Explanations in English", flag: "🇬🇧" },
    { id: "Hindi", name: "Hindi", label: "हिंदी (Hindi)", sublabel: "हिंदी माध्यम से सीखें", flag: "🇮🇳" },
];

export const TargetLanguages = [
    { id: "German", name: "German (Deutsch)", code: "de", flag: "🇩🇪", tutorId: 1, greeting: "Hallo! Guten Tag!" },
    { id: "French", name: "French (Français)", code: "fr", flag: "🇫🇷", tutorId: 2, greeting: "Bonjour! Enchanté!" },
    { id: "Spanish", name: "Spanish (Español)", code: "es", flag: "🇪🇸", tutorId: 3, greeting: "¡Hola! ¿Cómo estás?" },
    { id: "Italian", name: "Italian (Italiano)", code: "it", flag: "🇮🇹", tutorId: 4, greeting: "Ciao! Benvenuto!" },
    { id: "Portuguese", name: "Portuguese (Português)", code: "pt", flag: "🇵🇹", tutorId: 5, greeting: "Olá! Tudo bem?" },
    { id: "Dutch", name: "Dutch (Nederlands)", code: "nl", flag: "🇳🇱", tutorId: 6, greeting: "Hallo! Welkom!" },
];

export const ProficiencyLevels = [
    { id: "Beginner", label: "Beginner (A1)", desc: "Alphabet, basic greetings, numbers & foundational words" },
    { id: "Elementary", label: "Elementary (A2)", desc: "Simple sentences, daily routines, questions & directions" },
    { id: "Intermediate", label: "Intermediate (B1)", desc: "Conversations, expressing opinions & complex tenses" },
    { id: "Travel", label: "Travel & Daily Life", desc: "Cafés, hotels, shopping, emergencies & practical phrases" },
];

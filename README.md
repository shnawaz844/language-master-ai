# Language Master AI 🌐🗣️

**Language Master AI** is a real-time, voice-powered AI language tutoring platform designed to help learners master European languages with conversational ease and natural pronunciation.

---

## 🚀 Key Features

- **🇪🇺 European Languages (Phase 1)**:
  - 🇩🇪 **German (Deutsch)** - Cases, grammar, vocabulary, daily dialogues
  - 🇫🇷 **French (Français)** - Pronunciation, verb conjugations, conversational elegance
  - 🇪🇸 **Spanish (Español)** - Conversational practice, verbs (ser/estar), vocabulary
  - 🇮🇹 **Italian (Italiano)** - Expressive phrases, melodic pronunciation, travel dialogues
  - 🇵🇹 **Portuguese (Português)** - Fundamentals, pronunciation, and daily phrases
  - 🇳🇱 **Dutch (Nederlands)** - Sentence structure, vocabulary, and practical conversation

- **🇮🇳 🇬🇧 Bilingual Instruction (Primary Language Selection)**:
  - Choose **Hindi (हिंदी)** or **English** as the medium of explanation.
  - Complex grammar rules, word meanings, and pronunciation tips are explained in your selected native tongue.

- **🎙️ Real-Time Voice Conversations**:
  - Powered by Vapi and ElevenLabs for natural, human-like interactive spoken practice.
  - Live transcription with turn-by-turn spoken dialogue bubbles.

- **📊 Structured Fluency & Evaluation Reports**:
  - Detailed post-session breakdown including vocabulary practiced, pronunciation tips, grammar points, and a 1–100 Fluency Score.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **UI & Styling**: React 19, TailwindCSS, Radix UI, Motion
- **Voice AI**: Vapi AI Web SDK, ElevenLabs
- **LLM**: OpenAI GPT-4o-mini & Google Gemini
- **Database & Auth**: PostgreSQL (Neon Database), Drizzle ORM, Clerk Authentication

---

## 🏃 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/shnawaz844/language-master-ai.git
   cd language-master-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup `.env`:
   ```env
   DATABASE_URL=your_postgres_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_VAPI_API_KEY=your_vapi_key
   OPENAI_API_KEY=your_openai_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

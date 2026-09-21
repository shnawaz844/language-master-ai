"use client";
import { motion } from "motion/react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Globe, Languages, Sparkles, Volume2, Award } from "lucide-react";

export default function Home() {
  const words = ["Master", "German,", "French,", "Spanish", "&", "EU", "Languages", "with", "AI", "Voice", "Tutors"];

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-orange-50/30">
      <Navbar />

      <main className="px-4 py-12 md:py-20 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-[#FF6600] font-semibold text-xs md:text-sm mb-6 shadow-sm border border-orange-200">
          <Sparkles className="w-4 h-4" />
          <span>Phase 1 Live: German, French, Spanish, Italian, Portuguese & Dutch</span>
        </div>

        <h1 className="relative z-10 mx-auto max-w-5xl text-center text-3xl font-extrabold sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeInOut",
              }}
              className={`mr-2.5 inline-block ${index >= 8 ? "text-[#FF6600]" : "text-slate-900"}`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="relative z-10 mx-auto max-w-2xl py-6 text-center text-base md:text-lg font-normal text-neutral-600 leading-relaxed"
        >
          Practice real-time spoken conversations with native AI tutors. Select your preferred instruction language (<strong>Hindi</strong> or <strong>English</strong>), drill vocabulary, master pronunciation, and become conversational in European languages.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <button className="transform rounded-xl bg-[#ff6600] px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e65c00] hover:shadow-orange-500/40 text-base md:text-lg flex items-center gap-2">
              <Languages className="w-5 h-5" />
              <span>Start Speaking Today</span>
            </button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.0 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { flag: "🇩🇪", name: "German", greeting: "Guten Tag" },
            { flag: "🇫🇷", name: "French", greeting: "Bonjour" },
            { flag: "🇪🇸", name: "Spanish", greeting: "¡Hola!" },
            { flag: "🇮🇹", name: "Italian", greeting: "Ciao" },
            { flag: "🇵🇹", name: "Portuguese", greeting: "Olá" },
            { flag: "🇳🇱", name: "Dutch", greeting: "Hallo" },
          ].map((lang, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-200/80 hover:border-orange-300 transition-all hover:scale-105"
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-left">
                <div className="text-xs font-bold text-gray-800">{lang.name}</div>
                <div className="text-[10px] text-gray-400 italic">{lang.greeting}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center mb-4">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">Hindi & English Medium</h3>
            <p className="text-sm text-gray-500">
              Grammar rules and word meanings are clearly broken down in Hindi (हिंदी) or English so you never feel lost.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">Live Voice Feedback</h3>
            <p className="text-sm text-gray-500">
              Speak naturally through your microphone. The AI listens, responds in real-time, and guides your accent and pronunciation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">Fluency & Progress Reports</h3>
            <p className="text-sm text-gray-500">
              Receive structured evaluation reports after every session detailing vocabulary retained, mistakes corrected, and your fluency score.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="flex w-full items-center justify-between px-6 md:px-16 py-4 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#FF6600] text-white flex items-center justify-center font-black text-lg">
          LM
        </div>
        <span className="font-extrabold text-xl tracking-tight text-gray-900">
          Language<span className="text-[#FF6600]">Master</span>.AI
        </span>
      </Link>
      {!user ? (
        <Link href="/dashboard">
          <button className="transform rounded-xl bg-[#ff6600] px-5 py-2 font-semibold text-white transition-all duration-300 hover:bg-[#e65c00] text-sm">
            Login
          </button>
        </Link>
      ) : (
        <div className="flex gap-3 md:gap-5 items-center">
          <UserButton />
          <Link href="/dashboard">
            <Button className="bg-[#ff6600] hover:bg-[#e65c00] text-white rounded-xl text-sm">
              Dashboard
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AITeacherAgents } from "@/shared/list";
import EmversityLogo from "@/components/EmversityLogo";
import {
  Globe,
  Languages,
  Sparkles,
  ArrowRight,
  Plane,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

export default function Home() {
  const words = [
    "Master",
    "German,",
    "French,",
    "Spanish",
    "&",
    "EU",
    "Languages",
    "with",
    "AI",
    "Voice",
    "Tutors",
  ];

  const [activeLangId, setActiveLangId] = useState(1); // default: German

  const activeTutor = AITeacherAgents.find((a) => a.id === activeLangId) ?? AITeacherAgents[0];

  const langBadges = AITeacherAgents.map((a) => ({
    id: a.id,
    flag: a.flag,
    name: a.language,
    greeting: a.agentPrompt.split("!")[0] + "!",
  }));

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white selection:bg-[#E8654A]/30 selection:text-white overflow-x-hidden font-sans">
      {/* Ambient glowing orb matching emversity.com */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gradient-to-b from-[#98230a] to-transparent blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 left-[-150px] w-[500px] h-[500px] rounded-full bg-[#E8654A]/10 blur-[140px] pointer-events-none" />

      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#C8654A] via-[#D85A3A] to-[#C8654A] text-white text-center py-2 px-4 text-xs font-semibold tracking-wide relative overflow-hidden z-50">
        <span className="flex items-center justify-center gap-2">
          <GraduationCap className="w-4 h-4" />
          <span>Emversity Global Careers Skilling · Phase 1 European Pathways Live</span>
          <Link href="/dashboard" className="underline hover:no-underline font-bold ml-1">
            Start Speaking →
          </Link>
        </span>
      </div>

      <Navbar />

      <main className="relative z-10 pt-12 md:pt-20 px-5 lg:px-12 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-semibold text-white/90 tracking-wide mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E8654A]" />
          <span>Work-Integrated Language Training for International Careers</span>
        </motion.div>

        <h1 className="relative z-10 mx-auto max-w-5xl text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-1.5px] md:tracking-[-2.5px] leading-[1.08] mb-6">
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.04,
                ease: "easeInOut",
              }}
              className={`mr-2.5 inline-block ${index >= 8
                  ? "bg-gradient-to-r from-[#f26a3d] via-[#f97316] to-[#c79f33] bg-clip-text text-transparent"
                  : "text-white"
                }`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="relative z-10 mx-auto max-w-2xl text-base md:text-lg text-white/80 leading-relaxed mb-8"
        >
          Practice real-time spoken conversations with native AI tutors. Select your preferred instruction language (
          <strong className="text-white">Hindi</strong> or <strong className="text-white">English</strong>), drill vocabulary, master pronunciation, and prepare for international clinical and hospitality placements.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="relative z-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="h-13 px-8 rounded-full text-base font-bold bg-gradient-to-r from-[#E8654A] to-[#F97316] hover:opacity-95 text-white shadow-[0_0_30px_rgba(232,101,74,0.4)] transition-all hover:scale-105 active:scale-95 border-0"
            >
              <Languages className="w-5 h-5 mr-2" />
              <span>Start Speaking Today</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="h-13 px-8 rounded-full text-base font-bold border-white/30 bg-transparent text-white hover:bg-white/15 hover:text-white hover:border-white/50 transition-all hover:scale-105"
              style={{ backgroundColor: 'transparent', color: 'white' }}
            >
              Explore European Tutors
            </Button>
          </Link>
        </motion.div>

        {/* Language Badges Selector Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          {AITeacherAgents.map((tutor) => {
            const isActive = activeLangId === tutor.id;
            return (
              <button
                key={tutor.id}
                type="button"
                onClick={() => setActiveLangId(tutor.id)}
                onMouseEnter={() => setActiveLangId(tutor.id)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#E8654A]/20 border-[#E8654A] shadow-[0_0_20px_rgba(232,101,74,0.35)] scale-105"
                    : "bg-white/5 border-white/10 hover:border-[#E8654A]/50 hover:bg-white/10"
                }`}
              >
                <span className="text-2xl drop-shadow">{tutor.flag}</span>
                <div className="text-left">
                  <div className={`text-xs font-bold ${isActive ? "text-[#FF8566]" : "text-white"}`}>
                    {tutor.language}
                  </div>
                  <div className="text-[10px] text-white/60 font-medium">
                    {tutor.agentPrompt.split("!")[0]}!
                  </div>
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Dynamic Tutor Showcase Preview (Changes image and details according to language) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.85 }}
          className="mt-8 max-w-2xl mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTutor.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="relative overflow-hidden rounded-3xl bg-[#111114] border border-[#E8654A]/40 shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 text-left"
            >
              {/* Tutor Photo */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-2xl overflow-hidden border border-white/15 shadow-lg">
                <Image
                  src={activeTutor.image}
                  alt={activeTutor.specialist}
                  fill
                  className="object-cover object-[center_15%]"
                  sizes="150px"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 flex items-center gap-1">
                  <span>{activeTutor.flag}</span>
                  <span>{activeTutor.languageCode.toUpperCase()}</span>
                </div>
              </div>

              {/* Tutor Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E8654A]/20 text-[#FF8566] border border-[#E8654A]/30">
                    Live AI Tutor
                  </span>
                  <span className="text-xs text-white/50">CEFR A1 - C1</span>
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-white mt-1.5">
                  {activeTutor.specialist}
                </h3>
                <p className="text-xs text-white/70 mt-1 leading-relaxed line-clamp-2">
                  {activeTutor.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-[11px] text-white/50">
                    Voice: <span className="text-white font-medium capitalize">{activeTutor.voiceId}</span> · Hindi & English
                  </div>
                  <Link href="/dashboard">
                    <Button
                      size="sm"
                      className="rounded-full px-4 h-8 text-xs font-bold bg-gradient-to-r from-[#E8654A] to-[#F97316] text-white hover:opacity-95 shadow-md shadow-[#E8654A]/30"
                    >
                      Practice Now →
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="bg-[#111114] p-6 rounded-3xl border border-white/10 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-[#E8654A]/20 text-[#FF8566] flex items-center justify-center mb-4">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Bilingual Hindi & English Explanations</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Grammar rules, cases, and word meanings are clearly broken down in Hindi (हिंदी) or English so you never feel lost.
            </p>
          </div>

          <div className="bg-[#111114] p-6 rounded-3xl border border-white/10 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-[#E8654A]/20 text-[#FF8566] flex items-center justify-center mb-4">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Global Careers & Mobility</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Tailored for healthcare professionals and hospitality specialists pursuing international careers and licensing in Europe.
            </p>
          </div>

          <div className="bg-[#111114] p-6 rounded-3xl border border-white/10 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">CEFR Curriculum Aligned</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Structured from Beginner (A1) through Advanced (C1) with real-time accent scoring, pronunciation corrections, and report generation.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center pb-16">
          <p className="text-xs text-white/50 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E8654A]" />
            Emversity Skilling Initiative · Approved Training Partner of NSDC
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#070708] py-8 px-6 md:px-12 text-white/60 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <EmversityLogo subtitle="Language Master AI" className="h-6" />
          <p>© {new Date().getFullYear()} Emversity Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between px-6 md:px-12 py-3.5 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10">
      <Link href="/">
        <EmversityLogo subtitle="Language Master AI" className="h-6 md:h-7" />
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <Link href="/dashboard">
            <Button className="rounded-full px-6 py-2 bg-gradient-to-r from-[#E8654A] to-[#F97316] text-white font-semibold text-xs md:text-sm hover:opacity-95 shadow-md shadow-[#E8654A]/30">
              Get Started
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button className="rounded-full px-5 py-2 bg-gradient-to-r from-[#E8654A] to-[#F97316] text-white font-semibold text-xs md:text-sm">
                Dashboard
              </Button>
            </Link>
            <UserButton />
          </div>
        )}
      </div>
    </nav>
  );
};

"use client";
import { AITeacherAgents } from "@/shared/list";
import React, { useState } from "react";
import TeacherAgentCard, { TeacherAgent } from "./TeacherAgentCard";
import { Sparkles, Globe2, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PrimaryLanguages, ProficiencyLevels } from "@/shared/list";

function DoctorsAgentList() {
  const [selectedAgent, setSelectedAgent] = useState<TeacherAgent | null>(null);
  const [primaryLang, setPrimaryLang] = useState<"English" | "Hindi">("English");
  const [level, setLevel] = useState<string>("Beginner");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStartLesson = async () => {
    if (!selectedAgent) return;
    setLoading(true);

    const targetLang = selectedAgent.language || selectedAgent.specialist;
    const selectedTeacherPayload = {
      ...selectedAgent,
      primaryLanguage: primaryLang,
      targetLanguage: targetLang,
      level: level,
      agentPrompt:
        primaryLang === "Hindi"
          ? `नमस्ते! मैं आपकी ${targetLang} भाषा की एआई ट्यूटर हूँ। आज हम ${targetLang} सीखेंगे और मैं आपको सभी नियम और शब्दों के अर्थ सरल हिंदी में समझाऊँगी। चलिए अभ्यास शुरू करते हैं।`
          : `Hello! I am your ${targetLang} Language Tutor. Today we will focus on ${level} level practice with clear explanations in English. Let's start with conversational phrases. Ready?`,
    };

    try {
      const result = await axios.post("/api/session-chat", {
        notes: `${level} session in ${targetLang} with explanations in ${primaryLang}`,
        selectedTeacher: selectedTeacherPayload,
      });

      if (result.data?.sessionId) {
        router.push("/dashboard/teacher-agent/" + result.data.sessionId);
      }
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 mb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8654A]/15 border border-[#E8654A]/30 text-[#FF8566] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E8654A]" />
            <span>Phase 1 Live: European Languages Track</span>
          </div>
          <h2 className="font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            AI European Language Tutors
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-2xl leading-relaxed">
            Practice German, French, Spanish, Italian, Portuguese, and Dutch with native AI voice tutors. Explanations available in Hindi or English.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 px-3.5 py-2 rounded-xl border border-white/10 w-fit">
          <Globe2 className="w-4 h-4 text-[#E8654A]" />
          <span>CEFR Aligned (A1 - C1)</span>
        </div>
      </div>

      {/* Grid of language tutor cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {AITeacherAgents.map((tutor) => (
          <TeacherAgentCard
            key={tutor.id}
            TeacherAgent={tutor}
            onSelect={(agent) => setSelectedAgent(agent)}
          />
        ))}
      </div>

      {/* Quick Language Preference Dialog when card is clicked */}
      {selectedAgent && (
        <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
          <DialogContent className="max-w-lg bg-[#0E0E11] text-white border border-white/15">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl text-white">
                <span>{selectedAgent.flag}</span>
                Start Learning {selectedAgent.language}
              </DialogTitle>
              <DialogDescription className="text-white/60">
                Choose your instruction language and level to begin voice session with {selectedAgent.specialist}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-bold text-white/80 uppercase tracking-wider block mb-2">
                  Medium of Explanation (Primary Language)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PrimaryLanguages.map((lang) => {
                    const isSelected = primaryLang === lang.id;
                    return (
                      <button
                        type="button"
                        key={lang.id}
                        onClick={() => setPrimaryLang(lang.id as any)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-[#E8654A] bg-[#E8654A]/15 ring-2 ring-[#E8654A]/50 text-white"
                            : "border-white/10 hover:border-white/20 bg-white/5 text-white/80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{lang.flag}</span>
                          <div>
                            <div className="font-semibold text-sm">{lang.name}</div>
                            <div className="text-[11px] text-white/50">{lang.sublabel}</div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E8654A]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 uppercase tracking-wider block mb-2">
                  Learning Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ProficiencyLevels.map((lvl) => {
                    const isSelected = level === lvl.id;
                    return (
                      <button
                        type="button"
                        key={lvl.id}
                        onClick={() => setLevel(lvl.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-[#E8654A] bg-[#E8654A]/15 ring-2 ring-[#E8654A]/50 text-white"
                            : "border-white/10 hover:border-white/20 bg-white/5 text-white/80"
                        }`}
                      >
                        <div className="font-semibold text-xs">{lvl.label}</div>
                        <div className="text-[10px] text-white/50 mt-0.5 truncate">{lvl.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="bg-gradient-to-r from-[#E8654A] to-[#F97316] text-white rounded-xl hover:opacity-95 shadow-lg shadow-[#E8654A]/25 border-0"
                onClick={handleStartLesson}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Starting...
                  </>
                ) : (
                  <>
                    Start Session
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default DoctorsAgentList;

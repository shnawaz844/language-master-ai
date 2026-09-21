"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle2, Globe, Languages, Loader2, Sparkles } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { SessionDetail } from "../teacher-agent/[sessionId]/page";
import {
  AITeacherAgents,
  PrimaryLanguages,
  TargetLanguages,
  ProficiencyLevels,
  LanguageAgent,
} from "@/shared/list";

function AddNewSessionDialog() {
  // 🧠 State management
  const [primaryLang, setPrimaryLang] = useState<"English" | "Hindi">("English");
  const [targetLang, setTargetLang] = useState<string>("German");
  const [level, setLevel] = useState<string>("Beginner");
  const [customGoal, setCustomGoal] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { has } = useAuth();
  //@ts-ignore
  const paidUser = has && has({ plan: "pro" });

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    try {
      const result = await axios.get("/api/session-chat?sessionId=all");
      setHistoryList(result.data);
    } catch (e) {
      console.log("Could not fetch history", e);
    }
  };

  // Find corresponding tutor agent for the target language
  const selectedAgent: LanguageAgent =
    AITeacherAgents.find((a) => a.language.toLowerCase() === targetLang.toLowerCase()) ||
    AITeacherAgents[0];

  // 🚀 Start Lesson and redirect
  const onStartLesson = async () => {
    setLoading(true);

    const notesSummary = customGoal
      ? customGoal
      : `${level} session in ${targetLang} with explanations in ${primaryLang}`;

    const selectedTeacherPayload = {
      ...selectedAgent,
      primaryLanguage: primaryLang,
      targetLanguage: targetLang,
      level: level,
      // Custom prompt adapted for primary language
      agentPrompt:
        primaryLang === "Hindi"
          ? `नमस्ते! मैं आपकी ${targetLang} भाषा की एआई ट्यूटर हूँ। आज हम ${targetLang} सीखेंगे और मैं आपको सभी नियम और शब्दों के अर्थ सरल हिंदी में समझाऊँगी। चलिए अभ्यास शुरू करते हैं। ${selectedAgent.specialist} session ready!`
          : `Hello! I am your ${targetLang} Language Tutor. Today we will focus on ${level} level practice with clear explanations in English. Let's start with conversational phrases. Ready?`,
    };

    try {
      const result = await axios.post("/api/session-chat", {
        notes: notesSummary,
        selectedTeacher: selectedTeacherPayload,
      });

      if (result.data?.sessionId) {
        setOpen(false);
        router.push("/dashboard/teacher-agent/" + result.data.sessionId);
      }
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 🔘 Open Dialog Button */}
      <DialogTrigger asChild>
        <Button
          className="bg-[#FF6600] hover:bg-[#E65C00] text-white shadow-md font-semibold px-6 py-5 rounded-xl flex items-center gap-2"
          disabled={!paidUser && historyList?.length >= 100}
        >
          <Languages className="w-5 h-5" />
          <span>+ Start AI Language Session</span>
        </Button>
      </DialogTrigger>

      {/* 🗂️ Dialog Content */}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Globe className="text-[#FF6600] w-6 h-6" />
            Start AI Language Tutoring Session
          </DialogTitle>
          <DialogDescription>
            Select your preferred instruction language and target European language to begin your voice session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* STEP 1: Select Primary Language */}
          <div>
            <label className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6600] flex items-center justify-center text-xs font-bold">1</span>
              Select Your Primary Language (Medium of Explanation)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PrimaryLanguages.map((lang) => {
                const isSelected = primaryLang === lang.id;
                return (
                  <button
                    type="button"
                    key={lang.id}
                    onClick={() => setPrimaryLang(lang.id as any)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-[#FF6600] bg-orange-50/70 ring-2 ring-orange-400"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{lang.label}</div>
                        <div className="text-xs text-gray-500">{lang.sublabel}</div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-[#FF6600]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Select Target Language (EU Languages Phase 1) */}
          <div>
            <label className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6600] flex items-center justify-center text-xs font-bold">2</span>
              Select Target Language to Learn (EU Languages)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {TargetLanguages.map((t) => {
                const isSelected = targetLang === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTargetLang(t.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-[#FF6600] bg-orange-50/70 ring-2 ring-orange-400 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <span className="text-2xl">{t.flag}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">{t.name}</div>
                      <div className="text-[11px] text-gray-400 italic truncate">{t.greeting}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Select Level / Focus */}
          <div>
            <label className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6600] flex items-center justify-center text-xs font-bold">3</span>
              Select Learning Level
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {ProficiencyLevels.map((lvl) => {
                const isSelected = level === lvl.id;
                return (
                  <button
                    type="button"
                    key={lvl.id}
                    onClick={() => setLevel(lvl.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-[#FF6600] bg-orange-50/70 ring-2 ring-orange-400"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="font-semibold text-gray-900 text-sm">{lvl.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{lvl.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Optional Goal / Notes */}
          <div>
            <label className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6600] flex items-center justify-center text-xs font-bold">4</span>
              Specific Topic or Practice Goals (Optional)
            </label>
            <Textarea
              placeholder="e.g., Ordering coffee and croissant at a bakery, introducing myself, practicing present tense verbs..."
              className="h-[80px] rounded-xl text-sm"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
            />
          </div>

          {/* Preview Badge */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-3">
            <span className="text-3xl">{selectedAgent.flag}</span>
            <div className="text-xs text-gray-700">
              You will practice <strong>{targetLang}</strong> with <strong>{selectedAgent.specialist}</strong>. Explanations and translations will be provided in <strong>{primaryLang}</strong>.
            </div>
          </div>
        </div>

        {/* ✅ Dialog Footer */}
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-xl">Cancel</Button>
          </DialogClose>

          <Button
            className="bg-[#FF6600] hover:bg-[#E65C00] text-white rounded-xl px-6"
            disabled={loading}
            onClick={onStartLesson}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Initializing Tutor...
              </>
            ) : (
              <>
                Start {targetLang} Session
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;

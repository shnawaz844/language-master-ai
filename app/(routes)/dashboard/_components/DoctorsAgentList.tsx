"use client";
import { AITeacherAgents } from '@/shared/list';
import React, { useState } from 'react';
import TeacherAgentCard, { TeacherAgent } from './TeacherAgentCard';
import { Sparkles, Globe2 } from 'lucide-react';
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
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PrimaryLanguages, ProficiencyLevels } from '@/shared/list';

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
            agentPrompt: primaryLang === "Hindi"
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
        <div className='mt-10'>
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <div className='flex items-center gap-2'>
                        <Globe2 className='w-6 h-6 text-[#FF6600]' />
                        <h2 className='font-bold text-2xl text-gray-900'>AI European Language Tutors (Phase 1)</h2>
                    </div>
                    <p className='text-sm text-gray-500 mt-1'>
                        Learn German, French, Spanish, Italian, Portuguese, and Dutch with native AI voice tutors. Explanations available in Hindi or English.
                    </p>
                </div>
            </div>

            {/* Grid of language tutor cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-6'>
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
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <span>{selectedAgent.flag}</span>
                                Start Learning {selectedAgent.language}
                            </DialogTitle>
                            <DialogDescription>
                                Choose your instruction language and level to begin voice session with {selectedAgent.specialist}.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            <div>
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
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
                                                        ? "border-[#FF6600] bg-orange-50 ring-2 ring-orange-400"
                                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-xl">{lang.flag}</span>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 text-sm">{lang.name}</div>
                                                        <div className="text-[11px] text-gray-500">{lang.sublabel}</div>
                                                    </div>
                                                </div>
                                                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF6600]" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
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
                                                        ? "border-[#FF6600] bg-orange-50 ring-2 ring-orange-400"
                                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                                }`}
                                            >
                                                <div className="font-semibold text-gray-900 text-xs">{lvl.label}</div>
                                                <div className="text-[10px] text-gray-500 mt-0.5 truncate">{lvl.desc}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" className="rounded-xl">Cancel</Button>
                            </DialogClose>
                            <Button
                                className="bg-[#FF6600] hover:bg-[#E65C00] text-white rounded-xl"
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

"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { IconArrowRight } from "@tabler/icons-react";
import axios from "axios";
import { Loader2Icon, Play, Globe } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LanguageAgent } from "@/shared/list";

export type TeacherAgent = LanguageAgent;

type Props = {
  TeacherAgent: TeacherAgent;
  onSelect?: (agent: TeacherAgent) => void;
};

function TeacherAgentCard({ TeacherAgent, onSelect }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { has } = useAuth();

  // Direct start with default English/Hindi **
  const onStartLesson = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onSelect) {
      onSelect(TeacherAgent);
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: `Learning ${TeacherAgent.language} with ${TeacherAgent.specialist}`,
        selectedTeacher: {
          ...TeacherAgent,
          primaryLanguage: "English",
          targetLanguage: TeacherAgent.language,
          level: "Beginner",
        },
      });

      if (result.data?.sessionId) {
        router.push("/dashboard/teacher-agent/" + result.data.sessionId);
      }
    } catch (error) {
      console.error("Failed to start lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onStartLesson}
      className="group relative flex flex-col overflow-hidden rounded-[26px] bg-[#111114] border border-white/10 hover:border-[#E8654A]/60 shadow-2xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(232,101,74,0.25)] hover:-translate-y-1 cursor-pointer w-full"
    >
      {/* Warm Ambient Spotlight in background */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#C8654A]/30 via-[#98230a]/15 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      {/* Top Image Showcase (Shows full tutor portrait without text cutting it off) */}
      <div className="relative w-full aspect-[16/11] overflow-hidden bg-[#0A0A0A]">
        {/* Full Tutor Portrait Image */}
        <Image
          src={TeacherAgent.image}
          alt={TeacherAgent.specialist}
          fill
          className="object-cover object-[center_15%] filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Subtle bottom vignette to blend naturally into card body */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#111114] via-[#111114]/60 to-transparent" />

        {/* Top Left Frosted Play Button */}
        <div className="absolute top-3.5 left-3.5 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-[#E8654A] group-hover:border-[#E8654A] transition-all duration-300">
          <Play className="w-4 h-4 fill-white translate-x-0.5" />
        </div>

        {/* Top Right Flag & Language Badge */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5">
          <span className="text-xl drop-shadow">{TeacherAgent.flag}</span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white tracking-wider uppercase">
            {TeacherAgent.language}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="relative z-20 p-5 flex flex-col flex-1 justify-between bg-[#111114]">
        <div>
          {/* Tutor / Specialist Name */}
          <h3 className="font-bold text-lg md:text-xl text-white tracking-tight leading-snug group-hover:text-[#FF8566] transition-colors">
            {TeacherAgent.specialist}
          </h3>

          {/* Short Role / Description */}
          <p className="text-xs text-white/70 line-clamp-2 mt-1.5 font-normal leading-relaxed">
            {TeacherAgent.description}
          </p>

          {/* Emversity Global Career Label */}
          <div className="flex items-center gap-1.5 mt-3">
            <Globe className="w-3.5 h-3.5 text-[#E8654A]" />
            <span className="text-[11px] font-medium text-white/85 tracking-wide">
              Emversity Global Careers Pathway
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end">
          <Button
            size="sm"
            className="h-8 px-4 rounded-full text-xs font-semibold bg-gradient-to-r from-[#E8654A] to-[#F97316] text-white hover:opacity-95 shadow-md shadow-[#E8654A]/25 border-0"
            disabled={loading}
            onClick={onStartLesson}
          >
            {loading ? (
              <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <div className="flex items-center gap-1">
                <span>Start Lesson</span>
                <IconArrowRight className="h-3.5 w-3.5" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TeacherAgentCard;



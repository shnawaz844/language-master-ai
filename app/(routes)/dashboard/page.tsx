import React from "react";
import DoctorsAgentList from "./_components/DoctorsAgentList";
import AddNewSessionDialog from "./_components/AddNewSessionDialog";
import { Sparkles, Globe, Plane, Award } from "lucide-react";

function Dashboard() {
  return (
    <div className="relative min-h-screen bg-[#070708] text-white px-4 md:px-12 py-8">
      {/* Background glow effects matching Emversity */}
      <div className="absolute top-0 right-10 w-[500px] h-[300px] bg-gradient-to-b from-[#98230a]/20 via-[#E8654A]/10 to-transparent blur-[100px] pointer-events-none" />
      <div className="absolute top-40 left-0 w-[350px] h-[350px] bg-[#E8654A]/5 blur-[120px] pointer-events-none" />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#111114] via-[#17171C] to-[#121216] p-7 md:p-10 mb-10 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E8654A] to-transparent" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8654A]/20 text-[#FF8566] border border-[#E8654A]/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Emversity Global Careers Pathway · Phase 1</span>
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Language Master AI
            </h1>
            <p className="text-white/70 text-sm md:text-base mt-2 leading-relaxed max-w-xl">
              Practice speaking German, French, Spanish, Italian, Portuguese, and Dutch with live voice AI tutors. Learn pronunciation, grammar, and conversational mastery with explanations in Hindi or English.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <AddNewSessionDialog />
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Plane className="w-4 h-4 text-[#E8654A]" />
                <span>Work Abroad & International Placement Readiness</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center min-w-[210px]">
            <Globe className="w-8 h-8 text-[#E8654A] mb-2" />
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              European Track
            </span>
            <span className="text-2xl mt-1 tracking-widest">🇩🇪 🇫🇷 🇪🇸 🇮🇹 🇵🇹 🇳🇱</span>
            <span className="text-[11px] text-white/50 mt-2">Bilingual Voice AI Mentors</span>
          </div>
        </div>
      </div>

      {/* List of Language Tutors */}
      <DoctorsAgentList />
    </div>
  );
}

export default Dashboard;

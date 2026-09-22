import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import EmversityLogo from "@/components/EmversityLogo";

const menuOptions = [
  {
    id: 1,
    name: "Tutors Dashboard",
    path: "/dashboard",
  },
  {
    id: 2,
    name: "Voice History",
    path: "/dashboard/history",
  },
  {
    id: 4,
    name: "Profile",
    path: "/dashboard/profile",
  },
];

function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-3.5 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 transition-colors">
      <Link href="/" className="flex items-center gap-3">
        <EmversityLogo subtitle="Language Master AI" className="h-6 md:h-7" />
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {menuOptions.map((option) => (
          <Link key={option.id} href={option.path}>
            <span className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 hover:border-b-2 hover:border-[#E8654A] pb-1">
              {option.name}
            </span>
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}

export default AppHeader;

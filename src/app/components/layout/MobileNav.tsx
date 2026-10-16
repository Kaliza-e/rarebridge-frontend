import React from "react";
import { Home, BookOpen, Users, Stethoscope, Microscope } from "lucide-react";

export default function MobileNav({ onNav, activeView }: { onNav: (v: string) => void; activeView: string }) {
  const tabs = [
    { label: "Home", icon: Home, view: "home" },
    { label: "Diseases", icon: BookOpen, view: "directory" },
    { label: "Research", icon: Microscope, view: "research" },
    { label: "Specialists", icon: Stethoscope, view: "specialists" },
    { label: "Community", icon: Users, view: "community" },
  ];
  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#BEB7A7]/40 bg-[#F8F7F2]/95 shadow-[0_-8px_24px_rgba(17,34,80,0.08)] backdrop-blur-xl md:hidden"
    >
      <div className="flex">
        {tabs.map(t => (
          <button
            key={t.label}
            type="button"
            onClick={() => onNav(t.view)}
            aria-label={t.label}
            aria-current={activeView === t.view ? "page" : undefined}
            className={`flex-1 flex flex-col items-center py-2.5 transition-all duration-200 outline-none focus-visible:bg-[#112250]/10 ${activeView === t.view
                ? "text-[#112250] font-bold"
                : "text-[#667591] hover:text-[#112250]"
              }`}
          >
            <div className="p-1.5 transition-all duration-200">
              <t.icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className={`text-[10px] mt-0.5 font-semibold ${activeView === t.view ? "text-[#112250] font-black" : "text-[#667591]"}`}>{t.label}</span>
            {activeView === t.view && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#112250] mt-0.5" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

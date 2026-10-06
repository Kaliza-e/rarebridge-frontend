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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#BEB7A7]/40 bg-[#F8F7F2]/95 shadow-[0_-8px_24px_rgba(17,34,80,0.06)] backdrop-blur-xl md:hidden">
      <div className="flex">
        {tabs.map(t => (
          <button
            key={t.label}
            onClick={() => onNav(t.view)}
            className={`flex-1 flex flex-col items-center py-2.5 transition-all duration-200 ${activeView === t.view
                ? "text-primary"
                : "text-taupe hover:text-primary"
              }`}
          >
            <div className="p-1.5 transition-all duration-200">
              <t.icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] mt-0.5 font-semibold ${activeView === t.view ? "text-primary" : "text-taupe"}`}>{t.label}</span>
            {activeView === t.view && (
              <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

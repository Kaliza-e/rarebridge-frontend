import React from "react";
import { Shield, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="hidden md:block bg-primary pt-6 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div>
            <div className="mb-2">
              <img
                src="/logo-transparent.png"
                alt="RareBridge"
                className="h-28 md:h-32 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-xs text-taupe leading-relaxed mb-3">Connecting families, researchers, and specialists with trusted rare disease information.</p>
            <div className="flex items-center gap-1.5 text-[11px] text-taupe">
              <Heart className="w-3 h-3 text-secondary" /> Made with care for rare disease families
            </div>
          </div>
          {[
            { title: "Platform", links: ["Explore Diseases", "Find Specialists", "Research", "Community"] },
            { title: "Resources", links: ["About Us", "Accessibility", "Partners", "Privacy"] },
            { title: "Support", links: ["Help Center", "Contact Us", "Terms of Use", "Cookie Policy"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-bold text-secondary text-[11px] uppercase tracking-widest mb-2.5">{col.title}</h4>
              <ul className="space-y-1.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-xs text-taupe hover:text-secondary transition-colors duration-200">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-taupe">© 2026 RareBridge. For informational purposes only. Not medical advice.</p>
          <div className="flex items-center gap-1.5 text-[11px] text-taupe">
            <Shield className="w-3 h-3 text-secondary" /> Medically reviewed content
          </div>
        </div>
      </div>
    </footer>
  );
}

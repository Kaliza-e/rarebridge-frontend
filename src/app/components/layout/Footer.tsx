import React from "react";
import { Shield, Heart } from "lucide-react";
import { ZebraMascot } from "../common/Visuals";

export default function Footer() {
  return (
    <footer className="bg-primary text-ivory pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <img
                src="/logo-transparent.png"
                alt="RareBridge"
                className="h-20 md:h-24 w-auto object-contain brightness-200 contrast-200"
              />
            </div>
            <p className="text-xs text-taupe leading-relaxed mb-4">
              Connecting families, researchers, and medical specialists with trusted, plain-language rare disease information.
            </p>
            <div className="flex items-center gap-2 text-xs text-secondary">
              <Heart className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>Made with care for rare disease families</span>
            </div>
          </div>

          {/* Nav Links */}
          {[
            {
              title: "Explore Platform",
              links: [
                { name: "Explore Diseases", href: "#" },
                { name: "Treatments & Research", href: "#" },
                { name: "Find Specialists", href: "#" },
                { name: "Community Support", href: "#" },
              ],
            },
            {
              title: "RareBridge",
              links: [
                { name: "About Us", href: "#" },
                { name: "How It Works", href: "#" },
                { name: "Medical Credibility", href: "#" },
                { name: "Contact & Support", href: "#" },
              ],
            },
            {
              title: "Resources & Legal",
              links: [
                { name: "Research Sources", href: "#" },
                { name: "FAQ", href: "#" },
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Use", href: "#" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-secondary text-xs uppercase tracking-widest mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <a
                      href={l.href}
                      className="text-xs text-taupe hover:text-ivory transition-colors duration-200"
                    >
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-taupe text-center sm:text-left">
            © 2026 RareBridge. For informational & educational purposes only. Not medical advice.
          </p>
          <div className="flex items-center gap-4 text-xs text-taupe">
            <div className="flex items-center gap-1.5 text-secondary">
              <Shield className="w-3.5 h-3.5 text-secondary" />
              <span>Medically reviewed content</span>
            </div>
            <ZebraMascot size={20} />
          </div>
        </div>
      </div>
    </footer>
  );
}

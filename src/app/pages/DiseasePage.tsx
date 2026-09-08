import React, { useState, useEffect } from "react";
import {
  ChevronDown, Bot, Upload, Send, AlertCircle, Dna, FlaskConical,
  Baby, Activity, Shield, BookOpen, Globe, MapPin, Star, ExternalLink,
  CheckCircle, XCircle, Stethoscope, Pill, Heart, Users, FileText, Link2,
  Download, Phone
} from "lucide-react";
import { ZebraEmptyState, Accordion, ZebraMascot } from "../components/common/Visuals";
import { apiService } from "../services/api.service";
import type { Disease, DiagnosticStep, ResearchOrg, Specialist, Source } from "../services/api.service";
import { renderTextWithLinks, LinkifiedText, normalizeUrl } from "../utils/link-helper";

// Define the causes structure type
interface Causes {
  genetic?: string;
  environmental?: string;
  unknown?: string;
}

// ─── Section helpers ──────────────────────────────────────────────────────────

/** Symptom pill chip */
function SymptomPill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/20 text-primary text-sm font-medium border border-secondary/40">
      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      <span>{renderTextWithLinks(text, { showIcon: false })}</span>
    </span>
  );
}

/** Section card wrapper */
function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-3xl border border-taupe-40 p-8 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

/** Section header row */
function SectionHeader({
  icon: Icon,
  title,
  iconBg = "bg-primary",
  iconColor = "text-secondary",
}: {
  icon: any;
  title: string;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <h2 className="font-black text-lg text-primary">{title}</h2>
    </div>
  );
}

/** Clickable external link button */
function LinkButton({ url, label }: { url: string; label: string }) {
  const href = normalizeUrl(url);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/8 text-primary text-xs font-semibold
        hover:bg-primary hover:text-ivory transition-all duration-200 border border-primary/20 hover:border-primary"
    >
      <ExternalLink className="w-3 h-3 shrink-0" />
      {label}
    </a>
  );
}

/** Fact/Myth badge */
function FactMythBadge({ isFact }: { isFact: boolean }) {
  return isFact ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-ivory text-xs font-bold shadow-sm">
      <CheckCircle className="w-3.5 h-3.5" /> FACT
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-ivory text-xs font-bold shadow-sm">
      <XCircle className="w-3.5 h-3.5" /> MYTH
    </span>
  );
}

// ─── Rich section renderers ───────────────────────────────────────────────────

function SymptomsSection({ symptoms }: { symptoms: string[] }) {
  if (!symptoms || symptoms.length === 0) return <ZebraEmptyState message="No symptoms listed yet" sub="Content is being reviewed and updated." />;

  // Group symptoms by length/complexity for better organization
  const shortSymptoms = symptoms.filter(s => s.length < 50);
  const longSymptoms = symptoms.filter(s => s.length >= 50);

  return (
    <SectionCard>
      <SectionHeader icon={Activity} title="Signs & Symptoms" iconBg="bg-accent" iconColor="text-secondary" />

      {longSymptoms.length > 0 && (
        <div className="mb-6 space-y-3">
          {longSymptoms.map((symptom, i) => (
            <div key={i} className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <div className="text-accent text-sm leading-relaxed">{renderTextWithLinks(symptom)}</div>
            </div>
          ))}
        </div>
      )}

      {shortSymptoms.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-2">
            {shortSymptoms.map((s, i) => <SymptomPill key={i} text={s} />)}
          </div>
        </div>
      )}
    </SectionCard>
  );
}

function DiagnosisSection({ steps }: { steps: DiagnosticStep[] }) {
  if (!steps || steps.length === 0) return <ZebraEmptyState message="Diagnosis info coming soon" sub="Content is being reviewed." />;
  return (
    <div>
      <div className="bg-secondary rounded-2xl p-4 mb-6 flex items-start gap-3">
        <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-primary font-medium">
          These diagnostic methods are used by specialists. Always consult a qualified healthcare professional for diagnosis.
        </p>
      </div>
      <Accordion
        items={steps.map((step) => ({
          title: step.name,
          content: (
            <div className="space-y-4">
              {step.what && (
                <div>
                  <p className="text-xs font-bold text-taupe uppercase tracking-wider mb-1">What it is</p>
                  <div className="text-primary leading-relaxed">{renderTextWithLinks(step.what)}</div>
                </div>
              )}
              {step.how && (
                <div>
                  <p className="text-xs font-bold text-taupe uppercase tracking-wider mb-1">How it works</p>
                  <div className="text-primary leading-relaxed">{renderTextWithLinks(step.how)}</div>
                </div>
              )}
              {step.result && (
                <div>
                  <p className="text-xs font-bold text-taupe uppercase tracking-wider mb-1">What the result means</p>
                  <div className="text-primary bg-secondary rounded-xl p-3 leading-relaxed">{renderTextWithLinks(step.result)}</div>
                </div>
              )}
            </div>
          ),
        }))}
      />
    </div>
  );
}

function LifestyleSection({ lifestyle }: { lifestyle: any }) {
  if (!lifestyle) return <ZebraEmptyState message="Lifestyle info coming soon" sub="Content is being reviewed." />;

  const subSections = [
    {
      key: "therapies",
      label: "Therapies",
      icon: Stethoscope,
      data: lifestyle.therapies || [],
      type: "list",
    },
    {
      key: "nutrition",
      label: "Nutrition & Diet",
      icon: Heart,
      data: lifestyle.nutrition || "",
      type: "text",
    },
    {
      key: "devices",
      label: "Devices & Equipment",
      icon: Pill,
      data: lifestyle.devices || [],
      type: "list",
    },
    {
      key: "caregiverTips",
      label: "Caregiver Tips",
      icon: Users,
      data: lifestyle.caregiverTips || [],
      type: "list",
    },
    {
      key: "community",
      label: "Community & Support",
      icon: Globe,
      data: lifestyle.community || "",
      type: "text",
    },
  ].filter((s) => {
    if (s.type === "list") return Array.isArray(s.data) && s.data.length > 0;
    return typeof s.data === "string" && s.data.trim().length > 0;
  });

  if (subSections.length === 0) {
    // Fallback: show raw text if no structured data
    const raw = lifestyle.raw || lifestyle.nutrition || "";
    return (
      <SectionCard>
        <SectionHeader icon={Shield} title="Lifestyle & Daily Support" iconBg="bg-secondary" iconColor="text-primary" />
        {raw ? <div className="text-accent leading-relaxed">{renderTextWithLinks(raw)}</div> : <ZebraEmptyState message="Lifestyle info coming soon" sub="Content is being reviewed." />}
      </SectionCard>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {subSections.map((section) => {
        const Icon = section.icon;
        return (
          <SectionCard key={section.key}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <h3 className="font-bold text-base text-primary">{section.label}</h3>
            </div>
            {section.type === "list" ? (
              <ul className="space-y-1.5">
                {(section.data as string[]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-accent">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <div>{renderTextWithLinks(item)}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-accent leading-relaxed">{renderTextWithLinks(section.data as string)}</div>
            )}
          </SectionCard>
        );
      })}
    </div>
  );
}

function ResearchSection({ orgs }: { orgs: ResearchOrg[] }) {
  if (!orgs || orgs.length === 0) return <ZebraEmptyState message="Research directory coming soon" sub="Content is being reviewed." />;
  return (
    <SectionCard>
      <SectionHeader icon={Star} title="Research & Pharma Directory" iconBg="bg-primary" iconColor="text-secondary" />
      <div className="space-y-4">
        {orgs.map((org, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 border border-taupe-40 rounded-2xl p-4 hover:border-primary/40 hover:bg-secondary/10 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="font-bold text-primary text-sm mb-0.5">{renderTextWithLinks(org.name, { showIcon: false })}</h3>
                <div className="text-xs text-accent leading-relaxed">{renderTextWithLinks(org.focus)}</div>
              </div>
              {org.url && <LinkButton url={org.url} label="Visit" />}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function FaqsSection({ faqs }: { faqs: any[] }) {
  if (!faqs || faqs.length === 0) return <ZebraEmptyState message="FAQs coming soon" sub="Content is being reviewed." />;
  return (
    <SectionCard>
      <SectionHeader icon={BookOpen} title="Frequently Asked Questions" iconBg="bg-accent" iconColor="text-secondary" />
      <Accordion
        items={faqs.map((faq: any) => ({
          title: faq.question || faq.q,
          content: <div className="text-accent leading-relaxed">{renderTextWithLinks(faq.answer || faq.a)}</div>,
        }))}
      />
    </SectionCard>
  );
}

function FactsMythsSection({ items }: { items: any[] }) {
  if (!items || items.length === 0) return <ZebraEmptyState message="Facts & myths coming soon" sub="Content is being reviewed." />;

  const myths = items.filter((m) => !m.isFact);
  const facts = items.filter((m) => m.isFact);

  return (
    <SectionCard>
      <SectionHeader icon={AlertCircle} title="Facts vs Myths" iconBg="bg-primary" iconColor="text-secondary" />
      <div className="space-y-3">
        {[...myths, ...facts].map((item, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 border-2 transition-all duration-200 hover:shadow-md ${item.isFact
              ? "border-primary/20 bg-primary/5 hover:border-primary/40"
              : "border-accent/20 bg-accent/5 hover:border-accent/40"
              }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                <FactMythBadge isFact={item.isFact} />
              </div>
              <div>
                <div className="font-bold text-primary text-sm mb-1 leading-snug">
                  {renderTextWithLinks(item.statement || item.myth, { showIcon: false })}
                </div>
                {item.explanation && item.explanation !== item.statement && (
                  <div className="text-xs text-accent leading-relaxed">{renderTextWithLinks(item.explanation || item.fact)}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function SpecialistsSection({ specialists }: { specialists: Specialist[] }) {
  if (!specialists || specialists.length === 0) return null;
  return (
    <SectionCard>
      <SectionHeader icon={Globe} title="Specialist Directory" iconBg="bg-secondary" iconColor="text-primary" />
      <div className="space-y-4">
        {specialists.map((spec, i) => {
          const initials = spec.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          const professionLine = spec.profession && !spec.profession.includes("Not found") ? spec.profession : "";
          const specializationLine = spec.specialization && !spec.specialization.includes("Not found") && spec.specialization !== professionLine
            ? spec.specialization
            : "";
          const publications = spec.publications && !spec.publications.includes("Not found") ? spec.publications : "";
          const organization = spec.organization && !spec.organization.includes("Not found") ? spec.organization : "";
          const location = spec.location && !spec.location.includes("Not found") ? spec.location : "";
          const contact = spec.contact && !spec.contact.includes("Not publicly") ? spec.contact : "";

          return (
            <div
              key={i}
              className="border border-taupe-40 rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-ivory font-black text-sm shrink-0">
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name */}
                  <h3 className="font-bold text-primary text-base leading-tight mb-1">{renderTextWithLinks(spec.name, { showIcon: false })}</h3>

                  {/* Profession */}
                  {professionLine && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/30 text-primary text-xs font-semibold mb-2">
                      {renderTextWithLinks(professionLine, { showIcon: false })}
                    </span>
                  )}

                  {/* Specialization */}
                  {specializationLine && (
                    <div className="text-xs text-accent font-medium mb-2">{renderTextWithLinks(specializationLine)}</div>
                  )}

                  {/* Organization, location, contact row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1 text-xs text-accent">
                    {organization && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 shrink-0 text-primary/70" />
                        <span>{renderTextWithLinks(organization)}</span>
                      </div>
                    )}
                    {location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/70" />
                        <span>{renderTextWithLinks(location)}</span>
                      </div>
                    )}
                    {contact && (
                      <div className="flex items-center gap-1.5 font-semibold text-primary">
                        <Phone className="w-3.5 h-3.5 shrink-0 text-primary/70" />
                        <span>{renderTextWithLinks(contact)}</span>
                      </div>
                    )}
                  </div>

                  {/* Publications */}
                  {publications && (
                    <div className="text-xs text-accent leading-relaxed mt-2 italic line-clamp-2">
                      📄 {renderTextWithLinks(publications)}
                    </div>
                  )}

                  {/* Sources */}
                  {spec.sources && spec.sources.length > 0 && (
                    <div className="flex items-start gap-2 text-[11px] text-accent/70 pt-2 flex-wrap">
                      <FileText className="h-3 w-3 shrink-0 mt-0.5 text-primary/50" />
                      <span>Sources: </span>
                      {spec.sources.map((s, idx) => (
                        <span key={idx} className="inline-block mr-1">
                          {renderTextWithLinks(s)}
                          {idx < spec.sources.length - 1 ? "," : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function SourcesSection({ sources }: { sources: Source[] }) {
  if (!sources || sources.length === 0) return <ZebraEmptyState message="Sources coming soon" sub="References being compiled." />;

  const typeColors: Record<string, string> = {
    "Research Paper": "bg-blue-50 text-blue-700 border-blue-200",
    "Clinical Trial": "bg-purple-50 text-purple-700 border-purple-200",
    "Medical Authority": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Patient Organization": "bg-amber-50 text-amber-700 border-amber-200",
    "Reference": "bg-taupe/10 text-accent border-taupe-40",
  };

  return (
    <SectionCard>
      <SectionHeader icon={FileText} title="Sources & References" iconBg="bg-accent" iconColor="text-secondary" />
      <div className="space-y-3">
        {sources.map((source, i) => (
          <div
            key={i}
            className="flex items-start gap-3 border border-taupe-40 rounded-xl p-3 hover:border-primary/30 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
              <Link2 className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="font-semibold text-primary text-sm leading-tight truncate">{renderTextWithLinks(source.title, { showIcon: false })}</p>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeColors[source.type] || typeColors["Reference"]
                    }`}
                >
                  {source.type}
                </span>
              </div>
              {source.description && source.description !== source.title && (
                <div className="text-xs text-accent line-clamp-2">{renderTextWithLinks(source.description)}</div>
              )}
              {source.url && (
                <a
                  href={normalizeUrl(source.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline mt-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Source
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

// ─── PDF Download ────────────────────────────────────────────────────────────

function downloadDiseaseAsPDF(disease: Disease) {
  const logo = window.location.origin + "/logo-transparent.png";
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // ── HTML helpers ────────────────────────────────────────────────────────────
  const esc = (s: string) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:6px 12px 6px 0;font-weight:600;color:#112250;width:180px;vertical-align:top">${esc(label)}</td>
      <td style="padding:6px 0;color:#3b507d">${esc(value)}</td>
    </tr>`;

  const pill = (text: string) =>
    `<span style="display:inline-block;background:#e7e2ce;color:#112250;border-radius:999px;padding:3px 10px;font-size:12px;font-weight:600;margin:2px 2px 4px">${esc(text)}</span>`;

  const section = (title: string, content: string) =>
    content.trim()
      ? `<div style="margin-bottom:28px;page-break-inside:avoid">
          <h2 style="font-size:14px;font-weight:800;color:#112250;border-bottom:2px solid #e7e2ce;padding-bottom:5px;margin-bottom:12px;text-transform:uppercase;letter-spacing:.06em">${esc(title)}</h2>
          ${content}
        </div>`
      : "";

  // ── Field extraction (correct API field names) ──────────────────────────────

  // Overview
  const overview = typeof disease.overview === "string"
    ? disease.overview
    : (disease.overview as any)?.simple ?? JSON.stringify(disease.overview) ?? "";

  // Causes
  const causesHtml = (() => {
    const c = disease.causes;
    if (!c) return "";
    if (typeof c === "object") {
      return Object.entries(c as Record<string, string>)
        .filter(([, v]) => v)
        .map(([k, v]) => `<p style="margin:0 0 8px"><strong style="text-transform:capitalize;color:#112250">${esc(k)}:</strong> ${esc(v)}</p>`)
        .join("");
    }
    return `<p style="margin:0;color:#3b507d">${esc(String(c))}</p>`;
  })();

  // Symptoms — correct field: typesAndSymptoms
  const symptomsHtml = Array.isArray(disease.typesAndSymptoms) && disease.typesAndSymptoms.length
    ? `<div style="margin-top:4px">${disease.typesAndSymptoms.map(pill).join("")}</div>`
    : "";

  // Diagnosis — correct field: diagnosis (DiagnosticStep[])
  const diagnosisHtml = Array.isArray(disease.diagnosis) && disease.diagnosis.length
    ? disease.diagnosis.map(s =>
      `<div style="margin-bottom:12px;padding:10px 12px;background:#f8fafd;border-left:3px solid #112250;border-radius:4px">
          <p style="margin:0 0 4px;font-weight:700;color:#112250">${esc(s.name)}</p>
          ${s.what ? `<p style="margin:0 0 2px"><strong>What:</strong> ${esc(s.what)}</p>` : ""}
          ${s.how ? `<p style="margin:0 0 2px"><strong>How:</strong> ${esc(s.how)}</p>` : ""}
          ${s.result ? `<p style="margin:0"><strong>Result:</strong> ${esc(s.result)}</p>` : ""}
        </div>`
    ).join("")
    : "";

  // Lifestyle — correct field: lifestyleAndDailySupport (LifestyleData)
  const lifestyleHtml = (() => {
    const ls = disease.lifestyleAndDailySupport;
    if (!ls) return "";
    const parts: string[] = [];
    if (ls.nutrition) parts.push(`<p style="margin:0 0 6px"><strong>Nutrition:</strong> ${esc(ls.nutrition)}</p>`);
    if (Array.isArray(ls.therapies) && ls.therapies.length)
      parts.push(`<p style="margin:0 0 4px"><strong>Therapies:</strong></p><div>${ls.therapies.map(t => pill(String(t))).join("")}</div>`);
    if (Array.isArray(ls.devices) && ls.devices.length)
      parts.push(`<p style="margin:6px 0 4px"><strong>Devices / Aids:</strong></p><div>${ls.devices.map(d => pill(String(d))).join("")}</div>`);
    if (Array.isArray(ls.caregiverTips) && ls.caregiverTips.length)
      parts.push(`<p style="margin:6px 0 4px"><strong>Caregiver Tips:</strong></p><ul style="margin:0;padding-left:18px;color:#3b507d">${ls.caregiverTips.map(t => `<li>${esc(String(t))}</li>`).join("")}</ul>`);
    if (ls.community) parts.push(`<p style="margin:6px 0 0"><strong>Community:</strong> ${esc(ls.community)}</p>`);
    return parts.join("");
  })();

  // Treatments & Research — correct field: treatmentsAndPharma (ResearchOrg[])
  const treatmentsHtml = Array.isArray(disease.treatmentsAndPharma) && disease.treatmentsAndPharma.length
    ? disease.treatmentsAndPharma.map(org =>
      `<div style="margin-bottom:10px;padding:8px 12px;background:#f8fafd;border-left:3px solid #e7e2ce;border-radius:4px">
          <p style="margin:0 0 2px;font-weight:700;color:#112250">${esc(org.name)}</p>
          ${org.focus ? `<p style="margin:0 0 2px;color:#3b507d">${esc(org.focus)}</p>` : ""}
          ${org.url ? `<p style="margin:0;font-size:11px"><a href="${esc(org.url)}" style="color:#3b507d">${esc(org.url)}</a></p>` : ""}
        </div>`
    ).join("")
    : "";

  // FAQs — correct fields: question / answer (not f.q / f.a)
  const faqsHtml = Array.isArray(disease.faqs) && disease.faqs.length
    ? disease.faqs.map(f =>
      `<div style="margin-bottom:12px">
          <p style="margin:0 0 3px;font-weight:700;color:#112250">Q: ${esc(f.question)}</p>
          <p style="margin:0;color:#3b507d">A: ${esc(f.answer)}</p>
        </div>`
    ).join("")
    : "";

  // Facts & Myths — correct fields: statement / isFact / explanation (not m.myth / m.fact)
  const mythsHtml = Array.isArray(disease.factsMyths) && disease.factsMyths.length
    ? disease.factsMyths.map(m =>
      `<div style="margin-bottom:10px;padding:10px;background:#f8fafd;border-left:3px solid ${m.isFact ? "#27ae60" : "#112250"};border-radius:4px">
          <p style="margin:0 0 4px;font-weight:700;color:${m.isFact ? "#27ae60" : "#c0392b"}">${m.isFact ? "✓ Fact" : "✗ Myth"}: ${esc(m.statement)}</p>
          <p style="margin:0;color:#3b507d">${esc(m.explanation)}</p>
        </div>`
    ).join("")
    : "";

  // Specialists
  const specialistsHtml = Array.isArray(disease.specialists) && disease.specialists.length
    ? `<table style="width:100%;border-collapse:collapse">${disease.specialists.map(s =>
      `<tr style="border-bottom:1px solid #e7e2ce">
            <td style="padding:8px 12px 8px 0;vertical-align:top;width:200px">
              <p style="margin:0;font-weight:700;color:#112250">${esc(s.name)}</p>
              ${s.profession ? `<p style="margin:2px 0 0;font-size:11px;color:#3b507d">${esc(s.profession)}</p>` : ""}
              ${s.specialization ? `<p style="margin:2px 0 0;font-size:11px;color:#3b507d">${esc(s.specialization)}</p>` : ""}
            </td>
            <td style="padding:8px 0;vertical-align:top;color:#3b507d;font-size:12px">
              ${s.organization ? `<p style="margin:0 0 2px">${esc(s.organization)}</p>` : ""}
              ${s.location ? `<p style="margin:0 0 2px">📍 ${esc(s.location)}</p>` : ""}
              ${s.contact ? `<p style="margin:0 0 2px">📞 ${esc(s.contact)}</p>` : ""}
              ${s.publications ? `<p style="margin:0;font-size:11px;color:#beb7a7">${esc(s.publications)}</p>` : ""}
            </td>
          </tr>`
    ).join("")
    }</table>`
    : "";

  // Sources
  const sourcesHtml = Array.isArray(disease.sources) && disease.sources.length
    ? `<ul style="padding-left:18px;color:#3b507d;margin:0">${disease.sources.map(s =>
      `<li style="margin-bottom:6px">
            ${s.url
        ? `<a href="${esc(s.url)}" style="color:#112250;font-weight:600">${esc(s.title)}</a>`
        : `<span style="font-weight:600;color:#112250">${esc(s.title)}</span>`
      }
            ${s.type ? ` <span style="color:#beb7a7;font-size:11px">[${esc(s.type)}]</span>` : ""}
            ${s.description ? `<br/><span style="font-size:11px">${esc(s.description)}</span>` : ""}
          </li>`
    ).join("")
    }</ul>`
    : "";

  // ── Assemble HTML ───────────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${esc(disease.name)} – RareBridge</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;color:#222;background:#fff;font-size:13px;line-height:1.6}
    @media print{@page{margin:16mm 14mm;size:A4}.no-print{display:none!important}}
    .page{max-width:780px;margin:0 auto;padding:28px 20px}
    .header{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #112250;padding-bottom:14px;margin-bottom:22px}
    .header img{height:52px;object-fit:contain}
    .header-meta{text-align:right;color:#3b507d;font-size:11px}
    .disease-title{font-size:24px;font-weight:900;color:#112250;margin-bottom:3px}
    .disease-sub{font-size:12px;color:#3b507d;margin-bottom:18px}
    table{border-collapse:collapse;width:100%}
    .footer-bar{margin-top:36px;border-top:2px solid #e7e2ce;padding-top:8px;font-size:11px;color:#beb7a7;display:flex;justify-content:space-between}
    p{margin-bottom:6px;color:#3b507d}
    strong{color:#112250}
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <img src="${logo}" alt="RareBridge"/>
    <div class="header-meta">
      <div style="font-weight:700;color:#112250;font-size:13px">RareBridge Disease Profile</div>
      <div>Downloaded ${today}</div>
      <div style="color:#beb7a7;font-size:10px;margin-top:2px">For informational purposes only. Not medical advice.</div>
    </div>
  </div>

  <div class="disease-title">${esc(disease.name)}</div>
  <div class="disease-sub">${esc(disease.category ?? "Rare Disease")}</div>

  ${section("Overview", `<p style="color:#3b507d;margin:0">${esc(overview)}</p>`)}

  ${section("Causes", causesHtml)}

  ${section("Symptoms & Types", symptomsHtml)}

  ${section("Diagnosis", diagnosisHtml)}

  ${section("Lifestyle & Daily Support", lifestyleHtml)}

  ${section("Treatments & Research", treatmentsHtml)}

  ${section("Frequently Asked Questions", faqsHtml)}

  ${section("Facts & Myths", mythsHtml)}

  ${section("Specialists", specialistsHtml)}

  ${section("Sources", sourcesHtml)}

  <div class="footer-bar">
    <span>© ${new Date().getFullYear()} RareBridge — rarebridge.org</span>
    <span>Connecting families, researchers &amp; specialists</span>
  </div>
</div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=960,height=750");
  if (!win) {
    alert("Please allow popups for this site to download the PDF.");
    return;
  }
  win.document.write(html);
  win.document.close();
  win.onload = () => { win.focus(); win.print(); };
}

export default function DiseasePage({ diseaseId, onBack }: { diseaseId: string; onBack: () => void }) {
  const [disease, setDisease] = useState<Disease | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);

  useEffect(() => {
    async function loadDisease() {
      setLoading(true);
      try {
        const d = await apiService.getDiseaseById(diseaseId);
        setDisease(d);
        setAiMessages([
          {
            role: "ai",
            text: `Hello! I'm RareBridge AI. I can help you understand research papers and complex medical information about ${d.name}. Ask me anything, or upload a research paper to get started.`,
          },
        ]);
      } catch (error) {
        console.error("Failed to load disease:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDisease();
  }, [diseaseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-primary">Loading disease information...</p>
        </div>
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-primary">Failed to load disease information</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary text-ivory rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  function sendAI() {
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiInput("");
    setAiMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg },
      {
        role: "ai",
        text: `Here is a simplified explanation: Research on ${disease!.name} suggests that the genetic mutations involved affect critical enzyme function.`,
      },
    ]);
  }

  const categoryBadges = disease.category
    ? disease.category.split(/[·,]/).map((c) => c.trim()).filter(Boolean)
    : ["Rare Disease"];

  const shortDesc = disease.overview
    ? disease.overview.length > 180
      ? disease.overview.substring(0, 180) + "..."
      : disease.overview
    : "Comprehensive rare disease details and support resources.";

  const quickInfoCards = [
    { label: "Category", value: categoryBadges.join(" · "), icon: Dna },
    { label: "Inheritance", value: "Genetic", icon: FlaskConical },
    { label: "Age of Onset", value: "Variable", icon: Baby },
    { label: "Severity", value: "Severe", icon: Activity },
  ];

  const sectionDefs = [
    { key: "Overview", label: "Overview", show: !!disease.overview },
    { key: "Causes", label: "Causes", show: !!disease.causes && disease.causes !== "Information not available" },
    { key: "Symptoms", label: "Symptoms", show: Array.isArray(disease.typesAndSymptoms) && disease.typesAndSymptoms.length > 0 },
    { key: "Diagnosis", label: "Diagnosis", show: Array.isArray(disease.diagnosis) && disease.diagnosis.length > 0 },
    {
      key: "Lifestyle", label: "Lifestyle", show: !!disease.lifestyleAndDailySupport && (
        (Array.isArray(disease.lifestyleAndDailySupport.therapies) && disease.lifestyleAndDailySupport.therapies.length > 0) ||
        !!disease.lifestyleAndDailySupport.nutrition ||
        (Array.isArray(disease.lifestyleAndDailySupport.devices) && disease.lifestyleAndDailySupport.devices.length > 0) ||
        (Array.isArray(disease.lifestyleAndDailySupport.caregiverTips) && disease.lifestyleAndDailySupport.caregiverTips.length > 0) ||
        !!disease.lifestyleAndDailySupport.community ||
        !!disease.lifestyleAndDailySupport.raw
      )
    },
    { key: "Research", label: "Research", show: Array.isArray(disease.treatmentsAndPharma) && disease.treatmentsAndPharma.length > 0 },
    { key: "FAQ", label: "FAQ", show: Array.isArray(disease.faqs) && disease.faqs.length > 0 },
    { key: "Facts & Myths", label: "Facts & Myths", show: Array.isArray(disease.factsMyths) && disease.factsMyths.length > 0 },
    { key: "Specialists", label: "Specialists", show: Array.isArray(disease.specialists) && disease.specialists.length > 0 },
    { key: "Sources", label: "Sources", show: Array.isArray(disease.sources) && disease.sources.length > 0 },
  ].filter(s => s.show);

  const currentTab = sectionDefs[activeSection]?.key || sectionDefs[0]?.key || "Overview";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Left side curvy lines */}
      <svg className="fixed left-0 top-0 h-full w-32 pointer-events-none opacity-10" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <path d="M20 0 Q50 100 20 200 T20 400 T20 600 T20 800 T20 1000" stroke="var(--primary)" strokeWidth="3" fill="none" />
        <path d="M40 0 Q70 150 40 300 T40 600 T40 900 T40 1000" stroke="var(--purple)" strokeWidth="2" fill="none" />
        <path d="M60 0 Q90 200 60 400 T60 800 T60 1000" stroke="var(--green)" strokeWidth="2" fill="none" />
      </svg>
      {/* Right side curvy lines */}
      <svg className="fixed right-0 top-0 h-full w-32 pointer-events-none opacity-10" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <path d="M80 0 Q50 100 80 200 T80 400 T80 600 T80 800 T80 1000" stroke="var(--primary)" strokeWidth="3" fill="none" />
        <path d="M60 0 Q30 150 60 300 T60 600 T60 900 T60 1000" stroke="var(--purple)" strokeWidth="2" fill="none" />
        <path d="M40 0 Q10 200 40 400 T40 800 T40 1000" stroke="var(--green)" strokeWidth="2" fill="none" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary mb-4 group transition-colors"
        >
          <ChevronDown className="w-4 h-4 rotate-90 group-hover:-translate-x-0.5 transition-transform" />
          Back to Directory
        </button>

        {/* Hero banner */}
        <div className="bg-primary rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden">
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-md">
                <Dna className="w-5 h-5 text-secondary" />
              </div>
              {categoryBadges.map((b) => (
                <span key={b} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent text-secondary">
                  {b}
                </span>
              ))}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/20 text-secondary">
                Active Research
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
              <h1 className="font-black text-2xl md:text-3xl text-ivory">{disease.name}</h1>
              <button
                onClick={() => downloadDiseaseAsPDF(disease)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-ivory text-sm font-bold transition-all duration-200 border border-white/20 shrink-0"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
            <p className="text-taupe text-sm max-w-2xl">{shortDesc}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {quickInfoCards.map((card) => (
                <div key={card.label} className="bg-primary-dark rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <card.icon className="w-3.5 h-3.5 text-taupe" />
                    <span className="text-xs text-taupe font-medium">{card.label}</span>
                  </div>
                  <div className="font-bold text-secondary text-xs sm:text-sm">{card.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section tabs - Only show tabs with actual data */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {sectionDefs.map((sec, i) => (
            <button
              key={sec.key}
              onClick={() => setActiveSection(i)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeSection === i
                ? "bg-primary text-ivory shadow-md"
                : "bg-white text-accent border border-taupe-40 hover:border-accent/40 hover:text-primary"
                }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* ── Section content ── */}

        {/* Overview */}
        {currentTab === "Overview" && (
          <SectionCard>
            <SectionHeader icon={BookOpen} title="Simple Explanation" iconBg="bg-secondary" iconColor="text-primary" />
            <div className="text-accent leading-relaxed">{renderTextWithLinks(disease.overview)}</div>
          </SectionCard>
        )}

        {/* Causes */}
        {currentTab === "Causes" && (
          <SectionCard>
            <SectionHeader icon={FlaskConical} title="Causes" iconBg="bg-primary" iconColor="text-secondary" />
            {typeof disease.causes === 'object' && disease.causes !== null ? (
              <div className="space-y-4">
                {(disease.causes as Causes).genetic && (
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Dna className="w-4 h-4 text-primary" />
                      <h4 className="font-bold text-primary text-sm">Genetic Factors</h4>
                    </div>
                    <div className="text-accent text-sm leading-relaxed">{renderTextWithLinks((disease.causes as Causes).genetic)}</div>
                  </div>
                )}
                {(disease.causes as Causes).environmental && (disease.causes as Causes).environmental !== "Unknown" && (
                  <div className="bg-secondary/5 rounded-xl p-4 border border-secondary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <FlaskConical className="w-4 h-4 text-primary" />
                      <h4 className="font-bold text-primary text-sm">Environmental Factors</h4>
                    </div>
                    <div className="text-accent text-sm leading-relaxed">{renderTextWithLinks((disease.causes as Causes).environmental)}</div>
                  </div>
                )}
                {(disease.causes as Causes).unknown && (disease.causes as Causes).unknown !== "Unknown" && (
                  <div className="bg-taupe-10 rounded-xl p-4 border border-taupe-40">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-accent" />
                      <h4 className="font-bold text-primary text-sm">Additional Factors</h4>
                    </div>
                    <div className="text-accent text-sm leading-relaxed">{renderTextWithLinks((disease.causes as Causes).unknown)}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-accent leading-relaxed">{renderTextWithLinks(disease.causes as string)}</div>
            )}
          </SectionCard>
        )}

        {/* Symptoms */}
        {currentTab === "Symptoms" && (
          <SymptomsSection symptoms={disease.typesAndSymptoms} />
        )}

        {/* Diagnosis */}
        {currentTab === "Diagnosis" && (
          <DiagnosisSection steps={disease.diagnosis} />
        )}

        {/* Lifestyle */}
        {currentTab === "Lifestyle" && (
          <LifestyleSection lifestyle={disease.lifestyleAndDailySupport} />
        )}

        {/* Research */}
        {currentTab === "Research" && (
          <ResearchSection orgs={disease.treatmentsAndPharma} />
        )}

        {/* FAQ */}
        {currentTab === "FAQ" && (
          <FaqsSection faqs={disease.faqs || []} />
        )}

        {/* Facts & Myths */}
        {currentTab === "Facts & Myths" && (
          <FactsMythsSection items={disease.factsMyths || []} />
        )}

        {/* Specialists */}
        {currentTab === "Specialists" && (
          <SpecialistsSection specialists={disease.specialists || []} />
        )}

        {/* Sources */}
        {currentTab === "Sources" && (
          <SourcesSection sources={disease.sources || []} />
        )}
      </div>

      {/* AI Chat button */}
      <button
        onClick={() => setAiOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-6 w-14 h-14 rounded-2xl bg-primary text-secondary shadow-xl shadow-primary-20 flex items-center justify-center hover:bg-primary-dark hover:scale-105 transition-all z-40"
        title="RareBridge AI"
      >
        <Bot className="w-6 h-6" />
      </button>

      {aiOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-primary px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                  <Bot className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="font-black text-ivory text-sm">RareBridge AI</div>
                  <div className="text-taupe text-xs">Simplifying rare disease research</div>
                </div>
              </div>
              <button onClick={() => setAiOpen(false)} className="p-1.5 rounded-xl hover:bg-accent transition-colors">
                <ChevronDown className="w-5 h-5 text-taupe" />
              </button>
            </div>

            <div className="h-72 overflow-y-auto p-5 space-y-3 bg-ivory">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center mr-2 mt-0.5 shrink-0">
                      <Bot className="w-4 h-4 text-secondary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                      ? "bg-primary text-secondary rounded-br-sm"
                      : "bg-white text-accent rounded-bl-sm shadow-sm border border-secondary"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-secondary p-4 space-y-2 bg-white">
              <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-taupe text-accent text-sm font-semibold hover:bg-ivory transition-colors">
                <Upload className="w-4 h-4" /> Upload a Research Paper (PDF)
              </button>
              <div className="flex gap-2">
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendAI()}
                  placeholder="Ask me anything about this disease..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-ivory border-2 border-secondary focus:border-accent focus:outline-none text-sm text-primary placeholder:text-taupe"
                />
                <button
                  onClick={sendAI}
                  className="w-10 h-10 rounded-xl bg-primary text-secondary flex items-center justify-center hover:bg-primary-dark transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

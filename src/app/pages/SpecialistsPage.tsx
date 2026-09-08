import React, { useEffect, useState, useCallback } from "react";
import {
  Stethoscope,
  MapPin,
  Building2,
  Phone,
  BookOpen,
  FlaskConical,
  Loader2,
  FileText,
  RefreshCw,
} from "lucide-react";
import { apiService } from "../services/api.service";
import type { Specialist, Disease } from "../services/api.service";
import { ZebraMascot, ZebraDoodle } from "../components/common/Visuals";
import { renderTextWithLinks } from "../utils/link-helper";

// Specialist as it comes from the API, plus which disease it was found under
interface SpecialistWithDisease extends Specialist {
  disease: string;
}

function SpecialistCard({ s }: { s: SpecialistWithDisease }) {
  const profession = s.profession?.trim() || "";
  const specialization = s.specialization?.trim() || "";
  const sources = s.sources || [];
  const hasWhereToFind = (s.organization && s.organization.trim() !== "") ||
                         (s.location && s.location.trim() !== "") ||
                         (s.contact && s.contact.trim() !== "");

  return (
    <div className="relative overflow-hidden rounded-3xl border border-secondary bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">
      {/* Decorative blur blob */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent-10 blur-2xl" />

      <div className="relative space-y-4">
        {/* Keep the specialist name as the anchor for all related details. */}
        <div className="flex items-start gap-3 border-b border-secondary/70 pb-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary">
            <Stethoscope className="h-5 w-5 text-secondary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-primary leading-snug text-base">{renderTextWithLinks(s.name, { showIcon: false })}</h3>
            {profession && <p className="text-xs text-accent mt-1 font-medium">{renderTextWithLinks(profession, { showIcon: false })}</p>}
            {specialization && specialization !== profession && (
              <p className="text-xs text-accent/80 mt-1">{renderTextWithLinks(specialization, { showIcon: false })}</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-secondary/80 px-3.5 py-2 text-xs font-semibold text-primary flex items-center gap-2">
          <Stethoscope className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span>Disease: <strong className="font-bold">{s.disease}</strong></span>
        </div>

        {hasWhereToFind && (
          <div className="space-y-2 text-xs">
            <p className="font-bold text-accent/80 text-[11px] uppercase tracking-wider">Contact details</p>

            {/* Organization */}
            {s.organization && s.organization.trim() !== "" && (
              <div className="flex items-start gap-2 text-accent">
                <Building2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary/70" />
                <span className="font-medium">{renderTextWithLinks(s.organization)}</span>
              </div>
            )}

            {/* Location */}
            {s.location && s.location.trim() !== "" && (
              <div className="flex items-start gap-2 text-accent">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary/70" />
                <span>{renderTextWithLinks(s.location)}</span>
              </div>
            )}

            {/* Contact Information */}
            {s.contact && s.contact.trim() !== "" && (
              <div className="flex items-start gap-2 text-accent pt-0.5">
                <Phone className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary/70" />
                <span className="font-semibold text-primary">{renderTextWithLinks(s.contact)}</span>
              </div>
            )}
          </div>
        )}

        {/* Publications */}
        {s.publications && s.publications.trim() !== "" && (
          <div className="flex items-start gap-2 text-xs text-accent/80">
            <BookOpen className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary/60" />
            <span className="line-clamp-2">{renderTextWithLinks(s.publications)}</span>
          </div>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <div className="flex items-start gap-2 text-[11px] text-accent/70 pt-1 flex-wrap">
            <FileText className="h-3 w-3 shrink-0 mt-0.5 text-primary/50" />
            <span>Sources: </span>
            {sources.map((src, idx) => (
              <span key={idx} className="inline-block mr-1">
                {renderTextWithLinks(src)}
                {idx < sources.length - 1 ? "," : ""}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState<SpecialistWithDisease[]>([]);
  const [allDiseases, setAllDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const sampleSixSpecialists = useCallback((diseasesList: Disease[]) => {
    const diseasesWithSpecialists = diseasesList.filter(
      (d) => d.specialists && d.specialists.length > 0
    );

    if (diseasesWithSpecialists.length === 0) {
      setSpecialists([]);
      return;
    }

    const shuffledDiseases = [...diseasesWithSpecialists].sort(() => 0.5 - Math.random());
    const selectedDiseases = shuffledDiseases.slice(0, Math.min(5, shuffledDiseases.length));

    const candidates: SpecialistWithDisease[] = [];
    for (const disease of selectedDiseases) {
      for (const s of disease.specialists || []) {
        candidates.push({ ...s, disease: disease.name });
      }
    }

    let pool = candidates;
    if (pool.length < 6) {
      pool = [];
      for (const disease of diseasesWithSpecialists) {
        for (const s of disease.specialists || []) {
          pool.push({ ...s, disease: disease.name });
        }
      }
    }

    const shuffledSpecialists = [...pool].sort(() => 0.5 - Math.random());
    const result = shuffledSpecialists.slice(0, 6);
    setSpecialists(result);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const diseases = await apiService.getDiseases();
      setAllDiseases(diseases);
      sampleSixSpecialists(diseases);
    } catch (err) {
      console.error("Failed to load specialists:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [sampleSixSpecialists]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Left curvy lines */}
      <svg className="fixed left-0 top-0 h-full w-32 pointer-events-none opacity-10" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <path d="M20 0 Q50 100 20 200 T20 400 T20 600 T20 800 T20 1000" stroke="var(--primary)" strokeWidth="3" fill="none" />
        <path d="M40 0 Q70 150 40 300 T40 600 T40 900 T40 1000" stroke="var(--purple)" strokeWidth="2" fill="none" />
        <path d="M60 0 Q90 200 60 400 T60 800 T60 1000" stroke="var(--green)" strokeWidth="2" fill="none" />
      </svg>
      {/* Right curvy lines */}
      <svg className="fixed right-0 top-0 h-full w-32 pointer-events-none opacity-10" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <path d="M80 0 Q50 100 80 200 T80 400 T80 600 T80 800 T80 1000" stroke="var(--primary)" strokeWidth="3" fill="none" />
        <path d="M60 0 Q30 150 60 300 T60 600 T60 900 T60 1000" stroke="var(--purple)" strokeWidth="2" fill="none" />
        <path d="M40 0 Q10 200 40 400 T40 800 T40 1000" stroke="var(--green)" strokeWidth="2" fill="none" />
      </svg>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-3xl bg-ivory p-10 mb-10 border border-secondary">
          <div className="absolute left-6 top-6 opacity-10 pointer-events-none">
            <ZebraMascot size={120} />
          </div>
          <div className="absolute right-6 bottom-6 opacity-20 pointer-events-none">
            <ZebraDoodle className="w-48 h-32" />
          </div>
          <div className="relative text-center">
            <h1 className="font-black text-3xl text-primary mb-3">Featured Specialists Directory</h1>
            <p className="text-accent max-w-2xl mx-auto text-sm leading-relaxed">
              Connect with expert medical teams, geneticists, and specialists. Showing 6 featured specialist contacts across rare diseases.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => sampleSixSpecialists(allDiseases)}
                disabled={loading || allDiseases.length === 0}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-xs font-bold text-secondary shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Shuffle 6 Specialists
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-accent">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm font-medium">Loading specialists...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-secondary bg-white p-8 text-center text-accent shadow-sm">
            <p className="font-semibold text-primary mb-1">Could not load specialists</p>
            <p className="text-sm">Please check your connection and try again.</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && specialists.length === 0 && (
          <div className="rounded-3xl border border-secondary bg-white p-8 text-center text-accent shadow-sm">
            <p className="font-semibold text-primary mb-1">No specialists found yet</p>
            <p className="text-sm">Please check back for more listings.</p>
          </div>
        )}

        {/* Grid - Exactly 6 Cards */}
        {!loading && !error && specialists.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {specialists.map((s, i) => (
              <SpecialistCard key={`${s.name}-${s.disease}-${i}`} s={s} />
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="rounded-3xl bg-primary p-10 text-secondary text-center">
          <h2 className="font-black text-2xl mb-4">Specialist care starts with a trusted referral.</h2>
          <p className="text-sm leading-relaxed max-w-3xl mx-auto">
            RareBridge helps families find the right specialist teams — from neurologists and geneticists
            to metabolic care providers and allied health professionals.
          </p>
        </div>
      </div>
    </div>
  );
}

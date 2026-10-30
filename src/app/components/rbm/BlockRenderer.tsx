import React, { useState } from 'react';
import { Block, GroupBlock, RecordBlock, ListBlock, LabeledBlock, ParagraphBlock } from '../../utils/rbm/rbm.schema';
import { SpanRenderer } from './SpanRenderer';
import { ExternalLink, ChevronDown, ChevronUp, Stethoscope, Building2, MapPin, Mail, Phone, BookOpen, Globe, ShieldAlert, CheckCircle } from 'lucide-react';
import SpecialistAvatar from '../common/SpecialistAvatar';

interface BlockRendererProps {
  block: Block;
  className?: string;
}

export function BlockRenderer({ block, className = '' }: BlockRendererProps) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className={`font-body text-sm sm:text-base leading-relaxed text-[#3B507D] mb-3 last:mb-0 ${className}`}>
          <SpanRenderer spans={block.spans} />
        </p>
      );

    case 'labeled':
      return (
        <div className={`mb-3.5 last:mb-0 font-body ${className}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="font-body text-sm sm:text-base font-bold text-[#112250] shrink-0">
              {block.label}:
            </span>
            <div className="font-body text-sm sm:text-base leading-relaxed text-[#3B507D]">
              <SpanRenderer spans={block.body} />
            </div>
          </div>
        </div>
      );

    case 'list':
      return (
        <div className={`mb-4 last:mb-0 font-body ${className}`}>
          {block.label && (
            <h4 className="font-heading text-sm sm:text-base font-bold text-[#112250] mb-2.5">
              {block.label}
            </h4>
          )}
          <ul className="space-y-2 list-none pl-1">
            {block.items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 font-body text-sm sm:text-base leading-relaxed text-[#3B507D]"
                style={{ paddingLeft: `${(item.level || 0) * 1.25}rem` }}
              >
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#112250] shrink-0" />
                <div className="flex-1">
                  <SpanRenderer spans={item.spans} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'group':
      return <GroupCard group={block} className={className} />;

    case 'record':
      if (block.kind === 'org') {
        return <OrgCard record={block} className={className} />;
      }
      if (block.kind === 'specialist') {
        return <SpecialistCard record={block} className={className} />;
      }
      return null;

    default:
      return null;
  }
}

/**
 * Renders a group block, with accordion support for diagnostic procedures & tests.
 */
function GroupCard({ group, className = '' }: { group: GroupBlock; className?: string }) {
  const isDiagnosticMethod = group.blocks.some(
    b => b.type === 'labeled' && /what it is|how it works|result/i.test(b.label)
  );
  const isMyth = /myth/i.test(group.title);

  const [expanded, setExpanded] = useState(true);

  if (isMyth) {
    return (
      <div className={`rounded-xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-4 sm:p-6 mb-4 shadow-xs ${className}`}>
        <div className="rounded-lg bg-white border border-[#E7E2CE] p-3.5 sm:p-4 mb-3 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#112250] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase shadow-2xs">
              <ShieldAlert className="h-3 w-3" /> Myth
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#112250]">{group.title.replace(/^myth\s*:\s*/i, '')}</p>
        </div>
        <div className="rounded-lg bg-[#F0F5FF] border border-[#BFD5F8] p-3.5 sm:p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#3B507D] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase shadow-2xs">
              <CheckCircle className="h-3 w-3" /> Fact
            </span>
          </div>
          <div className="space-y-2">
            {group.blocks.map((child, idx) => (
              <BlockRenderer key={idx} block={child} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isDiagnosticMethod) {
    return (
      <div className={`rounded-xl border-2 border-[#E7E2CE] bg-white p-5 sm:p-6 mb-4 shadow-sm hover:border-[#112250]/40 transition-all ${className}`}>
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#F5F4F0] flex items-center justify-center text-[#112250] shrink-0">
              <Stethoscope className="h-4 w-4 text-[#112250]" />
            </div>
            <h4 className="font-heading text-base sm:text-lg font-bold text-[#112250]">
              {group.title}
            </h4>
          </div>
          <button
            type="button"
            className="p-1 rounded-md text-[#3B507D] hover:bg-[#F5F4F0] transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-[#F5F4F0] space-y-3">
            {group.blocks.map((child, idx) => (
              <BlockRenderer key={idx} block={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`mb-6 last:mb-0 ${className}`}>
      <h3 className="font-heading text-base sm:text-lg font-bold text-[#112250] mb-3 pb-2 border-b border-[#E7E2CE]">
        {group.title}
      </h3>
      <div className="space-y-3">
        {group.blocks.map((child, idx) => {
          const isNutrition =
            child.type === 'labeled' &&
            /^(?:diets?(?:\s*[\/&]\s*nutrition)?|nutrition(?:al)?(?:\s+guidance)?)$/i.test(child.label.trim());
          return (
            <React.Fragment key={idx}>
              {isNutrition && idx > 0 && (
                <div className="py-2" role="separator" aria-orientation="horizontal">
                  <hr className="border-t border-[#E7E2CE]" />
                </div>
              )}
              <BlockRenderer block={child} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Organization card with working Official Website link.
 */
function OrgCard({ record, className = '' }: { record: RecordBlock; className?: string }) {
  const getField = (pattern: RegExp) => record.fields.find(f => pattern.test(f.label));

  const nameField = getField(/name/i) || record.fields[0];
  const focusField = getField(/focus/i);
  const websiteField = getField(/website|url|link/i);
  const otherFields = record.fields.filter(
    f => f !== nameField && f !== focusField && f !== websiteField
  );

  // Extract primary href if present
  const websiteHref = websiteField?.body.find(s => s.href)?.href ||
    websiteField?.body.map(s => s.t).join('').trim();

  return (
    <div className={`rounded-xl border-2 border-[#E7E2CE] bg-white p-5 sm:p-6 mb-4 shadow-sm hover:border-[#112250]/40 transition-all ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-[#F5F4F0] flex items-center justify-center text-[#112250] shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <h4 className="font-heading text-base sm:text-lg font-bold text-[#112250]">
              <SpanRenderer spans={nameField?.body} />
            </h4>
          </div>

          {focusField && (
            <div className="text-sm font-body text-[#3B507D] leading-relaxed pl-9">
              <span className="font-semibold text-[#112250]">Focus Area: </span>
              <SpanRenderer spans={focusField.body} />
            </div>
          )}

          {otherFields.map((f, idx) => (
            <div key={idx} className="text-sm font-body text-[#3B507D] leading-relaxed pl-9">
              <span className="font-semibold text-[#112250]">{f.label}: </span>
              <SpanRenderer spans={f.body} />
            </div>
          ))}
        </div>

        {websiteHref && (
          <div className="shrink-0 pt-1 sm:pt-0 pl-9 sm:pl-0">
            <a
              href={websiteHref.startsWith('http') ? websiteHref : `https://${websiteHref}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#112250] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#3B507D] transition-colors shadow-sm"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Official Website</span>
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Specialist profile card.
 */
function SpecialistCard({ record, className = '' }: { record: RecordBlock; className?: string }) {
  const getField = (pattern: RegExp) => record.fields.find(f => pattern.test(f.label));

  const nameField = getField(/name/i) || record.fields[0];
  const profField = getField(/profession/i);
  const specField = getField(/specializ/i);
  const orgField = getField(/organiza/i);
  const locField = getField(/location/i);
  const contactField = getField(/contact/i);
  const pubField = getField(/publication/i);
  const sourceField = getField(/source/i);

  const nameText = nameField?.body.map(s => s.t).join('').trim() || 'Specialist';

  return (
    <div className={`rounded-xl border-2 border-[#E7E2CE] bg-white p-5 sm:p-6 mb-4 shadow-sm hover:border-[#112250]/40 transition-all ${className}`}>
      <div className="flex items-start gap-4">
        <SpecialistAvatar name={nameText} size={52} />
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h4 className="font-heading text-lg font-bold text-[#112250] leading-snug">
              <SpanRenderer spans={nameField?.body} />
            </h4>
            {profField && (
              <p className="text-sm font-semibold text-[#3B507D] mt-0.5">
                <SpanRenderer spans={profField.body} />
              </p>
            )}
            {specField && (
              <p className="text-xs font-medium text-[#3B507D]/80 mt-0.5">
                <SpanRenderer spans={specField.body} />
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-[#3B507D]">
            {orgField && (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#3B507D]/70 shrink-0" />
                <span><SpanRenderer spans={orgField.body} /></span>
              </div>
            )}
            {locField && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#3B507D]/70 shrink-0" />
                <span><SpanRenderer spans={locField.body} /></span>
              </div>
            )}
          </div>

          {contactField && (
            <div className="pt-1.5 border-t border-[#F5F4F0] text-xs font-medium text-[#112250]">
              <span className="text-[#3B507D]">Contact: </span>
              <SpanRenderer spans={contactField.body} />
            </div>
          )}

          {pubField && (
            <div className="text-xs text-[#3B507D]">
              <span className="font-semibold text-[#112250]">Recent Publications: </span>
              <SpanRenderer spans={pubField.body} />
            </div>
          )}

          {sourceField && (
            <div className="text-xs text-[#3B507D]">
              <span className="font-semibold text-[#112250]">Sources: </span>
              <SpanRenderer spans={sourceField.body} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Top-level renderer for block arrays.
 */
export function BlocksRenderer({ blocks, className = '' }: { blocks?: Block[]; className?: string }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className={`space-y-3.5 ${className}`}>
      {blocks.map((block, idx) => {
        const isNutritionBlock =
          (block.type === 'labeled' &&
            /^(?:diets?(?:\s*[\/&]\s*nutrition)?|nutrition(?:al)?(?:\s+guidance)?)$/i.test(block.label.trim())) ||
          (block.type === 'group' &&
            /^(?:diets?(?:\s*[\/&]\s*nutrition)?|nutrition(?:al)?(?:\s+guidance)?)$/i.test(block.title.trim()));

        return (
          <React.Fragment key={idx}>
            {isNutritionBlock && idx > 0 && (
              <div className="py-2" role="separator" aria-orientation="horizontal">
                <hr className="border-t border-[#E7E2CE]" />
              </div>
            )}
            <BlockRenderer block={block} />
          </React.Fragment>
        );
      })}
    </div>
  );
}

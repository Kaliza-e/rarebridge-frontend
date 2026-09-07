import React from "react";
import { ExternalLink, Mail } from "lucide-react";

/**
 * Common Top-Level Domains and medical/academic authorities to reliably identify domain-like text.
 */
export const COMMON_TLDS = [
  'gov', 'org', 'edu', 'com', 'net', 'io', 'health', 'care', 'int', 'info', 'mil',
  'de', 'uk', 'fr', 'ch', 'au', 'ca', 'eu', 'nl', 'be', 'es', 'it', 'jp', 'cn', 'in',
  'br', 'se', 'no', 'dk', 'fi', 'pl', 'at', 'cz', 'gr', 'hu', 'ie', 'il', 'is', 'lu',
  'nz', 'pt', 'ro', 'sg', 'za', 'ai', 'app', 'co', 'me', 'online', 'global', 'bio', 'tech',
  'life', 'med', 'clinic', 'hospital', 'foundation', 'research', 'center', 'centre',
  'nih.gov', 'cancer.gov', 'ncbi.nlm.nih.gov'
].sort((a, b) => b.length - a.length).map(t => t.replace('.', '\\.')).join('|');

/**
 * Universal Regex to match:
 * 1. Markdown link: [label](url)
 * 2. Email: user@domain.com
 * 3. Full URL with scheme: https://... or http://...
 * 4. www. domain: www.domain.com/...
 * 5. Domain-like text with valid TLD: cancer.gov/trials, mayoclinic.org, example.org/page, etc.
 */
export const UNIVERSAL_LINK_REGEX = new RegExp(
  // 1. Markdown link: [label](url)
  '\\[([^\\]]+)\\]\\(((?:https?:\\/\\/|www\\.|[a-zA-Z0-9][-a-zA-Z0-9]*\\.[a-zA-Z]{2,})[^\\s\\)]*)\\)' +
  '|' +
  // 2. Email address: name@example.com
  '([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})' +
  '|' +
  // 3. Full URL with scheme: http://... or https://...
  '(https?:\\/\\/[^\\s<>"\'`\\[\\]{}|]+)' +
  '|' +
  // 4. www. domain: www.example.com/...
  '(www\\.[a-zA-Z0-9][-a-zA-Z0-9]*(?:\\.[a-zA-Z0-9][-a-zA-Z0-9]*)*(?:\\/[^\\s<>"\'`\\[\\]{}|]*)?)' +
  '|' +
  // 5. Domain-like text with known TLDs or paths: example.org, cancer.gov/trials, etc.
  '((?<!@)(?:\\b)[a-zA-Z0-9][-a-zA-Z0-9]*(?:\\.[a-zA-Z0-9][-a-zA-Z0-9]*)*\\.(?:' + COMMON_TLDS + ')(?:\\/[^\\s<>"\'`\\[\\]{}|]*)?)',
  'gi'
);

/**
 * Clean trailing punctuation from a matched URL (e.g., period, comma, closing parentheses/brackets).
 */
export function cleanTrailingPunctuation(url: string): { clean: string; trailing: string } {
  let clean = url;
  let trailing = '';
  while (/[.,;:?!'"`\)\]}>]$/.test(clean)) {
    const lastChar = clean[clean.length - 1];
    if (lastChar === ')' && clean.includes('(')) {
      break; // keep balanced parens
    }
    if (lastChar === ']' && clean.includes('[')) {
      break; // keep balanced brackets
    }
    trailing = lastChar + trailing;
    clean = clean.slice(0, -1);
  }
  return { clean, trailing };
}

/**
 * Normalize a web URL or email to an absolute URL with protocol.
 */
export function normalizeUrl(rawUrl: string, isEmail = false): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (isEmail) {
    if (!trimmed.startsWith('mailto:')) return `mailto:${trimmed}`;
    return trimmed;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export interface LinkRenderOptions {
  className?: string;
  linkClassName?: string;
  showIcon?: boolean;
  preserveNewlines?: boolean;
}

/**
 * Parses free text containing URLs, domain patterns, keyword-prefixed links, or markdown links
 * into safe, interactive React elements that can be clicked and visited.
 */
export function renderTextWithLinks(
  text: string | null | undefined,
  options: LinkRenderOptions = {}
): React.ReactNode {
  if (text === null || text === undefined) return null;
  const str = String(text);
  if (!str.trim()) return str;

  const {
    showIcon = true,
    linkClassName = "inline-flex items-center gap-1 font-semibold text-primary underline decoration-accent/40 hover:decoration-primary hover:text-accent transition-colors break-words",
    preserveNewlines = true
  } = options;

  const regex = new RegExp(UNIVERSAL_LINK_REGEX.source, 'gi');
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(str)) !== null) {
    // 1. Text before match
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // Markdown link [label](url)
      const label = match[1];
      const { clean: rawUrl, trailing } = cleanTrailingPunctuation(match[2]);
      const href = normalizeUrl(rawUrl);

      parts.push(
        <a
          key={`md-${match.index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={linkClassName}
        >
          <span>{label}</span>
          {showIcon && <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-70" />}
        </a>
      );
      if (trailing) parts.push(trailing);
    } else if (match[3]) {
      // Email address
      const { clean: email, trailing } = cleanTrailingPunctuation(match[3]);
      const href = normalizeUrl(email, true);

      parts.push(
        <a
          key={`email-${match.index}`}
          href={href}
          onClick={(e) => e.stopPropagation()}
          className={linkClassName}
        >
          <span>{email}</span>
          {showIcon && <Mail className="w-3 h-3 inline-block shrink-0 opacity-70" />}
        </a>
      );
      if (trailing) parts.push(trailing);
    } else {
      // Raw URL / www / domain match
      const rawMatch = match[4] || match[5] || match[6];
      if (rawMatch) {
        const { clean: cleanUrl, trailing } = cleanTrailingPunctuation(rawMatch);
        const href = normalizeUrl(cleanUrl);

        parts.push(
          <a
            key={`url-${match.index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={linkClassName}
          >
            <span>{cleanUrl}</span>
            {showIcon && <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-70" />}
          </a>
        );
        if (trailing) parts.push(trailing);
      }
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  // If no links found, return string or newline-preserved elements
  if (parts.length === 0) {
    return str;
  }

  if (preserveNewlines && str.includes('\n')) {
    return (
      <span className="whitespace-pre-line">
        {parts}
      </span>
    );
  }

  return <>{parts}</>;
}

/**
 * Reusable React Component to render any text with automatic link detection.
 */
export function LinkifiedText({
  text,
  className = "",
  linkClassName,
  showIcon = true,
  preserveNewlines = true
}: {
  text: string | null | undefined;
  className?: string;
  linkClassName?: string;
  showIcon?: boolean;
  preserveNewlines?: boolean;
}) {
  if (text === null || text === undefined) return null;

  return (
    <span className={className}>
      {renderTextWithLinks(text, { linkClassName, showIcon, preserveNewlines })}
    </span>
  );
}

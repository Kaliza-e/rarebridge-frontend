import React from 'react';
import { Span } from '../../utils/rbm/rbm.schema';

interface SpanRendererProps {
  spans?: Span[];
  className?: string;
}

export function SpanRenderer({ spans, className = '' }: SpanRendererProps) {
  if (!spans || spans.length === 0) return null;

  return (
    <span className={`font-body ${className}`}>
      {spans.map((span, index) => {
        let content: React.ReactNode = span.t;

        if (span.u) {
          content = <u key="u">{content}</u>;
        }
        if (span.i) {
          content = <em key="i">{content}</em>;
        }
        if (span.b) {
          content = <strong key="b" className="font-bold font-body text-[#112250]">{content}</strong>;
        }
        if (span.href) {
          content = (
            <a
              key="a"
              href={span.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3B507D] underline decoration-[#3B507D]/40 underline-offset-2 hover:text-[#112250] hover:decoration-[#112250] transition-colors font-medium break-words inline-flex items-center gap-1"
            >
              <span>{content}</span>
            </a>
          );
        }

        return <React.Fragment key={index}>{content}</React.Fragment>;
      })}
    </span>
  );
}

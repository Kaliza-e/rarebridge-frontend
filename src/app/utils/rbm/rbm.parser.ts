import { Block, Span, GroupBlock, RecordBlock, ListBlock, LabeledBlock, ParagraphBlock, ListItem, LabeledField } from './rbm.schema';
import { RBM_HEADER } from './rbm.serializer';

export function isRbmCell(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  return text.trimStart().startsWith('<!--rbm:');
}

/**
 * Parses inline formatting: [text](href), <u>text</u>, **bold**, *italic*.
 */
export function parseSpans(input: string): Span[] {
  if (!input) return [];

  const spans: Span[] = [];
  let index = 0;
  const len = input.length;

  function addSpan(t: string, b?: boolean, i?: boolean, u?: boolean, href?: string) {
    if (!t) return;
    const cleanT = t.replace(/\\\[/g, '[').replace(/\\\]/g, ']');
    const last = spans[spans.length - 1];
    if (
      last &&
      Boolean(last.b) === Boolean(b) &&
      Boolean(last.i) === Boolean(i) &&
      Boolean(last.u) === Boolean(u) &&
      last.href === href
    ) {
      last.t += cleanT;
    } else {
      const s: Span = { t: cleanT };
      if (b) s.b = true;
      if (i) s.i = true;
      if (u) s.u = true;
      if (href) s.href = href;
      spans.push(s);
    }
  }

  // Regex token pattern for inline markdown: links (with balanced parens in URL), underline, bold-italic, bold, italic
  const tokenRegex = /(\[([\s\S]*?)\]\(((?:https?:\/\/|\/)[^\s\)]*(?:\([^\s\)]*\)[^\s\)]*)*|[^\s\)]+)\))|(<u>([\s\S]*?)<\/u>)|(\*\*\*([\s\S]*?)\*\*\*)|(\*\*([\s\S]*?)\*\*)|(\*([\s\S]*?)\*)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(input)) !== null) {
    const matchStart = match.index;
    if (matchStart > lastIndex) {
      addSpan(input.substring(lastIndex, matchStart));
    }

    if (match[1]) {
      // Link: [inner](url)
      const linkText = match[2];
      const linkHref = match[3];
      // Recursively parse inside link text
      const innerSpans = parseSpans(linkText);
      for (const sp of innerSpans) {
        addSpan(sp.t, sp.b, sp.i, sp.u, linkHref);
      }
    } else if (match[4]) {
      // Underline: <u>inner</u>
      const innerText = match[5];
      const innerSpans = parseSpans(innerText);
      for (const sp of innerSpans) {
        addSpan(sp.t, sp.b, sp.i, true, sp.href);
      }
    } else if (match[6]) {
      // Bold + Italic: ***inner***
      const innerText = match[7];
      const innerSpans = parseSpans(innerText);
      for (const sp of innerSpans) {
        addSpan(sp.t, true, true, sp.u, sp.href);
      }
    } else if (match[8]) {
      // Bold: **inner**
      const innerText = match[9];
      const innerSpans = parseSpans(innerText);
      for (const sp of innerSpans) {
        addSpan(sp.t, true, sp.i, sp.u, sp.href);
      }
    } else if (match[10]) {
      // Italic: *inner*
      const innerText = match[11];
      const innerSpans = parseSpans(innerText);
      for (const sp of innerSpans) {
        addSpan(sp.t, sp.b, true, sp.u, sp.href);
      }
    }

    lastIndex = matchStart + match[0].length;
  }

  if (lastIndex < len) {
    addSpan(input.substring(lastIndex));
  }

  return spans;
}

function unescapeLine(line: string): string {
  if (line.startsWith('\\')) {
    const after = line.substring(1);
    if (/^(\#{1,6}\s|\-\s|@@|\*\*|\\[#\-@*])/.test(after)) {
      return after;
    }
  }
  return line;
}

export function parseRbm(content: string): Block[] {
  if (!content || typeof content !== 'string') return [];

  let text = content.trim();
  // Strip header <!--rbm:1--> or <!--rbm:cont n/N-->
  if (text.startsWith('<!--rbm:')) {
    text = text.replace(/^<!--rbm:[^>]+-->\r?\n?/, '').trim();
  }

  if (!text) return [];

  const rawLines = text.split(/\r?\n/);
  const blocks: Block[] = [];

  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Group: ## Title
    const groupMatch = trimmed.match(/^##\s+(.*)$/);
    if (groupMatch) {
      const title = groupMatch[1].trim();
      i++;
      // Collect all lines until the next group ##
      const groupLines: string[] = [];
      while (i < rawLines.length && !rawLines[i].trim().match(/^##\s+/)) {
        groupLines.push(rawLines[i]);
        i++;
      }
      const innerBlocks = parseRbm(groupLines.join('\n'));
      blocks.push({
        type: 'group',
        title,
        blocks: innerBlocks,
      });
      continue;
    }

    // 2. Record: @@specialist or @@org ... @@end
    const recordMatch = trimmed.match(/^@@(specialist|org)$/);
    if (recordMatch) {
      const kind = recordMatch[1] as 'specialist' | 'org';
      i++;
      const fields: LabeledField[] = [];
      while (i < rawLines.length && rawLines[i].trim() !== '@@end') {
        const fLine = rawLines[i].trim();
        if (fLine) {
          const fieldMatch = fLine.match(/^\*\*([^:]+):\*\*\s*(.*)$/);
          if (fieldMatch) {
            fields.push({
              label: fieldMatch[1].trim(),
              body: parseSpans(fieldMatch[2].trim()),
            });
          }
        }
        i++;
      }
      if (i < rawLines.length && rawLines[i].trim() === '@@end') {
        i++; // skip @@end
      }
      blocks.push({
        type: 'record',
        kind,
        fields,
      });
      continue;
    }

    // 3. Labeled item OR Labeled item followed by bullets
    const labeledMatch = line.match(/^\*\*([^:]+):\*\*(.*)$/);
    if (labeledMatch) {
      const label = labeledMatch[1].trim();
      const bodyRest = labeledMatch[2].trim();

      // Look ahead: is the next non-empty line a bullet line?
      let nextLineIndex = i + 1;
      while (nextLineIndex < rawLines.length && !rawLines[nextLineIndex].trim()) {
        nextLineIndex++;
      }

      const nextIsBullet =
        nextLineIndex < rawLines.length &&
        /^\s*-\s+/.test(rawLines[nextLineIndex]);

      if (nextIsBullet && !bodyRest) {
        // This is a List with a label
        i = nextLineIndex;
        const items: ListItem[] = [];
        while (i < rawLines.length) {
          const bLine = rawLines[i];
          const bMatch = bLine.match(/^(\s*)-\s+(.*)$/);
          if (bMatch) {
            const indentSpaces = bMatch[1].length;
            const level = Math.floor(indentSpaces / 2);
            items.push({
              spans: parseSpans(bMatch[2].trim()),
              level,
            });
            i++;
          } else {
            break;
          }
        }
        blocks.push({
          type: 'list',
          label,
          items,
        });
        continue;
      } else {
        // Standard labeled block
        blocks.push({
          type: 'labeled',
          label,
          body: parseSpans(bodyRest),
        });
        i++;
        continue;
      }
    }

    // 4. Standalone bullet list
    const bulletMatch = line.match(/^(\s*)-\s+(.*)$/);
    if (bulletMatch) {
      const items: ListItem[] = [];
      while (i < rawLines.length) {
        const bLine = rawLines[i];
        const bMatch = bLine.match(/^(\s*)-\s+(.*)$/);
        if (bMatch) {
          const indentSpaces = bMatch[1].length;
          const level = Math.floor(indentSpaces / 2);
          items.push({
            spans: parseSpans(bMatch[2].trim()),
            level,
          });
          i++;
        } else {
          break;
        }
      }
      blocks.push({
        type: 'list',
        items,
      });
      continue;
    }

    // 5. Paragraph
    const paraLines: string[] = [];
    while (i < rawLines.length) {
      const curLine = rawLines[i];
      const curTrimmed = curLine.trim();
      if (!curTrimmed) break;
      // Stop if next line is a special construct start
      if (
        curTrimmed.startsWith('## ') ||
        curTrimmed.startsWith('@@') ||
        /^\*\*([^:]+):\*\*/.test(curTrimmed) ||
        /^\s*-\s+/.test(curLine)
      ) {
        break;
      }
      paraLines.push(unescapeLine(curLine));
      i++;
    }

    if (paraLines.length > 0) {
      const fullPara = paraLines.join('\n');
      blocks.push({
        type: 'paragraph',
        spans: parseSpans(fullPara),
      });
    }
  }

  return blocks;
}

import { jsPDF } from "jspdf";
import { isRbmCell, parseRbm, blocksToPlainText } from "./rbm";

export interface PDFDiseaseData {
  id?: string;
  name: string;
  category?: string;
  categoryBadges?: string[];
  diseaseNumber?: string;
  orphaCode?: string;
  inheritancePattern?: string;
  researchStatus?: string;
  shortDesc?: string;

  overview?: any;
  overviewRaw?: any;
  overviewNodes?: any[];

  causes?: any;
  causesRaw?: any;
  causesStructured?: Array<{
    title: string;
    explanation: string;
    details?: string[];
    references?: string[];
  }>;

  symptoms?: any[];
  typesAndSymptoms?: any[];
  typesAndSymptomsRaw?: any;
  typesStructured?: Array<{
    title: string;
    description?: string;
    stage?: string;
    severity?: string;
    characteristics?: string[];
    symptoms?: string[];
  }>;
  types?: any[];
  symptomsStructured?: Array<{
    name: string;
    description?: string;
    severity?: string;
    category?: string;
    ageNotes?: string;
    notes?: string;
  }>;
  typesAndSymptomsSections?: any[];

  diagnosis?: any[];
  diagnosisRaw?: any;
  diagnosticSteps?: any[];
  diagnosisSections?: any[];

  treatmentSections?: any[];
  treatmentsAndPharma?: any;
  treatmentsAndPharmaRaw?: any;
  clinicalTrials?: any[];
  clinicalTrialSections?: any[];
  researchOrganizations?: any[];
  research?: any[];

  lifestyle?: any;
  lifestyleAndDailySupport?: any;
  lifestyleAndDailySupportRaw?: any;
  lifestyleSections?: any[];

  specialists?: Array<{
    name: string;
    profession?: string;
    specialization?: string;
    role?: string;
    organization?: string;
    org?: string;
    location?: string;
    contact?: string;
    publications?: string | number;
    focus?: string;
    why?: string;
    links?: Array<{ url: string; label?: string }>;
    sources?: any[];
    additionalContent?: any[];
  }>;
  specialistsRaw?: any;

  faqs?: Array<{ question?: string; q?: string; answer?: string; a?: string }>;
  faqsRaw?: any;

  factsMyths?: Array<{
    statement?: string;
    myth?: string;
    isFact?: boolean;
    explanation?: string;
    fact?: string;
    order?: number;
  }>;
  myths?: any[];
  factsMythsRaw?: any;

  sources?: Array<{ title: string; url?: string | null; type?: string; description?: string | null }>;
  links?: any[];
  sourcesRaw?: any;

  uncategorizedContent?: string[];
  uncategorized?: any;
  rbmBlocks?: any;
}

/** Helper function to clean text from RBM markup, rich text runs, markdown, and HTML tags */
export function cleanPdfText(input: any, preserveBoundaryWhitespace = false): string {
  if (input === null || input === undefined) return "";

  // If already an array of rich text runs or objects
  if (Array.isArray(input)) {
    const isRunArray = input.every(
      (item) => typeof item === "string" || (typeof item === "object" && item !== null && ("text" in item || "t" in item))
    );

    const parts = input
      .map((item) => {
        if (typeof item === "string") return cleanPdfText(item, isRunArray);
        if (typeof item === "object" && item !== null) {
          const val = item.text ?? item.t ?? item.name ?? item.title ?? item.explanation ?? item.raw ?? "";
          return cleanPdfText(val, isRunArray);
        }
        return String(item);
      })
      .filter((p) => p.length > 0);

    const joined = parts.join(isRunArray ? "" : "\n");
    return preserveBoundaryWhitespace ? joined : joined.trim();
  }

  // If object with specific known fields
  if (typeof input === "object") {
    if (input.simple || input.medical) {
      return [
        input.simple ? cleanPdfText(input.simple) : "",
        input.medical ? `Clinical Detail: ${cleanPdfText(input.medical)}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");
    }
    if (input.genetic || input.environmental || input.unknown) {
      return [
        input.genetic ? `Genetic Causes: ${cleanPdfText(input.genetic)}` : "",
        input.environmental ? `Environmental Triggers: ${cleanPdfText(input.environmental)}` : "",
        input.unknown ? `Other / Idiopathic Factors: ${cleanPdfText(input.unknown)}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    }
    if (input.text) return cleanPdfText(input.text, preserveBoundaryWhitespace);
    if (input.t) return cleanPdfText(input.t, preserveBoundaryWhitespace);
    if (input.raw) return cleanPdfText(input.raw, preserveBoundaryWhitespace);
    return JSON.stringify(input, null, 2).replace(/[\{\}\[\]"]/g, "");
  }

  let str = String(input);
  if (!preserveBoundaryWhitespace) {
    str = str.trim();
  }
  if (!str) return "";

  // If text is RBM encoded cell, parse blocks and extract clean plain text
  if (isRbmCell(str)) {
    try {
      const blocks = parseRbm(str);
      const plain = blocksToPlainText(blocks);
      if (plain) str = plain;
    } catch {
      str = str.replace(/^<!--rbm:[^>]*-->\s*/gi, "");
    }
  }

  // Strip RBM comments
  str = str.replace(/<!--rbm:[^>]*-->/gi, "");

  // Convert markdown links [Label](url) -> Label (url)
  str = str.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");

  // Strip HTML linebreaks and tags
  str = str.replace(/<br\s*\/?>/gi, "\n");
  str = str.replace(/<[^>]+>/g, "");

  // Strip markdown headers
  str = str.replace(/^#{1,6}\s+/gm, "");

  // Strip bold/italic/strikethrough markers
  str = str.replace(/[*_#`~]/g, "");

  // Clean bullet indicators from start of line
  str = str.replace(/^[•●▪▸►\-–—]\s*/gm, "");

  return preserveBoundaryWhitespace ? str : str.trim();
}

/** Helper function to draw a cute vector Zebra Head Doodle in jsPDF */
function drawZebraHeadDoodle(
  doc: jsPDF,
  cx: number,
  cy: number,
  scale: number,
  strokeColor: [number, number, number] = [175, 178, 205],
  fillColor: [number, number, number] = [245, 244, 240]
) {
  doc.setDrawColor(strokeColor[0], strokeColor[1], strokeColor[2]);
  doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
  doc.setLineWidth(0.35 * scale);

  // Ears
  doc.ellipse(cx - 4.5 * scale, cy - 8 * scale, 2.2 * scale, 4.5 * scale, "FD");
  doc.ellipse(cx + 4.5 * scale, cy - 8 * scale, 2.2 * scale, 4.5 * scale, "FD");

  // Head contour
  doc.ellipse(cx, cy, 7 * scale, 9 * scale, "FD");

  // Forehead Zebra Stripes
  doc.line(cx - 4 * scale, cy - 4 * scale, cx + 4 * scale, cy - 4 * scale);
  doc.line(cx - 5 * scale, cy - 1 * scale, cx + 5 * scale, cy - 1 * scale);
  doc.line(cx - 3 * scale, cy + 2 * scale, cx + 3 * scale, cy + 2 * scale);

  // Eyes
  doc.setFillColor(strokeColor[0], strokeColor[1], strokeColor[2]);
  doc.circle(cx - 2.5 * scale, cy - 1 * scale, 0.8 * scale, "F");
  doc.circle(cx + 2.5 * scale, cy - 1 * scale, 0.8 * scale, "F");

  // Muzzle
  doc.ellipse(cx, cy + 5 * scale, 3.5 * scale, 2 * scale, "D");
}

/** Helper function to draw a 4-point vector sparkle star in jsPDF */
function drawSparkle(
  doc: jsPDF,
  cx: number,
  cy: number,
  size: number,
  color: [number, number, number] = [245, 158, 11]
) {
  doc.setFillColor(color[0], color[1], color[2]);
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(0.3);
  doc.line(cx - size, cy, cx + size, cy);
  doc.line(cx, cy - size, cx, cy + size);
  doc.circle(cx, cy, size * 0.35, "F");
}

/** Helper function to draw square background grid & zebra doodles across every PDF page */
function drawBackgroundZebraDoodles(doc: jsPDF, pageWidth: number, pageHeight: number) {
  // 1. Warm Square Grid Lines
  doc.setDrawColor(238, 235, 227);
  doc.setLineWidth(0.12);

  const cellSize = 35;
  for (let x = 0; x <= pageWidth; x += cellSize) {
    doc.line(x, 0, x, pageHeight);
  }
  for (let y = 0; y <= pageHeight; y += cellSize) {
    doc.line(0, y, pageWidth, y);
  }

  // 2. Intersection Crosshairs (+)
  doc.setDrawColor(200, 198, 215);
  doc.setLineWidth(0.2);
  for (let x = cellSize; x < pageWidth; x += cellSize) {
    for (let y = cellSize; y < pageHeight; y += cellSize) {
      doc.line(x - 1.2, y, x + 1.2, y);
      doc.line(x, y - 1.2, x, y + 1.2);
    }
  }

  // 3. Zebra Head Vector Doodles in Margins
  drawZebraHeadDoodle(doc, 192, 16, 0.55, [185, 188, 210]);
  drawZebraHeadDoodle(doc, 12, 145, 0.5, [185, 188, 210]);
  drawZebraHeadDoodle(doc, 194, 265, 0.55, [185, 188, 210]);

  // 4. Sparkles
  drawSparkle(doc, 165, 24, 2, [245, 158, 11]);
  drawSparkle(doc, 25, 85, 1.8, [139, 92, 246]);
  drawSparkle(doc, 190, 175, 2, [245, 158, 11]);
}

export function generateDiseasePDF(disease: PDFDiseaseData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primaryColor: [number, number, number] = [17, 34, 80]; // #112250
  const accentColor: [number, number, number] = [59, 80, 125]; // #3B507D
  const lightBg: [number, number, number] = [245, 244, 240]; // #F5F4F0
  const cardBg: [number, number, number] = [250, 249, 246];
  const borderCol: [number, number, number] = [231, 226, 206]; // #E7E2CE
  const textDark: [number, number, number] = [17, 34, 80];
  const mutedText: [number, number, number] = [95, 110, 135];
  const highlightNavy: [number, number, number] = [224, 235, 251]; // #E0EBFB

  // Draw Zebra Grid Doodles on Page 1
  drawBackgroundZebraDoodles(doc, pageWidth, pageHeight);

  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > pageHeight - margin - 14) {
      addFooter();
      doc.addPage();
      drawBackgroundZebraDoodles(doc, pageWidth, pageHeight);
      y = margin + 10;
      addPageHeader();
    }
  }

  function addPageHeader() {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(margin, y - 5, contentWidth, 0.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    const diseaseTitle = (disease.name || "RARE DISEASE").toUpperCase();
    doc.text(`RAREBRIDGE COMPREHENSIVE FAMILY GUIDE  •  ${diseaseTitle}`, margin, y - 7);
    y += 4;
  }

  function addFooter() {
    const totalPages = (doc.internal as any).getNumberOfPages();
    const currentPage = (doc.internal as any).getCurrentPageInfo().pageNumber;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(
      "RareBridge Platform  •  Plain-Language Medical Education & Caregiver Support  •  Always consult certified specialists",
      margin,
      pageHeight - 9
    );
    doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - margin - 16, pageHeight - 9);
  }

  function addSectionHeader(title: string) {
    checkPageBreak(18);
    y += 5;
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(margin, y, 3.5, 8, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(title.toUpperCase(), margin + 7, y + 5.5);
    y += 12;
  }

  function addSubSectionHeader(title: string) {
    checkPageBreak(12);
    y += 3;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(title, margin, y);
    doc.setFillColor(borderCol[0], borderCol[1], borderCol[2]);
    doc.rect(margin, y + 1.5, contentWidth, 0.4, "F");
    y += 6;
  }

  function addParagraph(text: string, fontSize = 8.5, isBold = false, indent = 0) {
    if (!text) return;
    const clean = cleanPdfText(text);
    if (!clean) return;

    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);

    const availableWidth = contentWidth - indent;
    const lines = doc.splitTextToSize(clean, availableWidth);
    const lineHeight = fontSize * 0.45 + 1.1;

    for (const line of lines) {
      checkPageBreak(lineHeight + 1);
      doc.text(line, margin + indent, y);
      y += lineHeight;
    }
    y += 1.5;
  }

  function addBullet(title: string, desc?: string, indent = 0) {
    const cleanTitle = cleanPdfText(title);
    const cleanDesc = desc ? cleanPdfText(desc) : "";
    if (!cleanTitle && !cleanDesc) return;

    const lineHeight = 4.2;
    const bulletX = margin + indent + 2;
    const textLeft = margin + indent + 5.5;
    const textWidth = contentWidth - indent - 5.5;

    checkPageBreak(lineHeight + 2);
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.circle(bulletX, y - 1, 0.85, "F");

    if (!cleanDesc) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      const lines = doc.splitTextToSize(cleanTitle, textWidth);
      for (const l of lines) {
        checkPageBreak(lineHeight);
        doc.text(l, textLeft, y);
        y += lineHeight;
      }
      y += 1;
      return;
    }

    const fullText = `${cleanTitle}: ${cleanDesc}`;
    const lines = doc.splitTextToSize(fullText, textWidth);

    for (let i = 0; i < lines.length; i++) {
      checkPageBreak(lineHeight);
      doc.setFontSize(8.5);
      if (i === 0) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        const prefix = `${cleanTitle}: `;
        doc.text(prefix, textLeft, y);
        const prefixW = doc.getTextWidth(prefix);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        const rest = lines[0].startsWith(prefix) ? lines[0].slice(prefix.length) : lines[0];
        if (rest) doc.text(rest, textLeft + prefixW, y);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text(lines[i], textLeft, y);
      }
      y += lineHeight;
    }
    y += 1;
  }

  function addCardBox(title: string, lines: Array<{ label?: string; val: string }>, badge?: string) {
    checkPageBreak(20);
    const startY = y;
    const cardPadding = 3.5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

    checkPageBreak(7);
    y += 3;
    doc.text(title, margin + cardPadding, y);

    if (badge) {
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      const badgeW = doc.getTextWidth(badge) + 4;
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.roundedRect(pageWidth - margin - badgeW - cardPadding, y - 3, badgeW, 4.5, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.text(badge, pageWidth - margin - badgeW - cardPadding + 2, y);
    }
    y += 4;

    for (const item of lines) {
      const cleanVal = cleanPdfText(item.val);
      if (!cleanVal) continue;
      if (item.label) {
        addParagraph(`${item.label}: ${cleanVal}`, 8, false, cardPadding);
      } else {
        addParagraph(cleanVal, 8, false, cardPadding);
      }
    }

    const cardHeight = y - startY + 2;
    doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(margin, startY, contentWidth, cardHeight, 2, 2, "D");
    y += 3;
  }

  // ─── 0. MAIN COVER HEADER BANNER ───
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(margin, y, contentWidth, 38, 4, 4, "F");

  // Draw Zebra Doodle inside the header banner
  drawZebraHeadDoodle(doc, margin + contentWidth - 18, y + 19, 0.95, [231, 226, 206], [35, 55, 105]);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(disease.name || "Rare Condition", margin + 8, y + 13);

  // Meta Badges line
  const metaParts: string[] = [];
  if (disease.category) metaParts.push(`Category: ${disease.category}`);
  if (disease.diseaseNumber) metaParts.push(`Disease No. ${disease.diseaseNumber}`);
  if (disease.orphaCode) metaParts.push(`ORPHA: ${disease.orphaCode}`);
  if (disease.inheritancePattern) metaParts.push(`Inheritance: ${disease.inheritancePattern}`);
  if (disease.researchStatus) metaParts.push(`Status: ${disease.researchStatus}`);

  const metaString = metaParts.length > 0 ? metaParts.join("  •  ") : "Comprehensive Rare Disease Profile";
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(231, 226, 206);
  doc.text(metaString, margin + 8, y + 21);

  doc.setFontSize(7.5);
  doc.setTextColor(190, 183, 167);
  doc.text(
    `Generated by RareBridge Platform on ${new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    margin + 8,
    y + 29
  );

  y += 44;

  // ─── 1. OVERVIEW SECTION ───
  addSectionHeader("1. Condition Overview");

  const rawOverview = disease.overview || disease.overviewRaw;
  if (typeof rawOverview === "object" && rawOverview !== null) {
    if (rawOverview.simple) {
      addParagraph("Plain-Language Summary for Families:", 8.5, true);
      addParagraph(rawOverview.simple, 8.5);
    }
    if (rawOverview.medical) {
      addParagraph("Clinical & Pathophysiological Overview:", 8.5, true);
      addParagraph(rawOverview.medical, 8.5);
    }
    if (!rawOverview.simple && !rawOverview.medical) {
      addParagraph(cleanPdfText(rawOverview), 8.5);
    }
  } else {
    const ovText = cleanPdfText(rawOverview) || cleanPdfText(disease.shortDesc) || "Comprehensive medical documentation.";
    addParagraph(ovText, 8.5);
  }

  // ─── 2. CAUSES & GENETIC RISK FACTORS ───
  addSectionHeader("2. Causes, Genetics & Inheritance Factors");

  if (disease.inheritancePattern) {
    doc.setFillColor(highlightNavy[0], highlightNavy[1], highlightNavy[2]);
    doc.roundedRect(margin, y, contentWidth, 6.5, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`Genetic Inheritance Pattern: ${cleanPdfText(disease.inheritancePattern)}`, margin + 4, y + 4.5);
    y += 9.5;
  }

  if (Array.isArray(disease.causesStructured) && disease.causesStructured.length > 0) {
    for (const cause of disease.causesStructured) {
      addBullet(cause.title, cause.explanation);
      if (Array.isArray(cause.details) && cause.details.length > 0) {
        for (const detail of cause.details) {
          addParagraph(`- ${cleanPdfText(detail)}`, 8, false, 8);
        }
      }
    }
  } else if (disease.causes && typeof disease.causes === "object") {
    if (disease.causes.genetic) addBullet("Genetic Factors", disease.causes.genetic);
    if (disease.causes.environmental) addBullet("Environmental Triggers", disease.causes.environmental);
    if (disease.causes.unknown) addBullet("Idiopathic / Unknown Factors", disease.causes.unknown);
  } else if (disease.causes || disease.causesRaw) {
    addParagraph(cleanPdfText(disease.causes || disease.causesRaw), 8.5);
  } else {
    addParagraph("Etiological and genetic research details currently being updated.", 8.5);
  }

  // ─── 3. SUBTYPES & CLINICAL FORMS ───
  const typesData =
    (Array.isArray(disease.typesStructured) && disease.typesStructured.length > 0
      ? disease.typesStructured
      : Array.isArray(disease.types) && disease.types.length > 0
      ? disease.types
      : null);

  if (typesData && typesData.length > 0) {
    addSectionHeader("3. Documented Subtypes & Clinical Forms");
    for (const t of typesData) {
      const typeTitle = t.title || t.type || t.name || "Subtype Form";
      const badge = t.stage ? `Stage: ${t.stage}` : t.severity ? `Severity: ${t.severity}` : undefined;
      const detailsList: Array<{ label?: string; val: string }> = [];

      if (t.description) detailsList.push({ label: "Description", val: t.description });
      if (Array.isArray(t.symptoms) && t.symptoms.length > 0) {
        detailsList.push({ label: "Key Symptoms", val: t.symptoms.join(", ") });
      } else if (typeof t.symptoms === "string" && t.symptoms) {
        detailsList.push({ label: "Key Symptoms", val: t.symptoms });
      }
      if (Array.isArray(t.characteristics) && t.characteristics.length > 0) {
        detailsList.push({ label: "Characteristics", val: t.characteristics.join("; ") });
      }

      addCardBox(typeTitle, detailsList, badge);
    }
  }

  // ─── 4. SYMPTOMS & CLINICAL PRESENTATION ───
  addSectionHeader("4. Symptoms & Clinical Characteristics");

  const symptomsData =
    (Array.isArray(disease.symptomsStructured) && disease.symptomsStructured.length > 0
      ? disease.symptomsStructured
      : Array.isArray(disease.symptoms) && disease.symptoms.length > 0
      ? disease.symptoms
      : Array.isArray(disease.typesAndSymptoms) && disease.typesAndSymptoms.length > 0
      ? disease.typesAndSymptoms
      : []);

  if (symptomsData.length > 0) {
    for (const s of symptomsData) {
      if (typeof s === "string") {
        addBullet(cleanPdfText(s));
      } else if (typeof s === "object" && s !== null) {
        const symName = cleanPdfText(s.name || s.title || s.symptom || "Symptom");
        const severityTag = s.severity ? `[${s.severity.toUpperCase()}] ` : "";
        const desc = [severityTag + (s.description || ""), s.category ? `Category: ${s.category}` : ""]
          .filter(Boolean)
          .join(" | ");
        addBullet(symName, desc);
      }
    }
  } else if (disease.typesAndSymptomsRaw) {
    addParagraph(cleanPdfText(disease.typesAndSymptomsRaw), 8.5);
  } else {
    addParagraph("Specific clinical symptom manifestations currently being compiled.", 8.5);
  }

  // ─── 5. DIAGNOSIS & TESTING PROCEDURES ───
  addSectionHeader("5. Diagnostic Procedures & Testing Methods");

  const diagData =
    (Array.isArray(disease.diagnosis) && disease.diagnosis.length > 0
      ? disease.diagnosis
      : Array.isArray(disease.diagnosticSteps) && disease.diagnosticSteps.length > 0
      ? disease.diagnosticSteps
      : []);

  if (diagData.length > 0) {
    for (const step of diagData) {
      if (typeof step === "string") {
        addBullet(cleanPdfText(step));
      } else if (typeof step === "object" && step !== null) {
        const stepName = cleanPdfText(step.name || step.title || "Diagnostic Method");
        const stepLines: Array<{ label?: string; val: string }> = [];
        if (step.what) stepLines.push({ label: "What it is", val: step.what });
        if (step.how) stepLines.push({ label: "How it works", val: step.how });
        if (step.result) stepLines.push({ label: "Result meaning", val: step.result });
        if (!stepLines.length && step.description) stepLines.push({ val: step.description });

        addCardBox(stepName, stepLines);
      }
    }
  } else if (Array.isArray(disease.diagnosisSections) && disease.diagnosisSections.length > 0) {
    for (const sec of disease.diagnosisSections) {
      addSubSectionHeader(sec.title || "Diagnostic Procedure");
      addParagraph(cleanPdfText(sec.raw || sec.content), 8.5);
    }
  } else if (disease.diagnosisRaw) {
    addParagraph(cleanPdfText(disease.diagnosisRaw), 8.5);
  } else {
    addParagraph("Comprehensive diagnostic criteria and laboratory test procedures under clinical review.", 8.5);
  }

  // ─── 6. TREATMENTS & MEDICAL MANAGEMENT ───
  const hasTreatments =
    (Array.isArray(disease.treatmentSections) && disease.treatmentSections.length > 0) ||
    Boolean(disease.treatmentsAndPharma) ||
    Boolean(disease.treatmentsAndPharmaRaw);

  if (hasTreatments) {
    addSectionHeader("6. Approved Treatments & Clinical Management");
    if (Array.isArray(disease.treatmentSections) && disease.treatmentSections.length > 0) {
      for (const tSec of disease.treatmentSections) {
        addSubSectionHeader(tSec.title || "Treatment Option");
        addParagraph(cleanPdfText(tSec.raw || tSec.content), 8.5);
      }
    } else if (disease.treatmentsAndPharma) {
      addParagraph(cleanPdfText(disease.treatmentsAndPharma), 8.5);
    }
  }

  // ─── 7. CLINICAL TRIALS & RESEARCH DIRECTORY ───
  const trialsList =
    (Array.isArray(disease.clinicalTrials) && disease.clinicalTrials.length > 0
      ? disease.clinicalTrials
      : Array.isArray(disease.clinicalTrialSections) && disease.clinicalTrialSections.length > 0
      ? disease.clinicalTrialSections
      : []);

  const researchOrgs =
    (Array.isArray(disease.researchOrganizations) && disease.researchOrganizations.length > 0
      ? disease.researchOrganizations
      : Array.isArray(disease.research) && disease.research.length > 0
      ? disease.research
      : []);

  if (trialsList.length > 0 || researchOrgs.length > 0) {
    addSectionHeader("7. Active Clinical Trials & Research Directory");

    if (trialsList.length > 0) {
      addSubSectionHeader("Active Clinical Trials & Pharmaceutical Studies");
      for (const trial of trialsList) {
        const trialTitle = cleanPdfText(trial.name || trial.title || "Clinical Trial");
        const trialLines: Array<{ label?: string; val: string }> = [];
        if (trial.drugName) trialLines.push({ label: "Investigational Drug", val: trial.drugName });
        if (trial.stage) trialLines.push({ label: "Phase / Stage", val: trial.stage });
        if (trial.status) trialLines.push({ label: "Study Status", val: trial.status });
        if (trial.eligibility) trialLines.push({ label: "Eligibility", val: trial.eligibility });
        if (trial.location) trialLines.push({ label: "Location", val: trial.location });
        if (trial.focus || trial.description) trialLines.push({ label: "Focus", val: trial.focus || trial.description });
        if (trial.url) trialLines.push({ label: "Trial Registry URL", val: trial.url });

        addCardBox(trialTitle, trialLines, trial.stage || trial.status);
      }
    }

    if (researchOrgs.length > 0) {
      addSubSectionHeader("Dedicated Research Institutions & Foundations");
      for (const org of researchOrgs) {
        const orgName = cleanPdfText(org.name || "Research Institution");
        const focusText = cleanPdfText(org.focus || org.why || "Translational rare disease research");
        const urlText = org.url ? ` (Visit: ${org.url})` : "";
        addBullet(orgName, `${focusText}${urlText}`);
      }
    }
  }

  // ─── 8. LIFESTYLE, DAILY CARE & PRACTICAL SUPPORT ───
  const rawLifestyle = disease.lifestyle || disease.lifestyleAndDailySupport || disease.lifestyleAndDailySupportRaw;

  if (rawLifestyle) {
    addSectionHeader("8. Lifestyle, Daily Care & Practical Support");

    // Therapies
    const therapies = rawLifestyle.therapies;
    if (Array.isArray(therapies) && therapies.length > 0) {
      addSubSectionHeader("1. Recommended Rehabilitation & Supportive Therapies");
      for (const th of therapies) {
        if (typeof th === "string") {
          addBullet(cleanPdfText(th));
        } else if (th && typeof th === "object") {
          addBullet(cleanPdfText(th.name || "Therapy"), cleanPdfText(th.desc || th.description));
        }
      }
    }

    // Nutrition
    if (rawLifestyle.nutrition) {
      addSubSectionHeader("2. Nutritional Guidance & Dietary Support");
      addParagraph(cleanPdfText(rawLifestyle.nutrition), 8.5);
    }

    // Assistive Devices
    const devices = rawLifestyle.devices;
    if (Array.isArray(devices) && devices.length > 0) {
      addSubSectionHeader("3. Assistive Devices & Specialized Medical Equipment");
      for (const dev of devices) {
        addBullet(cleanPdfText(dev));
      }
    }

    // Caregiver Tips
    const caregiverTips = rawLifestyle.caregiverTips;
    if (Array.isArray(caregiverTips) && caregiverTips.length > 0) {
      addSubSectionHeader("4. Daily Care Advice & Practical Caregiver Guidance");
      for (const tip of caregiverTips) {
        addBullet(cleanPdfText(tip));
      }
    }

    // Community & Support Groups
    const communityResources =
      (Array.isArray(rawLifestyle.communities) && rawLifestyle.communities.length > 0
        ? rawLifestyle.communities
        : null);

    if (communityResources && communityResources.length > 0) {
      addSubSectionHeader("5. Patient Support Networks & Community Organizations");
      for (const comm of communityResources) {
        const cName = cleanPdfText(comm.name || "Patient Organization");
        const cDesc = cleanPdfText(comm.description || comm.category || "");
        const links = Array.isArray(comm.links) && comm.links.length > 0
          ? comm.links.map((l: any) => l.url || l).join(", ")
          : comm.url || "";
        addBullet(cName, [cDesc, links ? `Link: ${links}` : ""].filter(Boolean).join(" | "));
      }
    } else if (rawLifestyle.community) {
      addSubSectionHeader("5. Community Resources & Family Networks");
      addParagraph(cleanPdfText(rawLifestyle.community), 8.5);
    }
  }

  // ─── 9. SPECIALIST DIRECTORY ───
  const rawSpecialists = disease.specialists || disease.specialistsRaw || [];

  if (Array.isArray(rawSpecialists) && rawSpecialists.length > 0) {
    addSectionHeader("9. Specialist Directory & Expert Clinical Centers");
    for (const spec of rawSpecialists) {
      const specName = cleanPdfText(spec.name || "Certified Specialist");
      const specLines: Array<{ label?: string; val: string }> = [];

      if (spec.profession) specLines.push({ label: "Profession / Role", val: spec.profession });
      if (spec.specialization) specLines.push({ label: "Specialty / Expertise", val: spec.specialization });
      if (spec.organization || spec.org) specLines.push({ label: "Institution", val: spec.organization || spec.org });
      if (spec.location) specLines.push({ label: "Location", val: spec.location });
      if (spec.contact) specLines.push({ label: "Contact Info", val: spec.contact });
      if (spec.publications && spec.publications !== "0") {
        specLines.push({ label: "Research / Publications", val: String(spec.publications) });
      }

      addCardBox(specName, specLines, spec.profession || "Specialist");
    }
  }

  // ─── 10. FREQUENTLY ASKED QUESTIONS (FAQS) ───
  const rawFaqs = disease.faqs || disease.faqsRaw || [];

  if (Array.isArray(rawFaqs) && rawFaqs.length > 0) {
    addSectionHeader("10. Frequently Asked Questions (FAQs)");
    for (let idx = 0; idx < rawFaqs.length; idx++) {
      const faq = rawFaqs[idx];
      const q = cleanPdfText(faq.question || faq.q || `Question #${idx + 1}`);
      const a = cleanPdfText(faq.answer || faq.a || "Consult certified specialists for clinical clarification.");
      if (q && a) {
        addParagraph(`Q${idx + 1}: ${q}`, 8.5, true);
        addParagraph(`A: ${a}`, 8.5, false, 4);
      }
    }
  }

  // ─── 11. FACTS VS. MYTHS ───
  const rawMyths = disease.factsMyths || disease.myths || disease.factsMythsRaw || [];

  if (Array.isArray(rawMyths) && rawMyths.length > 0) {
    addSectionHeader("11. Evidence-Based Facts vs. Common Misconceptions");
    for (let idx = 0; idx < rawMyths.length; idx++) {
      const item = rawMyths[idx];
      const mythText = cleanPdfText(item.myth || item.statement || `Misconception #${idx + 1}`);
      const factText = cleanPdfText(item.fact || item.explanation || "Clinical consensus.");

      addParagraph(`Myth: "${mythText}"`, 8.5, true);
      addParagraph(`Fact: ${factText}`, 8.5, false, 4);
      y += 1;
    }
  }

  // ─── 12. SOURCES & EXTERNAL CITATIONS ───
  const rawSources = disease.sources || disease.links || disease.sourcesRaw || [];

  if (Array.isArray(rawSources) && rawSources.length > 0) {
    addSectionHeader("12. References, Registry Citations & Sources");
    for (const src of rawSources) {
      if (typeof src === "string") {
        addBullet(cleanPdfText(src));
      } else if (typeof src === "object" && src !== null) {
        const title = cleanPdfText(src.title || src.name || "Registry Reference");
        const details = [src.type ? `[${src.type}]` : "", src.url || "", src.description || ""]
          .filter(Boolean)
          .join(" ");
        addBullet(title, details);
      }
    }
  }

  // ─── 13. ADDITIONAL PRESERVED INFORMATION (ANTI-DATA-LOSS) ───
  const uncategorized = disease.uncategorizedContent || disease.uncategorized || [];
  if (Array.isArray(uncategorized) && uncategorized.length > 0) {
    addSectionHeader("13. Additional Preserved Information");
    for (const item of uncategorized) {
      addParagraph(cleanPdfText(item), 8);
    }
  }

  // ─── 14. MEDICAL DISCLAIMER BOX ───
  checkPageBreak(25);
  y += 5;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin, y, contentWidth, 22, 2.5, 2.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("IMPORTANT MEDICAL DISCLAIMER", margin + 4, y + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  const disclaimer =
    "This document is compiled for informational and educational purposes by RareBridge. It does not constitute formal medical diagnosis, clinical treatment prescription, or professional clinical consultation. Always seek direct consultation with board-certified medical specialists regarding personal diagnostic and treatment decisions.";
  const discLines = doc.splitTextToSize(disclaimer, contentWidth - 8);
  doc.text(discLines, margin + 4, y + 11);

  // ─── FOOTER NUMBERING ACROSS ALL PAGES ───
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter();
  }

  // Save the PDF with sanitized filename
  const sanitizedName = (disease.name || "Rare-Disease").replace(/[^a-zA-Z0-9]/g, "-");
  doc.save(`RareBridge-${sanitizedName}-Guide.pdf`);
}

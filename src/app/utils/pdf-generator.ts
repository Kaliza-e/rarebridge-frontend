import { jsPDF } from "jspdf";

export interface PDFDiseaseData {
  name: string;
  category?: string;
  categoryBadges?: string[];
  diseaseNumber?: string;
  orphaCode?: string;
  inheritancePattern?: string;
  overview?: string | { simple?: string; medical?: string };
  overviewRaw?: any;
  causes?: string | { genetic?: string; environmental?: string; unknown?: string };
  causesRaw?: any;
  symptoms?: string[];
  typesAndSymptoms?: string[];
  typesAndSymptomsRaw?: any;
  diagnosis?: Array<{ name: string; what?: string; how?: string; result?: string }>;
  diagnosisRaw?: any;
  lifestyle?: {
    therapies?: Array<string | { name: string; desc?: string }>;
    nutrition?: string;
    devices?: string[];
    caregiverTips?: string[];
    community?: string;
  };
  lifestyleAndDailySupport?: any;
  lifestyleAndDailySupportRaw?: any;
  research?: Array<{ name: string; focus?: string; why?: string; url?: string }>;
  treatmentsAndPharma?: Array<{ name: string; focus?: string; url?: string | null }>;
  treatmentsAndPharmaRaw?: any;
  specialists?: Array<{ name: string; role?: string; org?: string; organization?: string; location?: string; focus?: string }>;
  specialistsRaw?: any;
  faqs?: Array<{ question?: string; q?: string; answer?: string; a?: string }>;
  faqsRaw?: any;
  factsMyths?: Array<{ statement?: string; myth?: string; isFact?: boolean; explanation?: string; fact?: string }>;
  factsMythsRaw?: any;
  sources?: Array<{ title: string; url?: string | null; type?: string; description?: string | null }>;
  sourcesRaw?: any;
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

/** Helper function to draw a 4-point vector sparkle star (✦) in jsPDF */
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
  // 1. Subtle Warm Square Grid Lines (35mm x 35mm squares)
  doc.setDrawColor(232, 228, 218); // Soft warm beige/lavender
  doc.setLineWidth(0.12);

  const cellSize = 35;
  for (let x = 0; x <= pageWidth; x += cellSize) {
    doc.line(x, 0, x, pageHeight);
  }
  for (let y = 0; y <= pageHeight; y += cellSize) {
    doc.line(0, y, pageWidth, y);
  }

  // 2. Intersection Crosshairs (+)
  doc.setDrawColor(185, 182, 205);
  doc.setLineWidth(0.22);
  for (let x = cellSize; x < pageWidth; x += cellSize) {
    for (let y = cellSize; y < pageHeight; y += cellSize) {
      doc.line(x - 1.2, y, x + 1.2, y);
      doc.line(x, y - 1.2, x, y + 1.2);
    }
  }

  // 3. Zebra Head Vector Doodles in Margins & Corners
  drawZebraHeadDoodle(doc, 185, 18, 0.65, [175, 178, 205]);
  drawZebraHeadDoodle(doc, 15, 140, 0.6, [175, 178, 205]);
  drawZebraHeadDoodle(doc, 186, 260, 0.65, [175, 178, 205]);

  // 4. Zebra Wavy Ribbon Curves
  doc.setDrawColor(175, 178, 205);
  doc.setLineWidth(0.35);
  doc.line(40, 14, 48, 10);
  doc.line(48, 10, 56, 14);

  doc.setDrawColor(245, 158, 11); // Gold
  doc.line(20, 275, 28, 271);
  doc.line(28, 271, 36, 275);

  // 5. Sparkles & Hearts
  drawSparkle(doc, 160, 28, 2.5, [245, 158, 11]);
  drawSparkle(doc, 30, 80, 2.2, [139, 92, 246]);
  drawSparkle(doc, 192, 160, 2.5, [245, 158, 11]);
  drawSparkle(doc, 22, 230, 2.2, [139, 92, 246]);
}

export function generateDiseasePDF(disease: PDFDiseaseData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primaryColor: [number, number, number] = [17, 34, 80]; // #112250
  const accentColor: [number, number, number] = [59, 80, 125]; // #3B507D
  const lightBg: [number, number, number] = [245, 244, 240]; // #F5F4F0
  const textDark: [number, number, number] = [17, 34, 80];
  const mutedText: [number, number, number] = [100, 116, 139];

  // Draw Zebra Grid Doodles on Page 1
  drawBackgroundZebraDoodles(doc, pageWidth, pageHeight);

  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > pageHeight - margin - 15) {
      addFooter();
      doc.addPage();
      drawBackgroundZebraDoodles(doc, pageWidth, pageHeight);
      y = margin + 10;
      addPageHeader();
    }
  }

  function addPageHeader() {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(margin, y - 6, contentWidth, 0.6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(`RAREBRIDGE FAMILY GUIDE  •  ${disease.name.toUpperCase()}`, margin, y - 8);
    y += 4;
  }

  function addFooter() {
    const totalPages = (doc.internal as any).getNumberOfPages();
    const currentPage = (doc.internal as any).getCurrentPageInfo().pageNumber;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(
      "RareBridge Platform  •  Plain-Language Medical Education & Caregiver Support  •  Always consult certified specialists",
      margin,
      pageHeight - 10
    );
    doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 10);
  }

  function addSectionHeader(title: string) {
    checkPageBreak(16);
    y += 4;
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(margin, y, 3.5, 8, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(title.toUpperCase(), margin + 7, y + 5.5);
    y += 12;
  }

  function addParagraph(text: string, fontSize = 9, isBold = false) {
    if (!text) return;
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);

    const lines = doc.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.48;
    checkPageBreak(lines.length * lineHeight + 2);
    doc.text(lines, margin, y);
    y += lines.length * lineHeight + 2.5;
  }

  function addBulletPoint(title: string, desc?: string) {
    checkPageBreak(10);
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.circle(margin + 2.5, y - 1.2, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

    if (desc) {
      const fullText = `${title}: ${desc}`;
      const lines = doc.splitTextToSize(fullText, contentWidth - 7);
      doc.text(lines, margin + 7, y);
      y += lines.length * 4.2 + 1.8;
    } else {
      const lines = doc.splitTextToSize(title, contentWidth - 7);
      doc.text(lines, margin + 7, y);
      y += lines.length * 4.2 + 1.8;
    }
  }

  // ─── Cover / Main Header Banner ───
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(margin, y, contentWidth, 38, 4, 4, "F");

  // Draw Zebra Doodle inside the header banner
  drawZebraHeadDoodle(doc, margin + contentWidth - 18, y + 19, 0.95, [231, 226, 206], [35, 55, 105]);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(255, 255, 255);
  doc.text(disease.name, margin + 8, y + 14);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(231, 226, 206); // champagne
  const categoryText = disease.category || (disease.categoryBadges ? disease.categoryBadges.join(" • ") : "Rare Condition");
  const metaCode = disease.orphaCode ? ` | ORPHA: ${disease.orphaCode}` : "";
  doc.text(`Category: ${categoryText}${metaCode}  •  Family Guide`, margin + 8, y + 22);

  doc.setFontSize(8);
  doc.setTextColor(190, 183, 167);
  doc.text(`Generated by RareBridge Platform on ${new Date().toLocaleDateString()}`, margin + 8, y + 30);

  y += 44;

  // Helper function to stringify complex object fields cleanly
  const stringifyData = (val: any): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      if (val.simple) return val.simple + (val.medical ? `\n\nClinical Detail: ${val.medical}` : "");
      if (val.genetic) return val.genetic + (val.environmental ? `\nEnvironmental factors: ${val.environmental}` : "");
      return JSON.stringify(val, null, 2).replace(/[\{\}\[\]"]/g, "");
    }
    return String(val);
  };

  // ─── 1. Overview Section ───
  addSectionHeader("1. Condition Overview");
  const rawOverview = disease.overview || disease.overviewRaw;
  const overviewText = stringifyData(rawOverview) || "Comprehensive plain-language guide for patients, families, and clinicians.";
  addParagraph(overviewText, 9.5);

  // ─── 2. Causes & Genetics ───
  const rawCauses = disease.causes || disease.causesRaw;
  const causesText = stringifyData(rawCauses);
  if (causesText) {
    addSectionHeader("2. Causes & Inheritance");
    addParagraph(causesText, 9);
  }

  // ─── 3. Symptoms Section ───
  const rawSymptoms = disease.typesAndSymptoms || disease.typesAndSymptomsRaw || disease.symptoms || [];
  if (Array.isArray(rawSymptoms) && rawSymptoms.length > 0) {
    addSectionHeader("3. Types & Symptoms");
    rawSymptoms.forEach((item: any) => {
      if (typeof item === "string") addBulletPoint(item);
      else if (item.name) addBulletPoint(item.name, item.desc || item.symptoms);
      else addBulletPoint(stringifyData(item));
    });
  } else if (typeof rawSymptoms === "string" && rawSymptoms) {
    addSectionHeader("3. Types & Symptoms");
    addParagraph(rawSymptoms, 9);
  }

  // ─── 4. Diagnosis Section ───
  const rawDiagnosis = disease.diagnosis || disease.diagnosisRaw;
  if (Array.isArray(rawDiagnosis) && rawDiagnosis.length > 0) {
    addSectionHeader("4. Diagnosis & Testing Methods");
    rawDiagnosis.forEach((d: any) => {
      if (typeof d === "string") addBulletPoint(d);
      else if (d.name) addBulletPoint(d.name, [d.what, d.how, d.result ? `Result: ${d.result}` : ""].filter(Boolean).join(" "));
      else addBulletPoint(stringifyData(d));
    });
  } else if (typeof rawDiagnosis === "string" && rawDiagnosis) {
    addSectionHeader("4. Diagnosis & Testing Methods");
    addParagraph(rawDiagnosis, 9);
  }

  // ─── 5. Lifestyle & Support ───
  const rawLifestyle = disease.lifestyle || disease.lifestyleAndDailySupport || disease.lifestyleAndDailySupportRaw;
  if (rawLifestyle) {
    addSectionHeader("5. Lifestyle, Daily Care & Support");
    if (typeof rawLifestyle === "string") {
      addParagraph(rawLifestyle, 9);
    } else {
      if (rawLifestyle.therapies && Array.isArray(rawLifestyle.therapies) && rawLifestyle.therapies.length > 0) {
        addParagraph("Recommended Therapies:", 9, true);
        rawLifestyle.therapies.forEach((t: any) => {
          if (typeof t === "string") addBulletPoint(t);
          else if (t.name) addBulletPoint(t.name, t.desc);
        });
      }
      if (rawLifestyle.nutrition) {
        addParagraph("Nutritional Guidance:", 9, true);
        addParagraph(stringifyData(rawLifestyle.nutrition), 9);
      }
      if (rawLifestyle.caregiverTips && Array.isArray(rawLifestyle.caregiverTips)) {
        addParagraph("Caregiver Guidance:", 9, true);
        rawLifestyle.caregiverTips.forEach((tip: string) => addBulletPoint(tip));
      }
    }
  }

  // ─── 6. Research & Pharma Directory ───
  const rawResearch = disease.treatmentsAndPharma || disease.treatmentsAndPharmaRaw || disease.research || [];
  if (Array.isArray(rawResearch) && rawResearch.length > 0) {
    addSectionHeader("6. Research & Active Clinical Studies");
    rawResearch.forEach((org: any) => {
      if (typeof org === "string") addBulletPoint(org);
      else {
        const orgName = org.name || "Research Resource";
        const orgFocus = org.focus || org.why || "";
        const orgUrl = org.url || "";
        addBulletPoint(orgName, `${orgFocus}${orgUrl ? ` (Visit: ${orgUrl})` : ""}`);
      }
    });
  }

  // ─── 7. Specialists ───
  const rawSpecialists = disease.specialists || disease.specialistsRaw || [];
  if (Array.isArray(rawSpecialists) && rawSpecialists.length > 0) {
    addSectionHeader("7. Specialist Directory");
    rawSpecialists.forEach((s: any) => {
      if (typeof s === "string") addBulletPoint(s);
      else {
        const sOrg = s.organization || s.org || "";
        const sLoc = s.location ? ` - ${s.location}` : "";
        const sFocus = s.focus || s.role || "";
        addBulletPoint(s.name, `${sOrg}${sLoc}${sFocus ? ` (${sFocus})` : ""}`);
      }
    });
  }

  // ─── 8. FAQs ───
  const rawFaqs = disease.faqs || disease.faqsRaw || [];
  if (Array.isArray(rawFaqs) && rawFaqs.length > 0) {
    addSectionHeader("8. Frequently Asked Questions");
    rawFaqs.forEach((faq: any) => {
      const q = faq.question || faq.q || "";
      const a = faq.answer || faq.a || "";
      if (q && a) {
        addParagraph(`Q: ${q}`, 9, true);
        addParagraph(`A: ${a}`, 9);
      }
    });
  }

  // ─── 9. Sources & References ───
  const rawSources = disease.sources || disease.sourcesRaw || [];
  if (Array.isArray(rawSources) && rawSources.length > 0) {
    addSectionHeader("9. References & Sources");
    rawSources.forEach((src: any) => {
      if (typeof src === "string") addBulletPoint(src);
      else addBulletPoint(src.title, `${src.type ? `[${src.type}] ` : ""}${src.url ? src.url : ""}`);
    });
  }

  // ─── Medical Disclaimer Box ───
  checkPageBreak(25);
  y += 6;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("MEDICAL DISCLAIMER", margin + 4, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  const disclaimer =
    "This guide is compiled for informational and educational guidance by the RareBridge platform. It does not replace professional medical diagnosis, treatment, or clinical consultation. Always consult certified medical specialists.";
  const discLines = doc.splitTextToSize(disclaimer, contentWidth - 8);
  doc.text(discLines, margin + 4, y + 12);

  // Add footer & page count to all pages
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter();
  }

  // Save the PDF with sanitized filename
  const sanitizedName = disease.name.replace(/[^a-zA-Z0-9]/g, "-");
  doc.save(`RareBridge-${sanitizedName}-Guide.pdf`);
}


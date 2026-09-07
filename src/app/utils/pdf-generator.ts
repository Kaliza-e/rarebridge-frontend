import { jsPDF } from "jspdf";

export interface PDFDiseaseData {
  name: string;
  category?: string;
  categoryBadges?: string[];
  overview?: string | { simple?: string; medical?: string };
  causes?: string | { genetic?: string; environmental?: string; unknown?: string };
  symptoms?: string[];
  typesAndSymptoms?: string[];
  diagnosis?: Array<{ name: string; what?: string; how?: string; result?: string }>;
  lifestyle?: {
    therapies?: Array<string | { name: string; desc?: string }>;
    nutrition?: string;
    devices?: string[];
    caregiverTips?: string[];
    community?: string;
  };
  lifestyleAndDailySupport?: any;
  research?: Array<{ name: string; focus?: string; why?: string; url?: string }>;
  treatmentsAndPharma?: Array<{ name: string; focus?: string; url?: string | null }>;
  specialists?: Array<{ name: string; role?: string; org?: string; organization?: string; location?: string; focus?: string }>;
  faqs?: Array<{ question?: string; q?: string; answer?: string; a?: string }>;
  factsMyths?: Array<{ statement?: string; myth?: string; isFact?: boolean; explanation?: string; fact?: string }>;
  sources?: Array<{ title: string; url?: string | null; type?: string; description?: string | null }>;
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
  const textDark: [number, number, number] = [30, 41, 59];
  const mutedText: [number, number, number] = [100, 116, 139];

  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > pageHeight - margin - 15) {
      addFooter();
      doc.addPage();
      y = margin + 10;
      addPageHeader();
    }
  }

  function addPageHeader() {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(margin, y - 6, contentWidth, 0.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(`RAREBRIDGE DISEASE GUIDE  •  ${disease.name.toUpperCase()}`, margin, y - 8);
    y += 4;
  }

  function addFooter() {
    const totalPages = (doc.internal as any).getNumberOfPages();
    const currentPage = (doc.internal as any).getCurrentPageInfo().pageNumber;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(
      "RareBridge  •  For informational purposes only  •  Always consult a certified medical specialist",
      margin,
      pageHeight - 10
    );
    doc.text(`Page ${currentPage}`, pageWidth - margin - 15, pageHeight - 10);
  }

  function addSectionHeader(title: string) {
    checkPageBreak(16);
    y += 4;
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.roundedRect(margin, y, contentWidth, 7.5, 2, 2, "F");

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(margin, y, 3, 7.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(title.toUpperCase(), margin + 6, y + 5.2);
    y += 11;
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
    doc.circle(margin + 2, y - 1.2, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

    if (desc) {
      const fullText = `${title}: ${desc}`;
      const lines = doc.splitTextToSize(fullText, contentWidth - 6);
      doc.text(lines, margin + 6, y);
      y += lines.length * 4.2 + 1.5;
    } else {
      const lines = doc.splitTextToSize(title, contentWidth - 6);
      doc.text(lines, margin + 6, y);
      y += lines.length * 4.2 + 1.5;
    }
  }

  // ─── Cover / Main Header ───
  // Top Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(255, 255, 255);
  doc.text(disease.name, margin + 8, y + 13);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(231, 226, 206); // champagne
  const categoryText = disease.category || (disease.categoryBadges ? disease.categoryBadges.join(" • ") : "Rare Disease");
  doc.text(`Category: ${categoryText}  |  Medically Reviewed Guide`, margin + 8, y + 21);

  doc.setFontSize(8);
  doc.setTextColor(190, 183, 167);
  doc.text(`Generated by RareBridge Platform on ${new Date().toLocaleDateString()}`, margin + 8, y + 28);

  y += 40;

  // ─── Overview Section ───
  addSectionHeader("1. Disease Overview & Summary");
  let overviewText = "";
  if (typeof disease.overview === "string") {
    overviewText = disease.overview;
  } else if (disease.overview?.simple) {
    overviewText = disease.overview.simple;
    if (disease.overview.medical && disease.overview.medical !== disease.overview.simple) {
      overviewText += "\n\nClinical Detail: " + disease.overview.medical;
    }
  } else {
    overviewText = "Comprehensive information and trusted medical guide for patients, caregivers, and clinicians.";
  }
  addParagraph(overviewText, 9.5);

  // ─── Causes Section ───
  let causesText = "";
  if (typeof disease.causes === "string") {
    causesText = disease.causes;
  } else if (disease.causes?.genetic) {
    causesText = disease.causes.genetic;
    if (disease.causes.environmental && disease.causes.environmental !== "Unknown") {
      causesText += `\nEnvironmental factors: ${disease.causes.environmental}`;
    }
  }
  if (causesText) {
    addSectionHeader("2. Causes & Genetics");
    addParagraph(causesText, 9);
  }

  // ─── Symptoms Section ───
  const symptomsList = disease.typesAndSymptoms || disease.symptoms || [];
  if (symptomsList.length > 0) {
    addSectionHeader("3. Signs & Symptoms");
    symptomsList.forEach((s) => {
      addBulletPoint(s);
    });
  }

  // ─── Diagnosis Section ───
  if (disease.diagnosis && disease.diagnosis.length > 0) {
    addSectionHeader("4. Diagnostic Process & Methods");
    disease.diagnosis.forEach((d) => {
      addBulletPoint(d.name, [d.what, d.how, d.result ? `Result: ${d.result}` : ""].filter(Boolean).join(" "));
    });
  }

  // ─── Lifestyle & Support ───
  const lifestyle = disease.lifestyle || disease.lifestyleAndDailySupport;
  if (lifestyle) {
    addSectionHeader("5. Daily Care, Therapies & Lifestyle");
    if (lifestyle.therapies && Array.isArray(lifestyle.therapies) && lifestyle.therapies.length > 0) {
      addParagraph("Recommended Therapies:", 9, true);
      lifestyle.therapies.forEach((t: any) => {
        if (typeof t === "string") addBulletPoint(t);
        else if (t.name) addBulletPoint(t.name, t.desc);
      });
    }
    if (lifestyle.nutrition && typeof lifestyle.nutrition === "string") {
      addParagraph("Nutritional Support:", 9, true);
      addParagraph(lifestyle.nutrition, 9);
    }
    if (lifestyle.caregiverTips && Array.isArray(lifestyle.caregiverTips) && lifestyle.caregiverTips.length > 0) {
      addParagraph("Caregiver Guidance:", 9, true);
      lifestyle.caregiverTips.forEach((tip: string) => addBulletPoint(tip));
    }
    if (lifestyle.devices && Array.isArray(lifestyle.devices) && lifestyle.devices.length > 0) {
      addParagraph("Assistive Equipment & Devices:", 9, true);
      lifestyle.devices.forEach((dev: string) => addBulletPoint(dev));
    }
  }

  // ─── Research & Organizations ───
  const researchOrgs = disease.treatmentsAndPharma || disease.research || [];
  if (researchOrgs.length > 0) {
    addSectionHeader("6. Research Organizations & Clinical Trials");
    researchOrgs.forEach((org: any) => {
      const orgName = org.name || "Research Resource";
      const orgFocus = org.focus || org.why || "";
      const orgUrl = org.url || "";
      addBulletPoint(orgName, `${orgFocus}${orgUrl ? ` (Visit: ${orgUrl})` : ""}`);
    });
  }

  // ─── Specialists ───
  if (disease.specialists && disease.specialists.length > 0) {
    addSectionHeader("7. Specialist Teams & Centers");
    disease.specialists.forEach((s) => {
      const sOrg = s.organization || s.org || "";
      const sLoc = s.location ? ` - ${s.location}` : "";
      const sFocus = s.focus || s.role || "";
      addBulletPoint(s.name, `${sOrg}${sLoc}${sFocus ? ` (${sFocus})` : ""}`);
    });
  }

  // ─── FAQs ───
  if (disease.faqs && disease.faqs.length > 0) {
    addSectionHeader("8. Frequently Asked Questions");
    disease.faqs.forEach((faq) => {
      const q = faq.question || faq.q || "";
      const a = faq.answer || faq.a || "";
      if (q && a) {
        addParagraph(`Q: ${q}`, 9, true);
        addParagraph(`A: ${a}`, 9);
      }
    });
  }

  // ─── Sources & References ───
  if (disease.sources && disease.sources.length > 0) {
    addSectionHeader("9. References & Evidence Sources");
    disease.sources.forEach((src) => {
      addBulletPoint(src.title, `${src.type ? `[${src.type}] ` : ""}${src.url ? src.url : ""}`);
    });
  }

  // Disclaimer at the end
  checkPageBreak(25);
  y += 6;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("MEDICAL DISCLAIMER", margin + 4, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  const disclaimer =
    "This document is compiled for informational and educational purposes by RareBridge. It does not constitute medical diagnosis, treatment, or clinical advice. Consult qualified health professionals regarding personal conditions.";
  const discLines = doc.splitTextToSize(disclaimer, contentWidth - 8);
  doc.text(discLines, margin + 4, y + 10);

  // Add footer to all pages
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter();
  }

  // Save the PDF
  const sanitizedName = disease.name.replace(/[^a-zA-Z0-9]/g, "-");
  doc.save(`RareBridge-${sanitizedName}-Guide.pdf`);
}

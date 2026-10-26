import { isRbmCell, parseRbm } from '../app/utils/rbm/rbm.parser';
import { blocksToPlainText } from '../app/utils/rbm/rbm.serializer';
import { cleanPdfText } from '../app/utils/pdf-generator';
import { apiService, ApiError } from '../app/services/api.service';
import { DISEASES, type Disease } from '../app/data';

declare const process: any;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('🧪 Starting Frontend Parsing, API Integration & Data Integrity Test Suite...\n');

// ==========================================
// Suite 1: RBM Parsing and Plaintext Extraction
// ==========================================
console.log('--- Suite 1: RBM Markup Parsing & Plaintext Extraction ---');

const testRbmCell = `<!--rbm:1-->
# Overview
This is a **bold** statement and *italic* note with a [Reference Link](https://rarediseases.org).

- Characteristic symptom 1
- Characteristic symptom 2
`;

assert(isRbmCell(testRbmCell) === true, 'isRbmCell correctly identifies valid RBM cell');
assert(isRbmCell('Plain text without RBM') === false, 'isRbmCell rejects non-RBM string');
assert(isRbmCell('   <!--rbm:1-->\nIndented RBM') === true, 'isRbmCell tolerates leading whitespace');

const blocks = parseRbm(testRbmCell);
assert(Array.isArray(blocks) && blocks.length > 0, 'parseRbm outputs block array');

const plainText = blocksToPlainText(blocks);
assert(!plainText.includes('<!--rbm:'), 'blocksToPlainText strips RBM header tags');
assert(plainText.includes('Reference Link'), 'blocksToPlainText preserves link text');
assert(plainText.includes('Characteristic symptom 1'), 'blocksToPlainText preserves list items');
console.log('✓ Suite 1: RBM Parsing & Plaintext Extraction PASSED');

// ==========================================
// Suite 2: PDF Text Sanitizer & Exporter Cleaning
// ==========================================
console.log('\n--- Suite 2: PDF Text Sanitization & Format Tolerance ---');

// Null and empty safety
assert(cleanPdfText(null) === '', 'cleanPdfText handles null safely');
assert(cleanPdfText(undefined) === '', 'cleanPdfText handles undefined safely');
assert(cleanPdfText('') === '', 'cleanPdfText handles empty string');

// HTML tag stripping
const htmlInput = '<p>Patient may experience <strong>dyspnea</strong>.<br/>Follow up in 2 weeks.</p>';
const cleanedHtml = cleanPdfText(htmlInput);
assert(!cleanedHtml.includes('<p>') && !cleanedHtml.includes('<strong>'), 'cleanPdfText strips HTML tags');
assert(cleanedHtml.includes('dyspnea') && cleanedHtml.includes('Follow up in 2 weeks'), 'cleanPdfText preserves textual content');

// Structured object input handling
const structuredObj = {
  simple: 'Mild pediatric form with bone fragility.',
  medical: 'Autosomal dominant mutations in COL1A1 or COL1A2 genes.'
};
const cleanedObj = cleanPdfText(structuredObj);
assert(cleanedObj.includes('Mild pediatric form with bone fragility.'), 'cleanPdfText extracts simple overview');
assert(cleanedObj.includes('Clinical Detail: Autosomal dominant mutations'), 'cleanPdfText formats medical clinical detail');

// RBM cell inside cleanPdfText
const cleanedRbmInPdf = cleanPdfText(testRbmCell);
assert(!cleanedRbmInPdf.includes('<!--rbm:'), 'cleanPdfText strips RBM comments from string input');
assert(cleanedRbmInPdf.includes('Reference Link'), 'cleanPdfText preserves link content from RBM input');

// Array of rich text runs
const runArray = [
  { text: 'Initial presentation: ' },
  { text: 'elevated serum CK levels', bold: true },
  { text: ' observed in infancy.' }
];
const cleanedRuns = cleanPdfText(runArray);
assert(cleanedRuns === 'Initial presentation: elevated serum CK levels observed in infancy.', 'cleanPdfText joins rich text runs safely');
console.log('✓ Suite 2: PDF Text Sanitization PASSED');

// ==========================================
// Suite 3: API Service Resilience & Contracts
// ==========================================
console.log('\n--- Suite 3: API Resilience, Errors, & Contracts ---');

// ApiError structure verification
const sampleError = new ApiError('Service Unavailable', '/diseases', 503, true);
assert(sampleError.name === 'ApiError', 'ApiError sets correct name');
assert(sampleError.status === 503, 'ApiError tracks HTTP status');
assert(sampleError.endpoint === '/diseases', 'ApiError tracks endpoint URL');
assert(sampleError.isTransient === true, 'ApiError classifies 503 as transient');

const clientError = new ApiError('Resource Not Found', '/diseases/999', 404, false);
assert(clientError.isTransient === false, 'ApiError classifies 404 as non-transient');
assert(clientError.status === 404, 'ApiError tracks 404 status');

// Ensure apiService methods exist and are functions
assert(typeof apiService.getDiseases === 'function', 'apiService.getDiseases exists');
assert(typeof apiService.getDiseaseById === 'function', 'apiService.getDiseaseById exists');
assert(typeof apiService.getDiseaseByNumber === 'function', 'apiService.getDiseaseByNumber exists');
assert(typeof apiService.getHealth === 'function', 'apiService.getHealth exists');
console.log('✓ Suite 3: API Resilience & Contracts PASSED');

// ==========================================
// Suite 4: Disease Data Normalization & Contract Integrity
// ==========================================
console.log('\n--- Suite 4: Disease Data Normalization & Fallbacks ---');

assert(Array.isArray(DISEASES) && DISEASES.length > 0, 'DISEASES fallback registry is populated');

DISEASES.forEach((d: Disease) => {
  assert(Boolean(d.id), `Disease ${d.name || 'unnamed'} has required id`);
  assert(Boolean(d.name), `Disease ${d.id} has required name`);
  assert(Boolean(d.category), `Disease ${d.id} has required category`);

  // Ensure overview is accessible
  const overviewText = typeof d.overview === 'string'
    ? d.overview
    : (d.overview && typeof d.overview === 'object')
    ? ((d.overview as any).simple || (d.overview as any).medical || '')
    : '';
  assert(overviewText.length > 0, `Disease ${d.id} (${d.name}) has valid overview content`);

  // Symptoms integrity
  if (d.symptoms) {
    assert(Array.isArray(d.symptoms), `Disease ${d.id} symptoms is an array`);
  }

  // FAQs format tolerance
  if (d.faqs && d.faqs.length > 0) {
    (d.faqs as any[]).forEach((faq: any, idx: number) => {
      const q = faq.question || faq.q;
      const a = faq.answer || faq.a;
      assert(Boolean(q), `Disease ${d.id} FAQ #${idx + 1} has a valid question`);
      assert(Boolean(a), `Disease ${d.id} FAQ #${idx + 1} has a valid answer`);
    });
  }

  // Facts & Myths format tolerance
  const factsMyths = (d as any).factsMyths || (d as any).myths;
  if (factsMyths && factsMyths.length > 0) {
    factsMyths.forEach((item: any, idx: number) => {
      const statement = item.statement || item.myth || item.fact;
      assert(Boolean(statement), `Disease ${d.id} Myth/Fact #${idx + 1} has statement content`);
    });
  }
});

console.log('✓ Suite 4: Disease Data Normalization & Fallbacks PASSED');

console.log('\n======================================================');
console.log('🎉 ALL FRONTEND PARSING, API & DATA INTEGRITY TESTS PASSED!');
console.log('======================================================\n');

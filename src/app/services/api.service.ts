const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

// ─── Structured Types (matching backend smart-parsed output) ──────────────────

export interface CauseItem {
  title: string;
  explanation: string;
  details?: string[];
  references?: string[];
}

export interface ParsedType {
  title: string;
  description: string;
  characteristics?: string[];
  stage?: string;
  severity?: string;
  symptoms?: string[];
}

export interface ParsedSymptom {
  name: string;
  description?: string;
  category?: string;
  severity?: string;
  ageNotes?: string;
  notes?: string;
}

export interface DiagnosticStep {
  name: string;
  what: string;
  how: string;
  result: string;
}

export interface ContentNode {
  type: string;
  title?: Array<{ text: string; link?: string }>;
  content?: Array<{ text: string; link?: string }>;
  children?: ContentNode[];
}

export interface ParsedSection {
  title: string;
  raw: string;
  content: ContentNode[];
}

export interface CommunityResource {
  name: string;
  description: string;
  category: string;
  url: string | null;
  links: Array<{ url: string; label?: string }>;
}

export interface LifestyleData {
  therapies: Array<string | { name: string; desc?: string }>;
  nutrition: string;
  devices: string[];
  caregiverTips: string[];
  community: string;
  raw: string;
  sections: ParsedSection[];
  communities: CommunityResource[];
}

export interface ResearchOrg {
  name: string;
  focus: string;
  url: string | null;
  drugName?: string;
  stage?: string;
  status?: string;
  eligibility?: string;
  dates?: string;
  contact?: string;
  location?: string;
  notes?: string;
  references?: string[];
  links?: Array<{ url: string; label?: string }>;
  additionalContent?: ContentNode[];
}

export interface ResearchSection extends ParsedSection {
  kind: 'treatment' | 'clinicalTrials' | 'research';
  organizations: ResearchOrg[];
}

export interface FAQ {
  question: string;
  answer: string;
  order: number;
}

export interface FactMyth {
  myth: string;
  fact: string;
  statement?: string;
  isFact?: boolean;
  explanation?: string;
  order: number;
}

export interface Specialist {
  name: string;
  profession?: string;
  specialization?: string;
  photoUrl?: string | null;
  organization: string;
  location: string;
  contact?: string | null;
  publications?: string;
  sources?: string[];
  links?: Array<{ url: string; label?: string }>;
  additionalContent?: ContentNode[];
  /** Legacy compat */
  focus: string;
  why: string;
}

export interface Source {
  title: string;
  url?: string | null;
  type: string;
  description?: string | null;
}

export interface ParseCompletenessReport {
  sourceSectionsCount: number;
  parsedSectionsCount: number;
  displayedSectionsCount: number;
  causesCount: number;
  typesCount: number;
  symptomsCount: number;
  diagnosisCount: number;
  faqsCount: number;
  mythsCount: number;
  specialistsCount: number;
  sourcesCount: number;
  researchCount: number;
  uncategorizedItemsCount: number;
  isComplete: boolean;
}

export interface Disease {
  id: string;
  diseaseNumber: string;
  name: string;
  category: string;
  overview: string;
  causes: string | { genetic?: string; environmental?: string; unknown?: string };
  causesStructured?: CauseItem[];
  typesStructured?: ParsedType[];
  symptomsStructured?: ParsedSymptom[];
  typesAndSymptomsSections?: ParsedSection[];
  /** Smart-parsed symptom list */
  typesAndSymptoms: string[];
  /** Smart-parsed diagnostic steps */
  diagnosis: DiagnosticStep[];
  diagnosisSections?: ParsedSection[];
  /** Smart-parsed lifestyle data with sub-sections */
  lifestyleAndDailySupport: LifestyleData;
  /** Smart-parsed research orgs with links */
  treatmentsAndPharma: ResearchOrg[];
  treatmentSections?: ResearchSection[];
  clinicalTrials?: ResearchOrg[];
  researchOrganizations?: ResearchOrg[];
  researchSections?: ResearchSection[];
  faqs?: FAQ[];
  factsMyths?: FactMyth[];
  specialists?: Specialist[];
  sources?: Source[];
  uncategorizedContent?: string[];
  parseCompletenessReport?: ParseCompletenessReport;
  createdAt?: string;
  updatedAt?: string;
}

// ─── API Service ──────────────────────────────────────────────────────────────

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getDiseases(search?: string, category?: string): Promise<Disease[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const queryString = params.toString();
    const endpoint = `/diseases${queryString ? `?${queryString}` : ''}`;
    return this.request<Disease[]>(endpoint);
  }

  async getDiseaseById(id: string): Promise<Disease> {
    return this.request<Disease>(`/diseases/${id}`);
  }

  async getDiseaseByNumber(diseaseNumber: string): Promise<Disease> {
    return this.request<Disease>(`/diseases/number/${diseaseNumber}`);
  }

  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/diseases/categories');
  }
}

export const apiService = new ApiService();

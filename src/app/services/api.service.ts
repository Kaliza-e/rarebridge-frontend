const API_BASE_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && (process.env?.VITE_API_URL || process.env?.REACT_APP_API_URL)) ||
  ''
).replace(/\/+$/, '');

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

export class ApiError extends Error {
  status?: number;
  endpoint: string;
  isTransient: boolean;

  constructor(message: string, endpoint: string, status?: number, isTransient = false) {
    super(message);
    this.name = 'ApiError';
    this.endpoint = endpoint;
    this.status = status;
    this.isTransient = isTransient;
  }
}

// ─── API Service ──────────────────────────────────────────────────────────────

class ApiService {
  private inFlightRequests = new Map<string, Promise<any>>();
  private readonly DEFAULT_TIMEOUT_MS = 12000;
  private readonly MAX_RETRIES = 2;

  async getHealth(): Promise<{ status: 'ok' }> {
    return this.request<{ status: 'ok' }>('/health');
  }

  private async request<T>(endpoint: string, options?: RequestInit, retries = 0): Promise<T> {
    const isGet = !options?.method || options.method.toUpperCase() === 'GET';
    const cacheKey = isGet ? `${endpoint}` : '';

    if (cacheKey && this.inFlightRequests.has(cacheKey)) {
      return this.inFlightRequests.get(cacheKey) as Promise<T>;
    }

    const requestPromise = (async () => {
      const url = `${API_BASE_URL}${endpoint}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.DEFAULT_TIMEOUT_MS);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          ...options,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const isTransient = [408, 429, 500, 502, 503, 504].includes(response.status);
          if (isTransient && retries < this.MAX_RETRIES) {
            const delay = Math.pow(2, retries) * 500;
            await new Promise((resolve) => setTimeout(resolve, delay));
            return this.request<T>(endpoint, options, retries + 1);
          }
          throw new ApiError(
            `HTTP ${response.status}: Failed to fetch from ${endpoint}`,
            endpoint,
            response.status,
            isTransient
          );
        }

        return (await response.json()) as T;
      } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
          throw new ApiError(`Request timeout after ${this.DEFAULT_TIMEOUT_MS}ms`, endpoint, 408, true);
        }

        if (error instanceof ApiError) {
          throw error;
        }

        // Network failure
        if (retries < this.MAX_RETRIES) {
          const delay = Math.pow(2, retries) * 500;
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.request<T>(endpoint, options, retries + 1);
        }

        throw new ApiError(
          error?.message || 'Network connection failed',
          endpoint,
          undefined,
          true
        );
      } finally {
        if (cacheKey) {
          this.inFlightRequests.delete(cacheKey);
        }
      }
    })();

    if (cacheKey) {
      this.inFlightRequests.set(cacheKey, requestPromise);
    }

    return requestPromise;
  }

  async getDiseases(search?: string, category?: string): Promise<Disease[]> {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append('search', search.trim());
    if (category && category.trim() && category !== 'All') params.append('category', category.trim());
    const queryString = params.toString();
    const endpoint = `/diseases${queryString ? `?${queryString}` : ''}`;
    return this.request<Disease[]>(endpoint);
  }

  async getDiseaseById(id: string): Promise<Disease> {
    const encodedId = encodeURIComponent(id.trim());
    return this.request<Disease>(`/diseases/${encodedId}`);
  }

  async getDiseaseByNumber(diseaseNumber: string): Promise<Disease> {
    const encodedNum = encodeURIComponent(diseaseNumber.trim());
    return this.request<Disease>(`/diseases/number/${encodedNum}`);
  }

  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/diseases/categories');
  }
}

export const apiService = new ApiService();

import {
  Brain, Dna, Heart, Activity, Zap, Users, Bot, Shield,
  BookOpen, Stethoscope, Microscope, Footprints, Star,
  FlaskConical, Baby, ClipboardList, Syringe, MessageCircle, AlertCircle, HandHeart, MapPin, Phone, Globe
} from "lucide-react";
import { apiService, Disease as ApiDisease } from "./services/api.service";

// Helper function to extract environmental causes from text
function extractEnvironmentalCauses(text: string): string {
  if (!text) return "Unknown environmental factors";
  const environmentalKeywords = ['environmental', 'lifestyle', 'diet', 'exercise', 'exposure', 'toxin', 'pollution', 'radiation', 'chemical'];
  const lowerText = text.toLowerCase();

  if (environmentalKeywords.some(keyword => lowerText.includes(keyword))) {
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  }
  return "No known environmental triggers identified";
}

export const NAV_LINKS = ["Home", "About", "Explore Diseases", "Research", "Specialists", "Community"];

export const SUGGESTED_SEARCHES = ["Amyloidosis", "Adrenocortical Carcinoma", "Alexander Disease", "Batten Disease", "Angiosarcoma", "ALS"];

// Fallback data for when API is not available
const FALLBACK_DISEASES = [
  {
    id: "amyloidosis",
    name: "Amyloidosis",
    category: "Genetic",
    categoryBadges: ["Genetic"],
    icon: Brain,
    color: "navy",
    shortDesc: "Amyloidosis happens when misfolded proteins build up in organs such as the heart, kidneys, or nerves. The organs affected and the symptoms depend on the type.",
    researchStatus: "Active Research",
    inheritance: "Genetic",
    ageAppearance: "Variable",
    severity: "Variable",
    symptoms: ["Organ dysfunction", "Fatigue", "Weight loss", "Nerve damage", "Kidney problems", "Heart issues"],
    overview: {
      simple: "Amyloidosis happens when misfolded proteins build up in organs. The type determines which organs are affected and what symptoms appear.",
      medical: "Amyloidosis is caused by misfolded proteins that accumulate in organs and tissues, forming amyloid deposits that interfere with normal function."
    },
    causes: {
      genetic: "Some forms are inherited, especially hereditary ATTR, which is linked to changes in the TTR gene and can be passed to each child with a 50% chance.",
      environmental: "No environmental triggers are known for most forms. AA amyloidosis is linked to long-lasting inflammation or infection.",
      unknown: "For many people, the reason the proteins misfold is unknown."
    },
    types: [
      { stage: "Adult", type: "AL amyloidosis", symptoms: ["Age 65+", "More common in men", "Affects multiple organs"], severity: "Severe" },
      { stage: "Adult", type: "Wild-type ATTR", symptoms: ["Men over 60", "Heart involvement", "Carpal tunnel syndrome"], severity: "Variable" },
      { stage: "Variable", type: "Hereditary ATTR", symptoms: ["Nerve disease", "Heart disease", "Can appear young"], severity: "Variable" },
      { stage: "Adult", type: "AA amyloidosis", symptoms: ["Long-standing inflammation", "Kidney problems"], severity: "Moderate" }
    ],
    diagnosis: [
      { name: "Tissue Biopsy", what: "Removing a small tissue sample to examine under microscope for amyloid deposits.", how: "A doctor takes a sample from affected organ (often fat pad or bone marrow).", result: "Presence of amyloid deposits confirms diagnosis." },
      { name: "Genetic Testing", what: "Testing for mutations in genes associated with hereditary amyloidosis.", how: "Blood sample is analyzed for gene mutations.", result: "Finding specific mutations confirms hereditary type." }
    ],
    lifestyle: {
      therapies: [
        { name: "Physical Therapy", desc: "Helps maintain function and manage symptoms.", icon: Activity },
        { name: "Occupational Therapy", desc: "Supports daily activities and adaptation.", icon: Heart }
      ],
      nutrition: "Nutritional support may be needed depending on which organs are affected.",
      devices: ["Assistive devices for mobility", "Heart monitoring equipment"],
      caregiverTips: ["Monitor organ function regularly", "Follow treatment plans carefully", "Join support groups for patients"]
    },
    research: [
      { name: "Research Institutions", focus: "Developing new treatments for amyloidosis", why: "Ongoing clinical trials for medications that stop amyloid formation", logo: "RX" }
    ],
    faqs: [
      { q: "Is amyloidosis hereditary?", a: "Some forms are hereditary (ATTR), while others (AL, AA) are generally not inherited." }
    ],
    myths: [
      { myth: "Amyloidosis only affects the elderly.", fact: "While common in older adults, hereditary forms can appear much earlier in life." }
    ],
    specialists: [
      {
        name: "Dr. Morie Gertz",
        profession: "Hematologist",
        specialization: "Systemic Amyloidosis, AL Amyloidosis, Multiple Myeloma",
        organization: "Mayo Clinic",
        location: "Rochester, Minnesota, USA",
        contact: "https://www.mayoclinic.org",
        publications: "Over 400 peer-reviewed publications on amyloidosis diagnosis and treatment.",
        focus: "Hematologist",
        why: "Dr. Morie Gertz"
      },
      {
        name: "Dr. Giampaolo Merlini",
        profession: "Internist & Haematologist",
        specialization: "Amyloidosis, Plasma Cell Disorders",
        organization: "University of Pavia – Amyloidosis Research and Treatment Centre",
        location: "Pavia, Italy",
        contact: "https://www.unipv.eu",
        publications: "Pioneering research on AL amyloidosis diagnosis and novel therapies.",
        focus: "Internist & Haematologist",
        why: "Dr. Giampaolo Merlini"
      },
      {
        name: "Dr. John Berk",
        profession: "Cardiologist & Internist",
        specialization: "ATTR Amyloidosis, Cardiac Amyloidosis",
        organization: "Boston University Amyloidosis Center",
        location: "Boston, Massachusetts, USA",
        contact: "https://www.bumc.bu.edu/amyloid",
        publications: "Extensive work on transthyretin amyloid cardiomyopathy and tafamidis therapy.",
        focus: "Cardiologist & Internist",
        why: "Dr. John Berk"
      },
      {
        name: "Dr. Ashutosh Wechalekar",
        profession: "Consultant Haematologist",
        specialization: "AL Amyloidosis, Stem Cell Transplantation",
        organization: "University College London Hospitals NHS Foundation Trust",
        location: "London, United Kingdom",
        contact: "https://www.uclh.nhs.uk",
        publications: "Key contributions to AL amyloidosis clinical trials and treatment guidelines.",
        focus: "Consultant Haematologist",
        why: "Dr. Ashutosh Wechalekar"
      },
      {
        name: "Dr. Mathew Maurer",
        profession: "Cardiologist",
        specialization: "Cardiac Amyloidosis, Wild-Type ATTR",
        organization: "Columbia University Irving Medical Center",
        location: "New York, New York, USA",
        contact: "https://www.columbiadoctors.org",
        publications: "Led landmark trials including ATTR-ACT for tafamidis in ATTR cardiomyopathy.",
        focus: "Cardiologist",
        why: "Dr. Mathew Maurer"
      }
    ]
  },
  {
    id: "adrenocortical-carcinoma",
    name: "Adrenocortical Carcinoma",
    category: "Rare Adrenal Cancer",
    categoryBadges: ["Rare Adrenal Cancer"],
    icon: Heart,
    color: "sapphire",
    shortDesc: "A rare, aggressive cancer that starts in the outer layer of the adrenal glands, which sit above the kidneys.",
    researchStatus: "Active Research",
    inheritance: "Mostly sporadic",
    ageAppearance: "Variable",
    severity: "Severe",
    symptoms: ["Weight gain", "High blood pressure", "Muscle weakness", "Abdominal pain", "Hormone changes"],
    overview: {
      simple: "Adrenocortical carcinoma is a rare cancer of the adrenal glands that can cause hormone-related symptoms and abdominal pain.",
      medical: "ACC is a malignant tumor arising from the adrenal cortex, often presenting with hormonal excess or local mass effect."
    },
    causes: {
      genetic: "The exact cause is unknown, but a significant percentage of cases, especially in children, are caused by inherited genetic syndromes.",
      environmental: "No known environmental triggers have been identified.",
      unknown: "Most cases happen randomly with no family history."
    },
    types: [
      { stage: "All ages", type: "Hormone-producing", symptoms: ["Hormone excess", "Visible physical changes"], severity: "Variable" },
      { stage: "Adults", type: "Silent tumors", symptoms: ["Few early symptoms", "Later abdominal pain"], severity: "Severe" }
    ],
    diagnosis: [
      { name: "Blood Hormone Test", what: "Measures adrenal hormone levels in blood.", how: "Blood sample taken and analyzed for hormone levels.", result: "Elevated hormones suggest hormone-producing tumor." },
      { name: "Imaging (CT/MRI)", what: "Detailed imaging to locate and characterize the tumor.", how: "Patient lies in scanner while images are taken.", result: "Shows tumor size, location, and spread." }
    ],
    lifestyle: {
      therapies: [
        { name: "Hormone Management", desc: "Managing hormone-related symptoms.", icon: Activity }
      ],
      nutrition: "Nutritional support may be needed depending on symptoms.",
      devices: [],
      caregiverTips: ["Monitor blood pressure", "Watch for hormone changes", "Follow surgical recovery plans"]
    },
    research: [
      { name: "Cancer Centers", focus: "ACC research and clinical trials", why: "Ongoing research into targeted therapies", logo: "RX" }
    ],
    faqs: [
      { q: "What are the first symptoms?", a: "Symptoms depend on whether the tumor produces hormones. Hormone-producing tumors cause visible changes; silent tumors may not show symptoms until they grow large." }
    ],
    myths: [
      { myth: "ACC only affects children.", fact: "While more common in children under 5, adults ages 40-50 also develop ACC." }
    ],
    specialists: [
      { name: "Endocrine Specialists", role: "Hormone experts", org: "Medical Centers", location: "Various", specialization: "Adrenal disorders", publications: 0 }
    ]
  },
  {
    id: "alexander-disease",
    name: "Alexander Disease",
    category: "Genetic",
    categoryBadges: ["Genetic"],
    icon: Brain,
    color: "navy",
    shortDesc: "A rare genetic disorder that affects the nervous system and leads to developmental delays and neurological problems.",
    researchStatus: "Active Research",
    inheritance: "Autosomal Dominant",
    ageAppearance: "Infancy to childhood",
    severity: "Severe",
    symptoms: ["Developmental delay", "Megalencephaly", "Seizures", "Spasticity", "Progressive neurological decline"],
    overview: {
      simple: "Alexander Disease is a rare genetic disorder that primarily affects the nervous system, causing developmental delays and progressive neurological problems.",
      medical: "Alexander Disease is caused by mutations in the GFAP gene, leading to abnormal protein accumulation in astrocytes and white matter degeneration."
    },
    causes: {
      genetic: "Caused by mutations in the GFAP gene. Most cases are sporadic, but it can be inherited in an autosomal dominant pattern.",
      environmental: "No environmental factors are known to cause Alexander Disease.",
      unknown: "The exact mechanism by which GFAP mutations lead to the disease is still being studied."
    },
    types: [
      { stage: "Infancy", type: "Neonatal", symptoms: ["Severe developmental delay", "Seizures", "Hydrocephalus"], severity: "Very Severe" },
      { stage: "Childhood", type: "Juvenile", symptoms: ["Ataxia", "Dysphagia", "Cognitive decline"], severity: "Severe" },
      { stage: "Adulthood", type: "Adult", symptoms: ["Ataxia", "Dysarthria", "Sleep apnea"], severity: "Moderate" }
    ],
    diagnosis: [
      { name: "Genetic Testing", what: "Testing for GFAP gene mutations.", how: "Blood sample analyzed for GFAP mutations.", result: "GFAP mutation confirms diagnosis." },
      { name: "MRI", what: "Brain imaging to look for characteristic white matter changes.", how: "Patient undergoes MRI scan.", result: "White matter abnormalities support diagnosis." }
    ],
    lifestyle: {
      therapies: [
        { name: "Physical Therapy", desc: "Helps maintain mobility and function.", icon: Activity },
        { name: "Speech Therapy", desc: "Addresses swallowing and communication issues.", icon: MessageCircle }
      ],
      nutrition: "Feeding support may be needed due to swallowing difficulties.",
      devices: ["Feeding tubes", "Wheelchairs", "Communication devices"],
      caregiverTips: ["Monitor developmental milestones", "Address seizures promptly", "Provide supportive care"]
    },
    research: [
      { name: "Research Organizations", focus: "GFAP mutation research", why: "Understanding disease mechanisms and potential treatments", logo: "RX" }
    ],
    faqs: [
      { q: "Is Alexander Disease inherited?", a: "Most cases are sporadic, but it can be inherited in an autosomal dominant pattern when a parent has the GFAP mutation." }
    ],
    myths: [
      { myth: "Alexander Disease only affects children.", fact: "While most common in infants, juvenile and adult forms also exist." }
    ],
    specialists: [
      { name: "Neurologists", role: "Nervous system specialists", org: "Medical Centers", location: "Various", specialization: "Genetic neurological disorders", publications: 0 }
    ]
  },
  {
    id: "batten-disease",
    name: "Batten Disease",
    category: "Genetic · Neurological",
    categoryBadges: ["Genetic", "Neurological"],
    icon: Zap,
    color: "sapphire",
    shortDesc: "A fatal nervous system disorder that begins in childhood, causing vision loss, seizures, and progressive loss of motor and cognitive skills.",
    researchStatus: "Active Research",
    inheritance: "Autosomal Recessive",
    ageAppearance: "5–10 years",
    severity: "Severe",
    symptoms: ["Vision loss", "Seizures", "Cognitive decline", "Motor deterioration", "Behavioral changes"],
    overview: {
      simple: "Batten Disease is a group of fatal nervous system disorders that begin in childhood and progressively worsen, affecting vision, thinking, and movement.",
      medical: "Batten Disease (neuronal ceroid lipofuscinoses) are lysosomal storage disorders caused by mutations in various genes (CLN genes), leading to neuronal death."
    },
    causes: {
      genetic: "Caused by mutations in CLN genes. Both parents must carry the mutation (autosomal recessive). Different CLN genes cause different disease types.",
      environmental: "No environmental factors are known to cause Batten Disease.",
      unknown: "The exact mechanisms by which CLN mutations lead to neuronal death are still being researched."
    },
    types: [
      { stage: "Infancy", type: "CLN1 (Infantile)", symptoms: ["Language delay", "Ataxia", "Vision loss"], severity: "Very Severe" },
      { stage: "Late childhood", type: "CLN2 (Late-infantile)", symptoms: ["Seizures", "Developmental regression", "Vision loss"], severity: "Very Severe" },
      { stage: "Childhood", type: "CLN3 (Juvenile)", symptoms: ["Vision loss", "Cognitive decline", "Behavioral changes"], severity: "Severe" }
    ],
    diagnosis: [
      { name: "Genetic Testing", what: "Testing for mutations in CLN genes.", how: "Blood sample analyzed for CLN gene mutations.", result: "CLN mutation confirms specific disease type." },
      { name: "EEG", what: "Brain wave monitoring to detect seizure activity.", how: "Electrodes placed on scalp record brain activity.", result: "Abnormal patterns support diagnosis." }
    ],
    lifestyle: {
      therapies: [
        { name: "Physical Therapy", desc: "Helps maintain mobility as long as possible.", icon: Activity },
        { name: "Occupational Therapy", desc: "Supports daily functioning and adaptation.", icon: Heart }
      ],
      nutrition: "Feeding support often needed as swallowing difficulties develop.",
      devices: ["Wheelchairs", "Feeding tubes", "Communication devices", "Seizure monitoring equipment"],
      caregiverTips: ["Seizure safety precautions", "Vision support adaptations", "Behavioral management strategies"]
    },
    research: [
      { name: "Batten Disease Support", focus: "Research funding and family support", why: "Dedicated to finding treatments and supporting families", logo: "RX" }
    ],
    faqs: [
      { q: "How is Batten Disease inherited?", a: "Batten Disease is inherited in an autosomal recessive pattern, meaning both parents must carry the gene mutation." }
    ],
    myths: [
      { myth: "Batten Disease is contagious.", fact: "Batten Disease is a genetic disorder and cannot be caught from others." }
    ],
    specialists: [
      { name: "Pediatric Neurologists", role: "Child brain specialists", org: "Medical Centers", location: "Various", specialization: "Neurodegenerative disorders", publications: 0 }
    ]
  },
  {
    id: "angiosarcoma",
    name: "Angiosarcoma",
    category: "Rare Cancer",
    categoryBadges: ["Rare Cancer"],
    icon: Heart,
    color: "taupe",
    shortDesc: "A rare cancer that develops in the inner lining of blood vessels or lymph vessels, often appearing as a bruise-like lesion on the skin.",
    researchStatus: "Active Research",
    inheritance: "Not inherited",
    ageAppearance: "Older adults",
    severity: "Aggressive",
    symptoms: ["Skin lesions", "Bruise-like appearance", "Swelling", "Pain", "Bleeding"],
    overview: {
      simple: "Angiosarcoma is a rare cancer that starts in blood vessels. It often appears as a bruise on the skin and can grow quickly.",
      medical: "Angiosarcoma is a malignant tumor arising from endothelial cells of blood or lymph vessels, with a high tendency for local recurrence and metastasis."
    },
    causes: {
      genetic: "Not typically inherited. Some cases associated with radiation therapy or chronic lymphedema.",
      environmental: "Chronic lymphedema, radiation exposure, and certain chemicals are risk factors.",
      unknown: "The exact cause in many cases remains unknown."
    },
    types: [
      { stage: "Skin", type: "Cutaneous", symptoms: ["Bruise-like lesions", "Skin discoloration", "Bleeding"], severity: "Aggressive" },
      { stage: "Internal organs", type: "Visceral", symptoms: ["Organ-specific symptoms", "Pain", "Weight loss"], severity: "Very Aggressive" }
    ],
    diagnosis: [
      { name: "Biopsy", what: "Removing tissue sample for examination.", how: "Doctor removes sample from suspicious area.", result: "Microscopic examination confirms cancer type." },
      { name: "Imaging", what: "CT/MRI/PET scans to assess extent.", how: "Patient undergoes imaging studies.", result: "Shows tumor size, location, and spread." }
    ],
    lifestyle: {
      therapies: [
        { name: "Radiation Therapy", desc: "Often used after surgery to kill remaining cancer cells.", icon: Activity }
      ],
      nutrition: "Nutritional support may be needed during treatment.",
      devices: ["Compression garments", "Lymphedema management tools"],
      caregiverTips: ["Monitor for skin changes", "Watch for bleeding", "Support during treatment recovery"]
    },
    research: [
      { name: "Cancer Research Centers", focus: "Angiosarcoma clinical trials", why: "Developing new targeted therapies", logo: "RX" }
    ],
    faqs: [
      { q: "What does angiosarcoma look like?", a: "It often appears as a bruise-like purple or red lesion on the skin that may grow over time." }
    ],
    myths: [
      { myth: "Angiosarcoma is just a bad bruise.", fact: "While it may look like a bruise, angiosarcoma is a serious cancer that requires medical treatment." }
    ],
    specialists: [
      { name: "Oncologists", role: "Cancer specialists", org: "Cancer Centers", location: "Various", specialization: "Sarcoma treatment", publications: 0 }
    ]
  },
  {
    id: "als",
    name: "Amyotrophic Lateral Sclerosis",
    category: "Neurological",
    categoryBadges: ["Neurological"],
    icon: Activity,
    color: "navy",
    shortDesc: "A progressive neurodegenerative disease that affects nerve cells in the brain and spinal cord, causing loss of muscle control.",
    researchStatus: "Active Research",
    inheritance: "Mostly sporadic",
    ageAppearance: "40-70 years",
    severity: "Progressive",
    symptoms: ["Muscle weakness", "Difficulty speaking", "Trouble swallowing", "Breathing problems", "Paralysis"],
    overview: {
      simple: "ALS is a disease that gradually affects nerve cells controlling muscles, leading to progressive weakness and paralysis.",
      medical: "ALS is characterized by degeneration of motor neurons in the cerebral cortex, brainstem, and spinal cord, resulting in progressive muscle atrophy and weakness."
    },
    causes: {
      genetic: "About 5-10% of cases are familial (inherited), caused by mutations in genes like SOD1, C9orf72, TARDBP, and FUS.",
      environmental: "Possible environmental factors being studied, but no definitive causes identified.",
      unknown: "In 90-95% of cases, the cause is unknown (sporadic ALS)."
    },
    types: [
      { stage: "All", type: "Sporadic", symptoms: ["Most common form", "Unknown cause", "Progressive weakness"], severity: "Severe" },
      { stage: "Familial", type: "Familial", symptoms: ["Inherited", "Similar symptoms", "Earlier onset possible"], severity: "Severe" }
    ],
    diagnosis: [
      { name: "EMG/NCS", what: "Electromyography and nerve conduction studies to assess muscle and nerve function.", how: "Electrodes measure electrical activity in muscles and nerves.", result: "Abnormal patterns support ALS diagnosis." },
      { name: "MRI", what: "Brain and spinal cord imaging to rule out other conditions.", how: "Patient undergoes MRI scan.", result: "Helps exclude other neurological conditions." }
    ],
    lifestyle: {
      therapies: [
        { name: "Physical Therapy", desc: "Helps maintain mobility and function as long as possible.", icon: Activity },
        { name: "Speech Therapy", desc: "Addresses communication and swallowing difficulties.", icon: MessageCircle }
      ],
      nutrition: "Feeding tube often needed when swallowing becomes difficult.",
      devices: ["Wheelchairs", "Communication devices", "Ventilators", "Feeding tubes"],
      caregiverTips: ["Breathing support planning", "Communication adaptations", "Respiratory monitoring"]
    },
    research: [
      { name: "ALS Research Centers", focus: "Finding treatments and cure", why: "Extensive research into gene therapy and neuroprotection", logo: "RX" }
    ],
    faqs: [
      { q: "Is ALS always fatal?", a: "ALS is currently fatal, but treatments can extend life and improve quality of life. Research continues to find a cure." }
    ],
    myths: [
      { myth: "ALS is contagious.", fact: "ALS is not contagious and cannot be spread from person to person." }
    ],
    specialists: [
      { name: "Neurologists", role: "Nervous system specialists", org: "ALS Clinics", location: "Various", specialization: "Motor neuron diseases", publications: 0 }
    ]
  }
];

// Function to fetch diseases from API
export async function fetchDiseasesFromAPI(search?: string, category?: string) {
  try {
    const apiDiseases = await apiService.getDiseases(search, category);

    // Transform API data to frontend format
    const transformedDiseases = apiDiseases.map((apiDisease: ApiDisease) => ({
      id: apiDisease.id,
      name: apiDisease.name,
      category: apiDisease.category,
      categoryBadges: apiDisease.category ? apiDisease.category.split(/[·,]/).map((c: string) => c.trim()).filter(Boolean) : ["Rare Disease"],
      icon: Brain,
      color: "navy",
      shortDesc: apiDisease.overview ? (apiDisease.overview.length > 180 ? apiDisease.overview.substring(0, 180) + '...' : apiDisease.overview) : 'Comprehensive rare disease details and support resources.',
      researchStatus: "Active Research",
      inheritance: "Genetic",
      ageAppearance: "Variable",
      severity: "Severe",
      symptoms: apiDisease.typesAndSymptoms ?
        (Array.isArray(apiDisease.typesAndSymptoms)
          ? apiDisease.typesAndSymptoms
          : apiDisease.typesAndSymptoms.split(/\r?\n|•|,/).map(s => s.trim()).filter(Boolean)
        ) : [],
      overview: {
        simple: apiDisease.overview || "Overview information being updated.",
        medical: apiDisease.overview || "Medical overview being updated."
      },
      causes: typeof apiDisease.causes === 'object' && apiDisease.causes !== null ?
        apiDisease.causes :
        {
          genetic: apiDisease.causes || "Genetic & environmental cause information.",
          environmental: extractEnvironmentalCauses(apiDisease.causes || ""),
          unknown: "Additional factors may contribute to this condition."
        },
      types: [],
      diagnosis: apiDisease.diagnosis ?
        (Array.isArray(apiDisease.diagnosis)
          ? apiDisease.diagnosis
          : [{
            name: "Diagnostic Process",
            what: "Clinical evaluation, genetic tests, and diagnostic review",
            how: "Comprehensive assessment by specialized medical teams",
            result: apiDisease.diagnosis
          }]
        ) : [],
      lifestyle: typeof apiDisease.lifestyleAndDailySupport === 'object' && apiDisease.lifestyleAndDailySupport !== null ?
        {
          therapies: apiDisease.lifestyleAndDailySupport.therapies || [],
          nutrition: apiDisease.lifestyleAndDailySupport.nutrition || "Lifestyle and daily management information.",
          devices: apiDisease.lifestyleAndDailySupport.devices || [],
          caregiverTips: apiDisease.lifestyleAndDailySupport.caregiverTips || []
        } :
        {
          therapies: [],
          nutrition: apiDisease.lifestyleAndDailySupport || "Lifestyle and daily management information.",
          devices: [],
          caregiverTips: []
        },
      research: apiDisease.treatmentsAndPharma ?
        (Array.isArray(apiDisease.treatmentsAndPharma)
          ? apiDisease.treatmentsAndPharma.map(org => ({
            name: org.name,
            focus: org.focus,
            why: org.url ? `Visit: ${org.url}` : "Research organization",
            logo: "RX"
          }))
          : [{
            name: "Research & Pharma Directory",
            focus: apiDisease.treatmentsAndPharma,
            why: "Current clinical research, pharmaceutical pipeline, and therapeutic programs",
            logo: "RX"
          }]
        ) : [],
      faqs: apiDisease.faqs?.map(faq => ({ q: faq.question, a: faq.answer })) || [],
      myths: apiDisease.factsMyths?.map(fm => ({
        myth: fm.statement,
        fact: fm.isFact ? `[Fact] ${fm.explanation}` : `[Myth] ${fm.explanation}`
      })) || [],
      specialists: apiDisease.specialists?.map(spec => ({
        name: spec.name,
        profession: (spec as any).profession || spec.focus || "",
        specialization: (spec as any).specialization || spec.focus || "",
        organization: spec.organization || "",
        location: spec.location || "",
        contact: spec.contact || null,
        publications: (spec as any).publications || "",
        focus: spec.focus || "",
        why: spec.why || spec.name
      })) || []
    }));

    return transformedDiseases;
  } catch (error) {
    console.error('Failed to fetch diseases from API, using fallback data:', error);
    return FALLBACK_DISEASES;
  }
}

// Export DISEASES as a function that can be called with API data
export const DISEASES = FALLBACK_DISEASES;

export const CATEGORY_FILTERS = ["All", "Genetic", "Neurological", "Metabolic", "Autoimmune"];
export const STATUS_FILTERS = ["All Status", "Active Research", "Approved Treatment", "Support Available"];

export const COLOR_MAP: Record<string, { bg: string; text: string; badge: string; ring: string; iconBg: string }> = {
  navy: { bg: "bg-secondary", text: "text-primary", badge: "bg-primary text-ivory", ring: "ring-taupe", iconBg: "bg-primary" },
  sapphire: { bg: "bg-ivory", text: "text-accent", badge: "bg-accent text-ivory", ring: "ring-taupe", iconBg: "bg-accent" },
  taupe: { bg: "bg-taupe-20", text: "text-primary", badge: "bg-taupe text-primary", ring: "ring-taupe", iconBg: "bg-taupe" },
};

export const STATUS_COLOR: Record<string, string> = {
  "Active Research": "bg-accent-10 text-accent",
  "Approved Treatment": "bg-emerald-100 text-emerald-700",
  "Support Available": "bg-amber-100 text-amber-700",
};

export const JOURNEY_STEPS = [
  { icon: AlertCircle, label: "Symptoms", desc: "Unusual signs appear — unexplained delays, weakness, or changes in behavior." },
  { icon: Stethoscope, label: "Doctor Visit", desc: "Your family doctor refers you to a specialist for further evaluation." },
  { icon: ClipboardList, label: "Diagnosis", desc: "Genetic tests, enzyme panels, or imaging confirm the rare disease." },
  { icon: Syringe, label: "Treatment", desc: "A care team creates a personalized management and therapy plan." },
  { icon: HandHeart, label: "Lifestyle Support", desc: "Therapies, assistive devices, and daily care routines are established." },
  { icon: Users, label: "Community", desc: "Connect with families and organizations who share your experience." },
  { icon: Microscope, label: "Research", desc: "Follow the organizations working toward treatments and cures." },
];

export const STATS = [
  { label: "Rare Diseases", value: "7,000+" },
  { label: "Specialists", value: "2,400+" },
  { label: "Research Orgs", value: "850+" },
  { label: "Families Helped", value: "120K+" },
];

export const FEATURES = [
  { icon: BookOpen, title: "Disease Library", desc: "Explore 7,000+ rare diseases with plain-language explanations and comprehensive medical details." },
  { icon: Stethoscope, title: "Find Specialists", desc: "Connect with rare disease experts, metabolic specialists, and genetic counselors nationwide." },
  { icon: Microscope, title: "Research Updates", desc: "Follow the latest gene therapy breakthroughs and pharmaceutical pipeline news." },
  { icon: Users, title: "Community Support", desc: "Find support groups, family networks, and online communities who understand your journey." },
  { icon: Bot, title: "RareBridge AI", desc: "Upload research papers and ask questions in plain language — our AI simplifies complex science." },
  { icon: Shield, title: "Trusted Sources", desc: "All information is reviewed by medical professionals and sourced from leading institutions." },
];

// Extended interface for causes structure
interface Causes {
  genetic?: string;
  environmental?: string;
  unknown?: string;
}

export type Disease = typeof DISEASES[0] & {
  causes: string | Causes;
};

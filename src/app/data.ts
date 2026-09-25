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

export const SUGGESTED_SEARCHES = ["Adrenoleukodystrophy", "Mesothelioma", "Amyloidosis", "Adrenocortical Carcinoma", "Alexander Disease", "Batten Disease", "Angiosarcoma", "ALS"];

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
  },
  {
    id: "adrenoleukodystrophy",
    name: "Adrenoleukodystrophy",
    category: "Genetic · Neurological · Metabolic",
    categoryBadges: ["Genetic", "Neurological", "Metabolic"],
    icon: Brain,
    color: "navy",
    shortDesc: "Adrenoleukodystrophy (ALD) is a rare X-linked genetic disorder that causes a build-up of very long-chain fatty acids in the brain, nervous system, and adrenal glands, leading to progressive neurological damage.",
    researchStatus: "Active Research",
    inheritance: "X-Linked Recessive",
    ageAppearance: "Childhood to adulthood",
    severity: "Severe",
    symptoms: [
      "Behavioral changes and attention difficulties",
      "Progressive learning disability",
      "Vision loss",
      "Seizures",
      "Adrenal insufficiency (Addison's disease)",
      "Spastic paraparesis (weakness and stiffness of legs)",
      "Peripheral neuropathy",
      "Impaired gait and balance",
      "Hearing loss",
      "Cognitive decline"
    ],
    overview: {
      simple: "Adrenoleukodystrophy (ALD) is a rare X-linked genetic condition in which very long-chain fatty acids (VLCFAs) accumulate in the body because the ABCD1 gene that normally processes them is mutated. The build-up damages the protective myelin sheath around nerve cells in the brain and spinal cord, and also affects the adrenal glands. The most severe form, cerebral ALD, tends to affect boys aged 4–10 and progresses rapidly. Adult men often develop adrenomyeloneuropathy (AMN), a slower, milder form. Females who carry the gene can also be affected, typically showing milder AMN symptoms.",
      medical: "ALD is caused by mutations in the ABCD1 gene on the X chromosome, encoding a peroxisomal ABC transporter responsible for VLCFA catabolism. Accumulation of saturated VLCFAs (C24:0, C26:0) leads to demyelination and adrenocortical insufficiency. The childhood cerebral form involves neuroinflammatory demyelination while adrenomyeloneuropathy involves non-inflammatory axonopathy."
    },
    causes: {
      genetic: "Caused by mutations in the ABCD1 gene located on the X chromosome (Xq28). Because it is X-linked, males are more severely affected. Females who carry one mutated copy may have milder symptoms, especially in adulthood.",
      environmental: "No environmental factors are known to cause ALD. However, head trauma or infections may accelerate progression in some cerebral ALD cases.",
      unknown: "It is not fully understood why some individuals with ABCD1 mutations develop cerebral ALD while others develop the milder AMN form. Genetic modifiers and other as-yet-unknown factors are thought to play a role."
    },
    types: [
      { stage: "Childhood (4–10 years)", type: "Cerebral ALD (boys)", symptoms: ["Rapid neurological decline", "Behavioral changes", "Seizures", "Vision and hearing loss"], severity: "Very Severe" },
      { stage: "Adulthood (20s–40s)", type: "Adrenomyeloneuropathy (AMN)", symptoms: ["Progressive leg weakness", "Spasticity", "Bladder dysfunction", "Peripheral neuropathy"], severity: "Moderate–Severe" },
      { stage: "Variable", type: "Female carriers", symptoms: ["Mild AMN symptoms", "Leg weakness", "Often later onset"], severity: "Mild–Moderate" },
      { stage: "Any age", type: "Addison-only ALD", symptoms: ["Adrenal insufficiency only", "Fatigue", "Hyperpigmentation", "No neurological involvement"], severity: "Moderate" }
    ],
    diagnosis: [
      { name: "VLCFA Blood Test", what: "Measures the level of very long-chain fatty acids in the blood.", how: "A blood sample is drawn and analyzed in a laboratory for elevated C26:0 and C24:0 levels.", result: "Elevated VLCFAs strongly indicate ALD and are present in nearly all affected males and about 80% of female carriers." },
      { name: "ABCD1 Gene Mutation Analysis", what: "Genetic test to identify mutations in the ABCD1 gene.", how: "Blood or saliva sample is sent for targeted gene sequencing.", result: "Identifies the specific mutation, confirms the diagnosis, and enables family member screening." },
      { name: "MRI of the Brain", what: "Imaging to detect myelin damage and white matter lesions in the brain.", how: "Patient undergoes an MRI scan, focusing on the posterior white matter regions.", result: "Characteristic symmetric demyelination in the posterior cerebral white matter (splenium of corpus callosum) supports cerebral ALD diagnosis; Loes score is used to grade severity." },
      { name: "Adrenal Function Tests", what: "Tests to assess whether adrenal glands are producing adequate cortisol.", how: "Blood cortisol levels, ACTH stimulation test.", result: "Cortisol deficiency or poor ACTH response confirms adrenal insufficiency (Addison's disease)." },
      { name: "Neuropsychological Testing", what: "Evaluates cognitive, behavioral, and learning function.", how: "Standardized tests administered by a neuropsychologist.", result: "Documents baseline and tracks changes over time; used to monitor disease progression." }
    ],
    lifestyle: {
      therapies: [
        "Hematopoietic stem cell transplantation (HSCT) – if caught early in cerebral ALD",
        "Lorenzo's oil – may help slow VLCFA accumulation in asymptomatic males",
        "Physical therapy for spasticity and mobility support",
        "Occupational therapy for daily functioning",
        "Speech and language therapy if communication is affected"
      ],
      nutrition: "Lorenzo's oil (a 4:1 mixture of oleic acid and erucic acid) is used in some cases to lower plasma VLCFA levels. A diet low in saturated fats may complement treatment. Nutritional support is important during cortisol replacement therapy.",
      devices: ["Mobility aids (walkers, wheelchairs) for AMN", "Bladder management devices", "Communication aids if speech is affected", "Compression garments for spasticity management"],
      caregiverTips: [
        "Learn to recognize signs of adrenal crisis (life-threatening) and carry emergency hydrocortisone",
        "Monitor for new neurological symptoms and schedule regular MRI surveillance",
        "Connect with the ALD Connect patient registry and community",
        "Coordinate care between neurologist, endocrinologist, and physical therapist",
        "Genetic counseling for all family members, especially maternal relatives",
        "Maintain consistent school support plans for affected boys"
      ],
      community: "The ALD Alliance and ALD Connect (aldn.org) provide patient registries, family support, and research updates. The Myelin Project and Alex's Lemonade Stand Foundation also support ALD research."
    },
    research: [
      { name: "Kennedy Krieger Institute – Moser Center for Leukodystrophies", focus: "World-leading research and clinical care centre for ALD and other leukodystrophies. Conducts clinical trials including gene therapy.", why: "Home to pioneering VLCFA and ALD natural history research; treated Lorenzo Odone.", url: "https://www.kennedykrieger.org/patient-care/centers-and-programs/center-for-leukodystrophies" },
      { name: "Massachusetts General Hospital – ALD Program", focus: "Clinical research on newborn screening, gene therapy (Lenti-D/elivaldogene autotemcel), and HSCT outcomes for ALD.", why: "Part of bluebird bio's ALD gene therapy trial sites; leading AMN natural history studies.", url: "https://www.massgeneral.org/neurology" },
      { name: "bluebird bio – Elivaldogene Autotemcel (Skysona)", focus: "Gene therapy for early active cerebral ALD. FDA-approved in 2022 for boys aged 4–17 with early-stage cerebral ALD.", why: "First gene therapy approved for ALD; major therapeutic milestone.", url: "https://www.bluebirdbio.com/our-medicines/skysona" },
      { name: "Minoryx Therapeutics – Leriglitazone", focus: "Investigational oral PPARγ agonist targeting neuroinflammation in AMN.", why: "In Phase 3 trials for AMN; potential to slow progression in adult patients.", url: "https://www.minoryx.com" },
      { name: "ALD Connect Patient Registry", focus: "Patient-powered research network collecting natural history data to accelerate ALD clinical trials.", why: "Enables patients to connect with researchers and clinical trial opportunities.", url: "https://www.aldconnect.org" }
    ],
    faqs: [
      { q: "What is Adrenoleukodystrophy?", a: "ALD is a rare X-linked genetic disorder caused by mutations in the ABCD1 gene, leading to accumulation of very long-chain fatty acids that damage the brain's myelin sheath and the adrenal glands." },
      { q: "Who is affected by ALD?", a: "ALD primarily affects males. Boys aged 4–10 most commonly develop the most severe cerebral form. Adult men typically develop adrenomyeloneuropathy (AMN). Female carriers can also develop milder neurological symptoms, usually in adulthood." },
      { q: "Is ALD curable?", a: "There is no universal cure. However, hematopoietic stem cell transplantation (HSCT) or gene therapy (Skysona) can halt neurological decline if performed early in the cerebral form. These do not help once significant neurological damage has occurred." },
      { q: "How is ALD inherited?", a: "ALD is inherited in an X-linked pattern. The mutated ABCD1 gene is on the X chromosome, so mothers who carry one copy can pass it to their sons (who will be affected) or daughters (who will be carriers). Fathers with ALD pass the gene only to daughters." },
      { q: "What is Lorenzo's oil?", a: "Lorenzo's oil is a 4:1 mixture of oleic acid and erucic acid that was developed by Augusto and Michaela Odone for their son Lorenzo. It can normalize VLCFA levels in the blood in asymptomatic males but does not reverse or halt neurological damage once symptoms appear." }
    ],
    myths: [
      { myth: "ALD only affects boys.", fact: "While males are most severely affected, female carriers can also develop neurological symptoms — particularly adrenomyeloneuropathy (AMN) — often in adulthood, with leg weakness, spasticity, and bladder issues." },
      { myth: "Lorenzo's oil is a cure for ALD.", fact: "Lorenzo's oil can reduce very long-chain fatty acid levels in the blood in asymptomatic males but does not stop or reverse neurological decline once the disease is progressing. It is not a cure." },
      { myth: "ALD always progresses rapidly.", fact: "The speed of progression varies greatly by form. Cerebral ALD in boys can progress very rapidly (months to years), while adrenomyeloneuropathy (AMN) in adults usually progresses slowly over many years." },
      { myth: "Adrenal insufficiency in ALD is harmless if treated.", fact: "While cortisol replacement treats the adrenal crisis risk, it does not address the underlying neurological disease. Adrenal insufficiency can still be life-threatening if left unrecognized during illness or stress." },
      { myth: "Stem cell transplantation always works for ALD.", fact: "HSCT is only effective when performed in the early stages of cerebral ALD, while neurological damage is still minimal. Once significant demyelination has occurred, the risks of transplantation outweigh the benefits." }
    ],
    specialists: [
      {
        name: "Dr. Ali Fatemi",
        profession: "Pediatric Neurologist",
        specialization: "Leukodystrophies, Adrenoleukodystrophy, Neurogenetics",
        organization: "Kennedy Krieger Institute / Johns Hopkins University",
        location: "Baltimore, Maryland, USA",
        contact: "https://www.kennedykrieger.org",
        publications: "Over 100 publications on ALD and leukodystrophies; leads ALD clinical trials and international natural history studies.",
        focus: "Pediatric Neurologist",
        why: "Dr. Ali Fatemi"
      },
      {
        name: "Dr. Florian Eichler",
        profession: "Neurologist",
        specialization: "Adrenoleukodystrophy, Leukodystrophies, Gene Therapy",
        organization: "Massachusetts General Hospital / Harvard Medical School",
        location: "Boston, Massachusetts, USA",
        contact: "https://www.massgeneral.org",
        publications: "Principal investigator on Skysona (elivaldogene autotemcel) gene therapy trials; extensive AMN natural history research.",
        focus: "Neurologist",
        why: "Dr. Florian Eichler"
      },
      {
        name: "Dr. Gerald Raymond",
        profession: "Neurologist",
        specialization: "ALD, VLCFA metabolism, Leukodystrophies",
        organization: "University of Minnesota / ALD Research Consortium",
        location: "Minneapolis, Minnesota, USA",
        contact: "https://www.umn.edu",
        publications: "Co-developer of MRI Loes scoring system for ALD; extensive neuroimaging and natural history research.",
        focus: "Neurologist",
        why: "Dr. Gerald Raymond"
      },
      {
        name: "Dr. Stephan Kemp",
        profession: "Biochemist / Researcher",
        specialization: "ABCD1 gene function, VLCFA metabolism, Peroxisomal disorders",
        organization: "Amsterdam UMC – University of Amsterdam",
        location: "Amsterdam, Netherlands",
        contact: "https://www.amsterdamumc.org",
        publications: "Leading molecular genetics research on ABCD1 mutations and the development of disease biomarkers for ALD.",
        focus: "Biochemist / Researcher",
        why: "Dr. Stephan Kemp"
      },
      {
        name: "Dr. Hugo Moser",
        profession: "Neurologist and Pioneer Researcher (legacy)",
        specialization: "ALD – foundational research on VLCFA accumulation and diagnosis",
        organization: "Kennedy Krieger Institute (historical)",
        location: "Baltimore, Maryland, USA",
        contact: "https://www.kennedykrieger.org",
        publications: "Foundational work defining ALD's metabolic basis, the VLCFA blood test, and clinical spectrum. His center continues to be the world's reference for ALD care.",
        focus: "Neurologist",
        why: "Dr. Hugo Moser"
      }
    ]
  }
];

// Helper function to extract plain text safely from string, object, or RichTextRun array
function extractPlainText(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val.trim();
  if (Array.isArray(val)) {
    return val
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") return item.text || item.statement || item.explanation || item.myth || item.fact || "";
        return "";
      })
      .join("")
      .trim();
  }
  if (typeof val === "object") {
    return val.text || val.statement || val.explanation || val.myth || val.fact || val.simple || val.medical || "";
  }
  return String(val).trim();
}

// Function to fetch diseases from API
export async function fetchDiseasesFromAPI(search?: string, category?: string) {
  try {
    const apiDiseases = await apiService.getDiseases(search, category);

    // Transform API data to frontend format without discarding structured data or truncating text
    const transformedDiseases = apiDiseases.map((apiDisease: ApiDisease) => {
      // Parse facts/myths safely
      const myths = Array.isArray(apiDisease.factsMyths)
        ? apiDisease.factsMyths.map((fm: any, idx: number) => {
            const mythStr = extractPlainText(fm.myth) || extractPlainText(fm.statement) || `Myth #${idx + 1}`;
            let factStr = extractPlainText(fm.fact) || extractPlainText(fm.explanation) || "";
            // Strip any [Myth] or [Fact] prefix from explanation
            factStr = factStr.replace(/^\[(Myth|Fact)\]\s*/i, "");
            return {
              myth: mythStr,
              fact: factStr || "Verified medical guidance.",
              statement: mythStr,
              explanation: factStr || "Verified medical guidance.",
              isFact: fm.isFact ?? false,
              order: fm.order || idx + 1,
            };
          })
        : [];

      return {
        ...apiDisease, // Keep all raw backend properties (causesStructured, typesStructured, symptomsStructured, etc.)
        id: apiDisease.id || apiDisease.diseaseNumber || apiDisease.name.toLowerCase().replace(/\s+/g, "-"),
        name: apiDisease.name,
        category: apiDisease.category || "Rare Disease",
        categoryBadges: apiDisease.category
          ? apiDisease.category.split(/[·,]/).map((c: string) => c.trim()).filter(Boolean)
          : ["Rare Disease"],
        icon: Brain,
        color: "navy",
        shortDesc: extractPlainText(apiDisease.overview) || 'Comprehensive rare disease details and support resources.',
        researchStatus: "Active Research",
        inheritance: "Genetic",
        ageAppearance: "Variable",
        severity: "Severe",
        symptoms: Array.isArray(apiDisease.typesAndSymptoms) ? apiDisease.typesAndSymptoms : [],
        overview: typeof apiDisease.overview === 'object' && apiDisease.overview !== null
          ? apiDisease.overview
          : {
              simple: apiDisease.overview || "Overview information being updated.",
              medical: apiDisease.overview || "Medical overview being updated."
            },
        causes: typeof apiDisease.causes === 'object' && apiDisease.causes !== null
          ? apiDisease.causes
          : {
              genetic: apiDisease.causes || "Genetic & environmental cause information.",
              environmental: apiDisease.causes || "Environmental exposure and risk factor information.",
              unknown: "Additional factors may contribute to this condition."
            },
        causesStructured: apiDisease.causesStructured || [],
        typesStructured: apiDisease.typesStructured || [],
        symptomsStructured: apiDisease.symptomsStructured || [],
        types: Array.isArray(apiDisease.typesStructured) && apiDisease.typesStructured.length > 0
          ? apiDisease.typesStructured
          : [],
        diagnosis: apiDisease.diagnosis ?
          (Array.isArray(apiDisease.diagnosis)
            ? apiDisease.diagnosis
            : [{
              name: "Diagnostic Process",
              what: "Clinical evaluation, genetic tests, and diagnostic review",
              how: "Comprehensive assessment by specialized medical teams",
              result: extractPlainText(apiDisease.diagnosis)
            }]
          ) : [],
        lifestyleAndDailySupport: apiDisease.lifestyleAndDailySupport || {
          therapies: [],
          nutrition: typeof apiDisease.lifestyleAndDailySupport === "string" ? apiDisease.lifestyleAndDailySupport : "",
          devices: [],
          caregiverTips: [],
          community: "",
          raw: typeof apiDisease.lifestyleAndDailySupport === "string" ? apiDisease.lifestyleAndDailySupport : ""
        },
        lifestyle: typeof apiDisease.lifestyleAndDailySupport === 'object' && apiDisease.lifestyleAndDailySupport !== null ?
          {
            therapies: apiDisease.lifestyleAndDailySupport.therapies || [],
            nutrition: apiDisease.lifestyleAndDailySupport.nutrition || "",
            devices: apiDisease.lifestyleAndDailySupport.devices || [],
            caregiverTips: apiDisease.lifestyleAndDailySupport.caregiverTips || [],
            community: apiDisease.lifestyleAndDailySupport.community || "",
            raw: apiDisease.lifestyleAndDailySupport.raw || ""
          } :
          {
            therapies: [],
            nutrition: typeof apiDisease.lifestyleAndDailySupport === "string" ? apiDisease.lifestyleAndDailySupport : "",
            devices: [],
            caregiverTips: [],
            community: "",
            raw: typeof apiDisease.lifestyleAndDailySupport === "string" ? apiDisease.lifestyleAndDailySupport : ""
          },
        treatmentsAndPharma: apiDisease.treatmentsAndPharma || [],
        research: Array.isArray(apiDisease.treatmentsAndPharma) && apiDisease.treatmentsAndPharma.length > 0
          ? apiDisease.treatmentsAndPharma.map(org => ({
              name: org.name || "Research Institution",
              focus: org.focus || "Clinical trial and research program",
              why: org.url ? `Visit: ${org.url}` : "Research organization",
              url: org.url,
              drugName: org.drugName,
              stage: org.stage,
              status: org.status,
              eligibility: org.eligibility,
              logo: "RX"
            }))
          : (apiDisease.treatmentsAndPharma ? [{
              name: "Research & Pharma Directory",
              focus: extractPlainText(apiDisease.treatmentsAndPharma),
              why: "Current clinical research, pharmaceutical pipeline, and therapeutic programs",
              logo: "RX"
            }] : []),
        faqs: Array.isArray(apiDisease.faqs)
          ? apiDisease.faqs.map(faq => ({
              q: extractPlainText(faq.question) || "Frequently Asked Question",
              a: extractPlainText(faq.answer) || "Consult specialist for detailed information."
            }))
          : [],
        myths,
        factsMyths: myths,
        specialists: apiDisease.specialists?.map(spec => ({
          name: spec.name,
          profession: (spec as any).profession || spec.focus || "",
          specialization: (spec as any).specialization || spec.focus || "",
          organization: spec.organization || "",
          location: spec.location || "",
          contact: spec.contact || null,
          publications: (spec as any).publications || "",
          sources: spec.sources || [],
          focus: spec.focus || "",
          why: spec.why || spec.name
        })) || []
      };
    });

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

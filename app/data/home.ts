export const services = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Modern websites and web applications built around your business goals.",
    items: [
      "Landing Pages",
      "Business Websites",
      "Web Applications",
      "Dashboards",
    ],
  },

  {
    number: "02",
    title: "Mobile Applications",
    description:
      "Mobile experiences designed to connect your products with users anywhere.",
    items: [
      "iOS & Android",
      "Cross-platform Apps",
      "API Integration",
      "AI Integration",
    ],
  },

  {
    number: "03",
    title: "Digital Marketing",
    description:
      "Creative digital strategies built to connect brands with the right audience.",
    items: ["Social Media", "Content Strategy", "Campaigns", "Brand Presence"],
  },
];

export type ProjectTone = "live" | "trial" | "new" | "closed";

export type ProjectMotif = "nutrition" | "pipeline" | "film" | "lessons";

// Each product keeps its own brand colour so its card feels like the product itself.
export type ProjectTheme = {
  accent: string;
  rgb: string;
  alt: string;
};

export type Project = {
  theme: ProjectTheme;
  motif: ProjectMotif;
  category: string;
  title: string;
  shortTitle: string;
  description: string;
  tags: string[];
  // A null link means the product is not open to the public right now.
  link: string | null;
  linkText: string;
  status: string;
  signal: string;
  tone: ProjectTone;
  domain: string;
  // A null preview renders the illustrated visual for that product instead of a screenshot.
  preview: string | null;
  previewAlt: string;
};

export const projects: Project[] = [
  {
    theme: { accent: "#2fd573", rgb: "47, 213, 115", alt: "#b8f5cf" },
    motif: "nutrition",
    category: "AI APPLICATION",
    title: "NEX4 NutriTrack AI",
    shortTitle: "NutriTrack",
    description:
      "An AI-powered nutrition experience designed to make understanding food and daily nutrition easier and more accessible.",
    tags: ["AI Integration", "Web Application", "Product Design"],
    link: "https://nutritrack.nex4.my",
    linkText: "Open NutriTrack",
    status: "Live application",
    signal: "LIVE",
    tone: "live",
    domain: "nutritrack.nex4.my",
    preview: "/images/projects/nutritrack-preview.png",
    previewAlt: "Preview of the NutriTrack website",
  },

  {
    theme: { accent: "#8b7bff", rgb: "139, 123, 255", alt: "#d6d0ff" },
    motif: "pipeline",
    category: "BUSINESS SYSTEM",
    title: "NEX4 Marketing CRM",
    shortTitle: "NEX4 CRM",
    description:
      "A centralized workspace designed to organize marketing information, workflows and business activities.",
    tags: ["CRM", "Dashboard", "Web Application", "Business Tools"],
    link: "https://crm.nex4.my",
    linkText: "Request Trial",
    status: "Open For Trial",
    signal: "TRIAL",
    tone: "trial",
    domain: "crm.nex4.my",
    preview: "/images/projects/crm-preview.png",
    previewAlt: "Preview of the NEX4 Marketing CRM website",
  },

  {
    theme: { accent: "#f17656", rgb: "241, 118, 86", alt: "#ffd9a8" },
    motif: "film",
    category: "PHOTOBOOTH PLATFORM",
    title: "Sebingkai",
    shortTitle: "Sebingkai",
    description:
      "A photobooth platform that captures the moment, frames it beautifully and makes it ready to share in seconds.",
    tags: ["Photobooth", "Web Application", "Photo Frames", "Events"],
    link: "https://sebingkai.nex4.my",
    linkText: "Open Sebingkai",
    status: "New in the network",
    signal: "NEW",
    tone: "new",
    domain: "sebingkai.nex4.my",
    preview: null,
    previewAlt: "",
  },

  {
    theme: { accent: "#2fb39a", rgb: "47, 179, 154", alt: "#c8ec60" },
    motif: "lessons",
    category: "EDUCATION PLATFORM",
    title: "NEX4 LMS",
    shortTitle: "NEX4 LMS",
    description:
      "A learning management system designed to manage courses, students, learning content and progress through one centralized platform. Beta testing is now closed — thank you to everyone who took part.",
    tags: ["LMS", "Dashboard", "Web Application", "Learning Management", "Education Platform"],
    link: null,
    linkText: "Ask About LMS",
    status: "Beta testing closed",
    signal: "BETA CLOSED",
    tone: "closed",
    domain: "lms.nex4.my",
    preview: "/images/projects/lms-preview.png",
    previewAlt: "Preview of the NEX4 LMS platform",
  },
];

export const team = [
  {
    name: "Aeman",
    role: "Programmer",
    department: "Development / Digital Products",
    initials: "AE",
    portfolioUrl: "https://portfolio-aiman.nex4.my",
    portfolioLabel: "View portfolio",
  },

  {
    name: "Syed Ali",
    role: "Marketing Executive",
    department: "Marketing / Growth",
    initials: "SA",
    portfolioUrl: "https://portfolio-ali.nex4.my",
    portfolioLabel: "View portfolio",
  },

  {
    name: "Kirthy",
    role: "Sales Executive",
    department: "Sales / Partnerships",
    initials: "KI",
    portfolioUrl: null,
    portfolioLabel: "Portfolio coming soon",
  },
];

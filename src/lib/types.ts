export interface ScrapedPageData {
  url: string;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string | null;
  headings: { level: number; text: string }[];
  ctas: { text: string; href: string; type: "button" | "link" }[];
  images: { src: string; alt: string }[];
  links: { text: string; href: string; isExternal: boolean }[];
  textContent: string;
  formCount: number;
  hasTestimonials: boolean;
  hasPricingSection: boolean;
  wordCount: number;
}

export interface AuditFinding {
  id: string;
  category: "cta" | "copy" | "trust" | "ux" | "speed" | "mobile";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  recommendation: string;
  impactScore: number;
  rewrittenCopy?: string;
}

export interface AuditResults {
  overallScore: number;
  summary: string;
  findings: AuditFinding[];
  categoryScores: {
    cta: number;
    copy: number;
    trust: number;
    ux: number;
    speed: number;
    mobile: number;
  };
  rewrittenHeadline?: string;
  rewrittenSubheadline?: string;
}

export interface AuditRecord {
  id: string;
  user_id: string | null;
  url: string;
  email: string | null;
  audit_type: "free" | "full";
  status: "pending" | "processing" | "completed" | "failed";
  scraped_data: ScrapedPageData | null;
  results: AuditResults | null;
  overall_score: number | null;
  error_message: string | null;
  share_token: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

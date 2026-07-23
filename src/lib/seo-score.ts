export type SeoScoreInput = {
  title: string;
  description: string;
  keyword: string;
  text: string;
  content?: string;
  hasImage?: boolean;
  hasLink?: boolean;
  hasHeading?: boolean;
};

export type SeoScoreResult = {
  score: number;
  readability: number;
  wordCount: number;
  checks: Array<{
    key: string;
    label: string;
    passed: boolean;
    points: number;
  }>;
};

export function plainText(value = "") {
  return value
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;|&#x27;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(value: string) {
  return value.toLowerCase().match(/[a-z0-9À-ÿ'-]+/gi)?.length || 0;
}

export function calculateReadability(value: string) {
  const text = plainText(value);
  const sentences = text.split(/[.!?]+/).filter((part) => part.trim()).length || 1;
  const averageSentenceLength = countWords(text) / sentences;

  if (averageSentenceLength <= 14) return 92;
  if (averageSentenceLength <= 19) return 82;
  if (averageSentenceLength <= 25) return 70;
  return 58;
}

export function calculateSeoScore(input: SeoScoreInput): SeoScoreResult {
  const title = input.title.trim();
  const description = input.description.trim();
  const keyword = input.keyword.trim().toLowerCase();
  const keywordToken = keyword.split(/\s+/).filter(Boolean)[0] || "";
  const text = plainText(input.text);
  const content = input.content || "";
  const wordCount = countWords(text);
  const hasImage = input.hasImage ?? /<img\b/i.test(content);
  const hasLink = input.hasLink ?? /<a\b/i.test(content);
  const hasHeading = input.hasHeading ?? /<h1\b/i.test(content);

  const checks = [
    { key: "title", label: "SEO-titel is 35-70 tekens", passed: title.length >= 35 && title.length <= 70, points: 15 },
    { key: "description", label: "Metaomschrijving is 120-160 tekens", passed: description.length >= 120 && description.length <= 160, points: 18 },
    { key: "keyword-title", label: "Zoekwoord staat in de titel", passed: Boolean(keywordToken && title.toLowerCase().includes(keywordToken)), points: 12 },
    { key: "keyword-description", label: "Zoekwoord staat in de omschrijving", passed: Boolean(keywordToken && description.toLowerCase().includes(keywordToken)), points: 10 },
    { key: "content", label: "Minimaal 250 woorden", passed: wordCount >= 250, points: 14 },
    { key: "depth", label: "Uitgebreide inhoud van 700+ woorden", passed: wordCount >= 700, points: 6 },
    { key: "image", label: "Pagina bevat beeld", passed: hasImage, points: 6 },
    { key: "link", label: "Pagina bevat een interne link of CTA", passed: hasLink, points: 7 },
    { key: "heading", label: "Pagina bevat een hoofdheading", passed: hasHeading, points: 6 },
    { key: "structured", label: "Pagina bevat structured data", passed: content.includes("schema.org"), points: 6 },
  ];

  const score = Math.min(
    100,
    20 + checks.reduce((total, check) => total + (check.passed ? check.points : 0), 0),
  );

  return {
    score,
    readability: calculateReadability(text),
    wordCount,
    checks,
  };
}

export function canonicalForCmsSlug(slug: string) {
  const normalized = slug.replace(/^\/+|\/+$/g, "") || "home";
  const pathname = normalized === "home" ? "/" : `/${normalized}`;
  return new URL(pathname, "https://www.4x4models.com").toString();
}

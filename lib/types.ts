export type ContentBlock =
  | { type: "heading2"; text: string }
  | { type: "heading3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; variant?: "info" | "warning" | "danger"; text: string }
  | { type: "editorial_note"; text: string }
  | { type: "steps"; items: string[] }
  | { type: "definition_list"; items: { term: string; description: string }[] }
  | { type: "cta_banner"; title: string; description?: string; buttonText?: string }
  | { type: "related_articles"; articles: { slug: string; title: string }[] };

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  body: ContentBlock[];
};

import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/data";

export const dynamic = "force-static";
import { getAllArticles } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const articleUrls = articles.map((a) => ({
    url: `${BASE_URL}/blog/${a.slug}/`,
    lastModified: new Date(a.updatedAt ?? a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/review/`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/campaign/`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog/`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/diagnosis/`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...articleUrls,
  ];
}

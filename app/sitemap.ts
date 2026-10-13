import { MetadataRoute } from "next";
import { INSTRUMENTS } from "@/data/instruments";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ngucung.vn";
  const now = new Date();

  // Các trang tĩnh chính
  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/luat-choi`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/ngu-hanh`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/choi-thu-ngay`, lastModified: now, changeFrequency: "daily" as const, priority: 0.95 },
    { url: `${baseUrl}/choi-thu`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/san-choi-ngu-am`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/quiz`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/bo-bai`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  // 15 trang chi tiết nhạc cụ
  const instrumentRoutes = INSTRUMENTS.map((inst) => ({
    url: `${baseUrl}/nhac-cu/${inst.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...instrumentRoutes];
}

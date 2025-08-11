import { getAllBuildings } from "@lib/data";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
  const buildings = await getAllBuildings();

  return [
    { url: base.toString(), lastModified: new Date() },
    ...buildings.map((b) => ({ url: new URL(`/property/${b.slug}`, base).toString(), lastModified: new Date() })),
  ];
}



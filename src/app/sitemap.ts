import type { MetadataRoute } from "next";
import { articles, industries, policies } from "@/data/content";
import { getCategories, getProducts } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

const staticPaths = [
  "/",
  "/giam-gia",
  "/giai-phap",
  "/tin-tuc",
  "/huong-dan-chon-size",
  "/cau-hoi-thuong-gap",
  "/gioi-thieu",
  "/lien-he",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const paths = [
    ...staticPaths,
    ...categories.map((c) => c.href),
    ...products.map((p) => `/san-pham/${p.slug}`),
    ...industries.map((i) => `/giai-phap/${i.slug}`),
    ...articles.map((a) => `/tin-tuc/${a.slug}`),
    ...policies.map((p) => `/chinh-sach/${p.slug}`),
  ];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}

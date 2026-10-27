export type Color = { name: string; hex: string };

export type ProductImage = { id: string; url: string; alt: string };

export type Variant = {
  id: string;
  sku: string;
  colorName: string | null;
  colorHex: string | null;
  size: string | null;
  stock: number | null;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  title: string;
  href: string;
  description: string;
  seoText: string;
  parentSlug: string | null;
};

export type Rating = { avg: number; count: number };

export type Review = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  categoryHref: string;
  summary: string;
  description: string;
  price: number;
  salePrice?: number;
  sold: number;
  giftNote: string;
  rating: Rating | null;
  sku: string;
  colors: Color[];
  sizes: string[];
  specs: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
  images: ProductImage[];
  variants: Variant[];
};

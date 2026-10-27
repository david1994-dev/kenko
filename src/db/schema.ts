import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const productStatuses = ["draft", "active", "hidden"] as const;
export const orderStatuses = ["new", "confirmed", "shipping", "delivered", "cancelled", "returned"] as const;

export const reviewStatuses = ["pending", "approved", "hidden"] as const;
export type ReviewStatus = (typeof reviewStatuses)[number];

export type ProductStatus = (typeof productStatuses)[number];
export type OrderStatus = (typeof orderStatuses)[number];

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  href: text("href").notNull().unique(),
  description: text("description").notNull().default(""),
  seoText: text("seo_text").notNull().default(""),
  parentId: integer("parent_id"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
    summary: text("summary").notNull().default(""),
    description: text("description").notNull().default(""),
    price: integer("price").notNull(),
    salePrice: integer("sale_price"),
    soldCount: integer("sold_count").notNull().default(0),
    giftNote: text("gift_note").notNull().default(""),
    sku: text("sku").notNull().default(""),
    specs: jsonb("specs").$type<{ label: string; value: string }[]>().notNull().default(sql`'[]'::jsonb`),
    faqs: jsonb("faqs").$type<{ q: string; a: string }[]>().notNull().default(sql`'[]'::jsonb`),
    status: text("status").$type<ProductStatus>().notNull().default("active"),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("products_category_idx").on(t.categoryId)],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: text("sku").notNull().unique(),
    colorName: text("color_name"),
    colorHex: text("color_hex"),
    size: text("size"),
    // null = không theo dõi tồn kho
    stock: integer("stock"),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [unique("product_variants_option_uq").on(t.productId, t.colorName, t.size).nullsNotDistinct()],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index("product_images_product_idx").on(t.productId)],
);

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().unique(),
  createdAt: createdAt(),
  lastOrderAt: timestamp("last_order_at", { withTimezone: true }),
});

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id),
    status: text("status").$type<OrderStatus>().notNull().default("new"),
    paymentMethod: text("payment_method").notNull().default("cod"),
    subtotal: integer("subtotal").notNull(),
    shippingFee: integer("shipping_fee").notNull().default(0),
    total: integer("total").notNull(),
    shipName: text("ship_name").notNull(),
    shipPhone: text("ship_phone").notNull(),
    shipProvince: text("ship_province").notNull().default(""),
    shipDistrict: text("ship_district").notNull().default(""),
    shipAddress: text("ship_address").notNull(),
    note: text("note").notNull().default(""),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("orders_customer_idx").on(t.customerId), index("orders_created_idx").on(t.createdAt)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
    productName: text("product_name").notNull(),
    variantLabel: text("variant_label").notNull().default(""),
    sku: text("sku").notNull().default(""),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    lineTotal: integer("line_total").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export const orderStatusHistory = pgTable(
  "order_status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    fromStatus: text("from_status").$type<OrderStatus>(),
    toStatus: text("to_status").$type<OrderStatus>().notNull(),
    note: text("note").notNull().default(""),
    createdAt: createdAt(),
  },
  (t) => [index("order_status_history_order_idx").on(t.orderId)],
);

export const productReviews = pgTable(
  "product_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    authorName: text("author_name").notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment").notNull().default(""),
    status: text("status").$type<ReviewStatus>().notNull().default("pending"),
    createdAt: createdAt(),
  },
  (t) => [
    unique("product_reviews_order_product_uq").on(t.orderId, t.productId),
    index("product_reviews_product_idx").on(t.productId, t.status),
    check("product_reviews_rating_range", sql`${t.rating} between 1 and 5`),
  ],
);

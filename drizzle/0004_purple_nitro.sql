ALTER TABLE "product_reviews" ALTER COLUMN "order_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD COLUMN "source" text DEFAULT 'order' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD COLUMN "reviewed_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
UPDATE "product_reviews" SET "reviewed_at" = "created_at";

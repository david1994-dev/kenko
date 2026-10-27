"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/db";
import { reviewStatuses } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export async function setReviewStatus(data: FormData) {
  await requireAdmin();
  const id = z.uuid().parse(data.get("id"));
  const status = z.enum(reviewStatuses).parse(data.get("status"));
  await db.update(schema.productReviews).set({ status }).where(eq(schema.productReviews.id, id));
  updateTag("catalog");
  revalidatePath("/admin/reviews");
}

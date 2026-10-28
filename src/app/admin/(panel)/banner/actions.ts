"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { removeImage, saveImage } from "@/lib/image-storage";

const { siteSettings } = schema;

export type BannerState = { ok?: boolean; message?: string };

async function setting(key: string) {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
  return row?.value;
}

async function put(key: string, value: string) {
  await db
    .insert(siteSettings)
    .values({ key, value })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } });
}

function refresh() {
  updateTag("catalog");
  revalidatePath("/admin/banner");
}

export async function saveBanner(_prev: BannerState, data: FormData): Promise<BannerState> {
  await requireAdmin();
  const alt = String(data.get("alt") ?? "").trim().slice(0, 200);
  const file = data.get("image");
  const hasFile = file instanceof File && file.size > 0;

  const current = await setting("hero_image");
  if (!hasFile && !current) return { message: "Vui lòng chọn ảnh banner." };

  if (hasFile) {
    let url: string;
    try {
      url = await saveImage(file, "hero", "banners");
    } catch (e) {
      return { message: e instanceof Error ? e.message : "Không tải được ảnh." };
    }
    await put("hero_image", url);
    if (current) await removeImage(current);
  }
  await put("hero_alt", alt);
  refresh();
  return { ok: true, message: hasFile ? "Đã đăng ảnh banner." : "Đã lưu mô tả ảnh." };
}

export async function removeBanner() {
  await requireAdmin();
  const current = await setting("hero_image");
  await db.delete(siteSettings).where(inArray(siteSettings.key, ["hero_image", "hero_alt"]));
  if (current) await removeImage(current);
  refresh();
}

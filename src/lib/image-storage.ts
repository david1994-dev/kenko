import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

// Kho Blob mới xác thực bằng OIDC (BLOB_STORE_ID), kho cũ dùng BLOB_READ_WRITE_TOKEN.
const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function sniff(bytes: Uint8Array): string | null {
  const at = (i: number) => bytes[i];
  if (at(0) === 0xff && at(1) === 0xd8 && at(2) === 0xff) return "image/jpeg";
  if (at(0) === 0x89 && at(1) === 0x50 && at(2) === 0x4e && at(3) === 0x47) return "image/png";
  const tag = (s: string, o: number) => [...s].every((c, i) => at(o + i) === c.charCodeAt(0));
  if (tag("RIFF", 0) && tag("WEBP", 8)) return "image/webp";
  return null;
}

export async function saveImage(file: File, slug: string, folder: "products" | "reviews" = "products"): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) throw new Error(`${file.name}: ảnh lớn hơn 4 MB.`);
  const buffer = new Uint8Array(await file.arrayBuffer());
  const type = sniff(buffer);
  if (!type) throw new Error(`${file.name}: chỉ nhận ảnh JPG, PNG hoặc WebP.`);

  const name = `${randomUUID()}.${EXT[type]}`;

  if (hasBlob()) {
    const blob = await put(`${folder}/${slug}/${name}`, Buffer.from(buffer), { access: "public", contentType: type });
    return blob.url;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("Chưa kết nối Vercel Blob (thiếu BLOB_STORE_ID hoặc BLOB_READ_WRITE_TOKEN).");
  }

  // Chỉ dùng khi chạy local mà chưa có token Blob.
  const sub = folder === "products" ? slug : `${folder}/${slug}`;
  const dir = path.join(process.cwd(), "public", "uploads", sub);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);
  return `/uploads/${sub}/${name}`;
}

export async function removeImage(url: string) {
  try {
    if (url.startsWith("/uploads/") && !url.includes("..")) {
      await unlink(path.join(process.cwd(), "public", url));
    } else if (hasBlob()) {
      await del(url);
    }
  } catch {
    // Ảnh đã xoá hoặc không còn trên kho lưu trữ thì bỏ qua.
  }
}

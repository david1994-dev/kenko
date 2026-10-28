// Thu nhỏ ảnh trong trình duyệt trước khi gửi: ảnh chụp điện thoại thường vài MB, vượt giới hạn 4 MB của máy chủ.
export async function shrinkImage(file: File, maxSide = 1280, quality = 0.82): Promise<File> {
  if (file.type === "image/jpeg" && file.size <= 400_000) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
  if (!blob) throw new Error("toBlob");
  return new File([blob], `${file.name.replace(/\.\w+$/, "")}.jpg`, { type: "image/jpeg" });
}

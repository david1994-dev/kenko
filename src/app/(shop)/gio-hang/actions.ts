"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createOrder, OrderError } from "@/lib/orders";

export type OrderFormState = {
  errors?: Partial<Record<"name" | "phone" | "address" | "note", string>>;
  message?: string;
  values?: Record<string, string>;
};

const schema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ và tên.").max(80, "Họ tên quá dài."),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0"))
    .pipe(z.string().regex(/^0\d{9,10}$/, "Số điện thoại chưa đúng.")),
  address: z.string().trim().min(5, "Vui lòng nhập địa chỉ nhận hàng.").max(200, "Địa chỉ quá dài."),
  note: z.string().trim().max(500, "Ghi chú tối đa 500 ký tự."),
});

const itemsSchema = z
  .array(z.object({ variantId: z.uuid(), qty: z.number().int().min(1).max(20) }))
  .min(1)
  .max(30);

const text = (data: FormData, key: string) => String(data.get(key) ?? "");

export async function placeOrder(_prev: OrderFormState, data: FormData): Promise<OrderFormState> {
  const values = Object.fromEntries(
    ["name", "phone", "address", "note"].map((k) => [k, text(data, k)]),
  );

  // Ô ẩn dành cho bot: người thật không nhìn thấy nên không điền.
  if (text(data, "website")) return { values, message: "Không thể gửi đơn hàng." };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const errors: NonNullable<OrderFormState["errors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof errors;
      errors[key] ??= issue.message;
    }
    return { values, errors };
  }

  let items;
  try {
    items = itemsSchema.parse(JSON.parse(text(data, "items")));
  } catch {
    return { values, message: "Giỏ hàng không hợp lệ. Vui lòng thêm lại sản phẩm." };
  }

  let result;
  try {
    result = await createOrder({ ...parsed.data, province: "", district: "", items });
  } catch (e) {
    if (e instanceof OrderError) return { values, message: e.message };
    console.error(e);
    return { values, message: "Không gửi được đơn hàng. Vui lòng thử lại hoặc gọi hotline." };
  }

  if (result.touchedStock) updateTag("catalog");
  redirect(`/dat-hang-thanh-cong?code=${result.code}`);
}

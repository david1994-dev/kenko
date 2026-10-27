"use server";

import { redirect } from "next/navigation";
import { endSession, passwordMatches, startSession } from "@/lib/admin-auth";

export type LoginState = { message?: string };

export async function login(_prev: LoginState, data: FormData): Promise<LoginState> {
  const ok = passwordMatches(String(data.get("password") ?? ""));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800));
    return { message: "Mật khẩu không đúng." };
  }
  await startSession();
  redirect("/admin/orders");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

import type { Metadata } from "next";
import Image from "next/image";
import { inArray } from "drizzle-orm";
import { AdminBannerForm } from "@/components/admin-banner-form";
import { Card } from "@/components/admin-ui";
import { SubmitButton } from "@/components/submit-button";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { removeBanner } from "./actions";

export const instant = false;

export const metadata: Metadata = { title: "Banner" };

export default async function Page() {
  await requireAdmin();
  const rows = await db
    .select()
    .from(schema.siteSettings)
    .where(inArray(schema.siteSettings.key, ["hero_image", "hero_alt"]));
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const url = map.get("hero_image");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Banner trang chủ</h1>
      <Card title="Ảnh hiện tại">
        {url ? (
          <div className="flex flex-wrap items-start gap-4">
            <div className="relative aspect-[3/4] w-48 overflow-hidden rounded-2xl bg-mist">
              <Image src={url} alt={map.get("hero_alt") ?? ""} fill sizes="192px" className="object-cover" />
            </div>
            <form action={removeBanner}>
              <SubmitButton
                pendingLabel="Đang gỡ…"
                className="h-11 rounded-lg border border-edge px-4 text-sm font-semibold text-price hover:bg-[#fdeee6]"
              >
                Gỡ ảnh banner
              </SubmitButton>
              <p className="mt-2 max-w-xs text-xs text-subtle">Gỡ xong, trang chủ hiện khung trống cho tới khi bạn đăng ảnh mới.</p>
            </form>
          </div>
        ) : (
          <p className="text-sm text-muted">Chưa có ảnh banner. Trang chủ đang hiện khung trống.</p>
        )}
      </Card>
      <Card title={url ? "Thay ảnh" : "Đăng ảnh banner"}>
        <AdminBannerForm hasImage={Boolean(url)} alt={map.get("hero_alt") ?? ""} />
      </Card>
    </div>
  );
}

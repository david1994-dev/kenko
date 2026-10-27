import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { ProseBlock } from "@/components/ui";
import { sizeChart } from "@/data/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hướng dẫn chọn size áo điều hoà",
  description: "Bảng quy đổi chiều cao, cân nặng, rộng vai, vòng ngực, dài thân sang size áo dài tay KENKO.",
  alternates: { canonical: "/huong-dan-chon-size" },
};

export default function Page() {
  return (
    <ContentPage
      title="Hướng dẫn chọn size áo điều hoà"
      lead="Chọn theo chiều cao và cân nặng, đối chiếu thêm số đo áo nếu cần."
      crumbs={[{ name: "Hướng dẫn chọn size", href: "/huong-dan-chon-size" }]}
    >
      <h2 className="text-lg font-bold">{sizeChart.title}</h2>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-brand text-ink">
            <tr>
              {sizeChart.head.map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeChart.rows.map((row) => (
              <tr key={row[0]} className="border-t border-line even:bg-ground">
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="px-4 py-3 font-bold">
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className="px-4 py-3">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProseBlock title="Lưu ý khi chọn size">
        <ul className="list-disc space-y-1 pl-5">
          {sizeChart.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-3">
          Cần chắc chắn hơn? Anh/chị gửi chiều cao và cân nặng qua{" "}
          <a href={site.zaloHref} className="font-semibold text-navy underline">
            Zalo
          </a>{" "}
          hoặc gọi{" "}
          <a href={site.hotlineHref} className="font-semibold text-navy underline">
            {site.hotline}
          </a>
          , shop sẽ tư vấn size chuẩn nhất theo form người.
        </p>
      </ProseBlock>
    </ContentPage>
  );
}

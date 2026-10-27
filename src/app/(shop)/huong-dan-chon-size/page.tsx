import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { sizeChart } from "@/data/content";

export const metadata: Metadata = {
  title: "Hướng dẫn chọn size áo điều hoà",
  description: "Bảng quy đổi chiều cao, cân nặng sang size áo điều hoà KENKO.",
  alternates: { canonical: "/huong-dan-chon-size" },
};

export default function Page() {
  return (
    <ContentPage
      title="Hướng dẫn chọn size áo điều hoà"
      lead="Chọn theo chiều cao và cân nặng. Nếu mặc nhiều lớp bên trong, nên lấy lớn hơn một size."
      crumbs={[{ name: "Hướng dẫn chọn size", href: "/huong-dan-chon-size" }]}
    >
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-ground">
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
              <tr key={row[0]} className="border-t border-line">
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
    </ContentPage>
  );
}

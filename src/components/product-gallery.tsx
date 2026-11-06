"use client";

import Image from "next/image";
import { ImagePlaceholder } from "./ui";
import { useColor } from "./product-color";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  colorNames,
  name,
  badge,
}: {
  images: ProductImage[];
  colorNames: string[];
  name: string;
  badge?: React.ReactNode;
}) {
  const { color, pickedId, setPickedId } = useColor();

  // Ảnh nhỏ bên dưới chỉ là ảnh chung của sản phẩm; ảnh theo màu chỉ hiện ở ảnh lớn khi chọn màu.
  const general = images.filter((i) => !i.colorName || !colorNames.includes(i.colorName));
  const chosen = pickedId ? images.find((i) => i.id === pickedId) : undefined;
  const forColor = color ? images.find((i) => i.colorName === color) : undefined;
  const main = chosen ?? forColor ?? general[0] ?? images[0];
  const showThumbs = general.length > 1 || (general.length === 1 && main?.id !== general[0].id);

  return (
    <div>
      {main ? (
        <div className="relative aspect-square w-full overflow-hidden bg-mist max-md:-mx-4 max-md:!w-[calc(100%+2rem)] md:rounded-xl">
          <Image
            key={main.id}
            src={main.url}
            alt={main.alt || name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          {badge}
        </div>
      ) : (
        <ImagePlaceholder
          label="Ảnh sản phẩm"
          className="!rounded-none md:!rounded-xl max-md:-mx-4 max-md:!w-[calc(100%+2rem)]"
        >
          {badge}
        </ImagePlaceholder>
      )}
      {showThumbs && (
        <ul className="mt-2 grid grid-cols-5 gap-2">
          {general.slice(0, 10).map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setPickedId(img.id)}
                aria-label={`Xem ảnh ${i + 1}`}
                aria-pressed={img.id === pickedId}
                className={`relative block aspect-square w-full overflow-hidden rounded-lg bg-mist ring-2 ${
                  img.id === pickedId ? "ring-navy" : "ring-transparent"
                }`}
              >
                <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

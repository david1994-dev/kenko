"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlaceholder } from "./ui";
import { useColor } from "./product-color";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  name,
  badge,
}: {
  images: ProductImage[];
  name: string;
  badge?: React.ReactNode;
}) {
  const { color } = useColor();
  const [pick, setPick] = useState<{ color: string | null; id: string } | null>(null);

  const chosen = pick && pick.color === color ? images.find((i) => i.id === pick.id) : undefined;
  const forColor = color ? images.find((i) => i.colorName === color) : undefined;
  const main = chosen ?? forColor ?? images[0];

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
      {images.length > 1 && (
        <ul className="mt-2 grid grid-cols-5 gap-2">
          {images.slice(0, 10).map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setPick({ color, id: img.id })}
                aria-label={img.colorName ? `Xem ảnh màu ${img.colorName}` : `Xem ảnh ${i + 1}`}
                aria-pressed={img.id === main?.id}
                className={`relative block aspect-square w-full overflow-hidden rounded-lg bg-mist ring-2 ${
                  img.id === main?.id ? "ring-navy" : "ring-transparent"
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

"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/types/base44";

export function ProductGallery({ images, title }: { images: ProductImage[]; title: string }) {
  const safeImages = images.length ? images : [];
  const [active, setActive] = useState(0);
  const image = safeImages[active];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-container-low">
        {image?.url ? (
          <Image src={image.url} alt={image.alt || title} fill priority className="object-cover" />
        ) : null}
      </div>
      {safeImages.length > 1 ? (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {safeImages.map((item, index) => (
            <button
              key={`${item.url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-square overflow-hidden rounded-md border ${
                active === index ? "border-primary" : "border-surface-container-high"
              }`}
              aria-label={`Show image ${index + 1}`}
            >
              <Image src={item.url} alt={item.alt || title} fill className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

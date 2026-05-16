import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { BlogPost } from "@/types/base44";

export function productPrice(product: BlogPost) {
  return product.sale_price ?? product.price ?? 0;
}

export function ProductCard({ product }: { product: BlogPost }) {
  const image = product.product_images?.[0] || {
    url: product.featured_image_url,
    alt: product.title,
  };

  return (
    <Link
      href={`/producten/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-surface-container-high bg-surface-container-low transition hover:border-primary/60"
    >
      <div className="relative aspect-square bg-surface-container">
        {image.url ? (
          <Image
            src={image.url}
            alt={image.alt || product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-primary">{product.vendor || product.product_type || "4x4 Models"}</p>
        <h3 className="mt-2 font-headline text-lg font-bold text-on-surface">{product.title}</h3>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-label text-base font-bold text-secondary">{formatCurrency(productPrice(product))}</span>
          {product.sale_price && product.price ? (
            <span className="text-sm text-on-surface-variant line-through">{formatCurrency(product.price)}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

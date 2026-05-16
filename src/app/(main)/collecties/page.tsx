import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/base44-data";

export const revalidate = 60;

export default async function CollectionsPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-14">
      <h1 className="font-headline text-4xl font-bold uppercase md:text-5xl">Collections</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/collecties/${category.slug}`} className="group overflow-hidden rounded-lg border border-surface-container-high bg-surface-container-low">
            <div className="relative aspect-video bg-surface-container">
              {category.featured_image_url ? <Image src={category.featured_image_url} alt={category.name} fill className="object-cover transition group-hover:scale-105" /> : null}
            </div>
            <div className="p-6">
              <h2 className="font-headline text-xl font-bold">{category.name}</h2>
              {category.description ? <p className="mt-2 text-sm text-on-surface-variant">{category.description}</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";

export default async function LegacyTagPage({ params }: PageProps<"/tags/[slug]">) {
  const { slug } = await params;
  redirect(`/en/tags/${slug}`);
}

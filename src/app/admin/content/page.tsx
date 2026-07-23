import { notFound, redirect } from "next/navigation";
import AdminContentEditor from "@/components/admin/AdminContentEditor";
import { getAuthSession } from "@/lib/auth/casdoor";
import {
  getCmsEditorPage,
  listCmsEditorPages,
} from "@/lib/services/cms-editor";

export const dynamic = "force-dynamic";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const session = await getAuthSession();
  if (!session) redirect("/api/auth/login?returnTo=/admin/content");
  if (session.user.role !== "admin") notFound();

  const params = await searchParams;
  const slug = params.slug?.replace(/^\/+|\/+$/g, "") || "home";
  const [page, pages] = await Promise.all([
    getCmsEditorPage(slug),
    listCmsEditorPages(),
  ]);

  if (!page) notFound();

  return (
    <AdminContentEditor
      initialPage={page}
      pages={pages.map((record) => ({
        id: record.id,
        slug: record.slug,
        title: record.title,
        locale: record.locale,
        status: record.status,
        seo_score: record.seo_score,
        updated_date: record.updated_date,
      }))}
    />
  );
}

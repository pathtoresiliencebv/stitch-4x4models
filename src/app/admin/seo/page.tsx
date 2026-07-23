import { notFound, redirect } from "next/navigation";
import AdminSeoManager from "@/components/admin/AdminSeoManager";
import { getAuthSession } from "@/lib/auth/casdoor";
import { base44List } from "@/lib/base44-api";
import type {
  SearchConsoleQuery,
  SearchConsoleSnapshot,
  SeoAuditIssue,
  SeoTask,
  WebsitePage,
} from "@/types/base44";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const session = await getAuthSession();
  if (!session) redirect("/api/auth/login?returnTo=/admin/seo");
  if (session.user.role !== "admin") notFound();

  const [pages, tasks, issues, snapshots, queries] = await Promise.all([
    base44List<WebsitePage & { updated_date?: string }>("WebsitePage", {
      limit: 500,
      sort_by: "slug",
    }),
    base44List<SeoTask>("SeoTask", {
      limit: 500,
      sort_by: "-created_date",
    }),
    base44List<SeoAuditIssue>("SeoAuditIssue", {
      limit: 500,
      sort_by: "-created_date",
    }),
    base44List<SearchConsoleSnapshot>("SearchConsoleSnapshot", {
      limit: 20,
      sort_by: "-synced_at",
    }),
    base44List<SearchConsoleQuery>("SearchConsoleQuery", {
      limit: 500,
      sort_by: "-opportunity_score",
    }),
  ]);

  return (
    <AdminSeoManager
      initialPages={pages.records}
      initialTasks={tasks.records}
      initialIssues={issues.records}
      initialSnapshot={snapshots.records[0] || null}
      initialQueries={queries.records}
    />
  );
}

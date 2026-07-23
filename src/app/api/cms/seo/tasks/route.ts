import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/auth/admin-api";
import { base44Fetch, base44List } from "@/lib/base44-api";
import type { SeoAuditIssue, SeoTask } from "@/types/base44";

export async function PUT(request: NextRequest) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const body = (await request.json()) as {
      entity?: "SeoTask" | "SeoAuditIssue";
      id?: string;
      status?: string;
      scheduled_date?: string;
      due_date?: string;
    };
    if (!body.id || !body.entity || !["SeoTask", "SeoAuditIssue"].includes(body.entity)) {
      return NextResponse.json({ error: "Invalid SEO mutation" }, { status: 400 });
    }
    const allowedTaskStatuses = ["todo", "in_progress", "ready", "scheduled", "done"];
    const allowedIssueStatuses = ["open", "in_progress", "fixed", "ignored"];
    const allowed = body.entity === "SeoTask" ? allowedTaskStatuses : allowedIssueStatuses;
    if (!body.status || !allowed.includes(body.status)) {
      return NextResponse.json({ error: "Unsupported SEO status" }, { status: 400 });
    }

    const payload = body.entity === "SeoTask"
      ? {
          status: body.status,
          scheduled_date: body.status === "scheduled" ? body.scheduled_date || new Date().toISOString() : undefined,
          due_date: body.due_date || undefined,
        }
      : { status: body.status };
    const record = await base44Fetch<SeoTask | SeoAuditIssue>(`/entities/${body.entity}/${body.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin");
    revalidatePath("/admin/seo");
    return NextResponse.json({ ok: true, record });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "SEO update failed",
    }, { status: 500 });
  }
}

export async function GET() {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  const [tasks, issues] = await Promise.all([
    base44List<SeoTask>("SeoTask", { limit: 500, sort_by: "-created_date" }),
    base44List<SeoAuditIssue>("SeoAuditIssue", { limit: 500, sort_by: "-created_date" }),
  ]);
  return NextResponse.json({ tasks: tasks.records, issues: issues.records });
}

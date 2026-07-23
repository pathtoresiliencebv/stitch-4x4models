"use client";

import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  SearchCheck,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  SearchConsoleQuery,
  SearchConsoleSnapshot,
  SeoAuditIssue,
  SeoTask,
  WebsitePage,
} from "@/types/base44";

type SeoPage = WebsitePage & { updated_date?: string };

function scoreTone(score?: number) {
  if (typeof score !== "number") return "bg-stone-100 text-stone-700";
  if (score >= 82) return "bg-emerald-100 text-emerald-800";
  if (score >= 65) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

export default function AdminSeoManager({
  initialPages,
  initialTasks,
  initialIssues,
  initialSnapshot,
  initialQueries,
}: {
  initialPages: SeoPage[];
  initialTasks: SeoTask[];
  initialIssues: SeoAuditIssue[];
  initialSnapshot: SearchConsoleSnapshot | null;
  initialQueries: SearchConsoleQuery[];
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [issues, setIssues] = useState(initialIssues);
  const [query, setQuery] = useState("");
  const [workingId, setWorkingId] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const visiblePages = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return initialPages
      .filter((page) => !needle || `${page.title} ${page.slug} ${page.focus_keyword || ""}`.toLowerCase().includes(needle))
      .sort((a, b) => (a.seo_score || 0) - (b.seo_score || 0));
  }, [initialPages, query]);

  async function updateSeoRecord(
    entity: "SeoTask" | "SeoAuditIssue",
    id: string,
    status: string,
    scheduledDate?: string,
  ) {
    setWorkingId(id);
    setError("");
    const response = await fetch("/api/cms/seo/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity,
        id,
        status,
        scheduled_date: scheduledDate,
      }),
    });
    const result = (await response.json()) as {
      record?: SeoTask | SeoAuditIssue;
      error?: string;
    };
    if (!response.ok || !result.record) {
      setError(result.error || "SEO-status kon niet worden opgeslagen.");
      setWorkingId("");
      return;
    }
    if (entity === "SeoTask") {
      setTasks((current) => current.map((record) => record.id === id ? result.record as SeoTask : record));
    } else {
      setIssues((current) => current.map((record) => record.id === id ? result.record as SeoAuditIssue : record));
    }
    setMessage("SEO-planning bijgewerkt.");
    setWorkingId("");
  }

  async function syncSearchConsole() {
    setSyncing(true);
    setError("");
    setMessage("");
    const response = await fetch("/api/cms/seo/search-console", { method: "POST" });
    const result = (await response.json()) as {
      result?: { queryCount: number; pageCount: number; clicks: number; impressions: number };
      error?: string;
    };
    if (!response.ok || !result.result) {
      setError(result.error || "Search Console sync is mislukt.");
    } else {
      setMessage(
        `Search Console bijgewerkt: ${result.result.queryCount} zoekopdrachten, ${result.result.pageCount} pagina's, ${result.result.clicks} klikken en ${result.result.impressions} vertoningen.`,
      );
      window.setTimeout(() => window.location.reload(), 800);
    }
    setSyncing(false);
  }

  return (
    <main className="min-h-screen bg-[#f3eee5] text-[#171411]">
      <header className="border-b border-[#ded5c8] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-5 sm:px-8">
          <Link className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#ddd4c7] text-[#675f55] hover:border-[#a3681a] hover:text-[#a3681a]" href="/admin">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a3681a]">SEO tools</p>
            <h1 className="mt-1 text-2xl font-semibold">Scores, planning en echte zoekdata</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-md bg-[#171411] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#a3681a] disabled:opacity-60" disabled={syncing} onClick={syncSearchConsole} type="button">
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {syncing ? "Synchroniseren..." : "Search Console sync"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-5 py-6 sm:px-8">
        {error ? <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}
        {message ? <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{message}</div> : null}

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-[#d8cfc0] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#675f55]">Gemiddelde score</p>
            <p className="mt-2 text-4xl font-semibold">{Math.round(initialPages.reduce((sum, page) => sum + (page.seo_score || 0), 0) / Math.max(1, initialPages.length))}</p>
          </div>
          <div className="rounded-lg border border-[#d8cfc0] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#675f55]">Open taken</p>
            <p className="mt-2 text-4xl font-semibold">{tasks.filter((task) => !["done", "ready"].includes(task.status || "")).length}</p>
          </div>
          <div className="rounded-lg border border-[#d8cfc0] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#675f55]">Auditpunten</p>
            <p className="mt-2 text-4xl font-semibold">{issues.filter((issue) => !["fixed", "ignored"].includes(issue.status || "")).length}</p>
          </div>
          <div className="rounded-lg border border-[#d8cfc0] bg-[#171411] p-5 text-white shadow-sm">
            <p className="text-sm text-white/60">Search Console</p>
            <p className="mt-2 text-4xl font-semibold">{initialSnapshot?.clicks || 0}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#d3a35b]">klikken laatste sync</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]">
          <div className="overflow-hidden rounded-lg border border-[#d8cfc0] bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-4 border-b border-[#eee7db] bg-[#fbfaf7] p-5">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a3681a]">{initialPages.length} pagina&apos;s</p>
                <h2 className="mt-1 text-xl font-semibold">SEO per pagina</h2>
              </div>
              <label className="flex min-w-64 items-center gap-2 rounded-md border border-[#d8cfc0] bg-white px-3 py-2">
                <Search className="h-4 w-4 text-[#8c8174]" />
                <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" onChange={(event) => setQuery(event.target.value)} placeholder="Zoek pagina..." type="search" value={query} />
              </label>
            </div>
            <div className="max-h-[54rem] divide-y divide-[#eee7db] overflow-y-auto">
              {visiblePages.map((page) => (
                <div className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center" key={page.id}>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{page.title}</p>
                    <p className="mt-1 truncate text-xs text-[#8c8174]">/{page.slug === "home" ? "" : page.slug} · {page.focus_keyword || "geen zoekwoord"}</p>
                  </div>
                  <span className={`justify-self-start rounded-full px-3 py-1 text-xs font-bold ${scoreTone(page.seo_score)}`}>{page.seo_score ?? 0}/100</span>
                  <a className="inline-flex items-center gap-1.5 text-sm font-bold text-[#a3681a] hover:text-[#171411]" href={`/admin/content?slug=${encodeURIComponent(page.slug)}`}>
                    Bewerken
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-[#d8cfc0] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <CalendarClock className="h-5 w-5 text-[#a3681a]" />
                <div>
                  <p className="font-semibold">SEO-planning</p>
                  <p className="text-sm text-[#675f55]">Zet werk klaar, plan het in of markeer het als afgerond.</p>
                </div>
              </div>
              <div className="space-y-3">
                {tasks.slice(0, 12).map((task) => (
                  <div className="rounded-md border border-[#eee7db] bg-[#fbfaf7] p-3" key={task.id}>
                    <div className="flex items-start gap-3">
                      <SearchCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#a3681a]" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{task.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#675f55]">{task.recommendation}</p>
                      </div>
                      {workingId === task.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                      <select
                        className="rounded border border-[#d8cfc0] bg-white px-2 py-2 text-xs font-semibold"
                        onChange={(event) => updateSeoRecord("SeoTask", task.id, event.target.value)}
                        value={task.status || "todo"}
                      >
                        <option value="todo">Te doen</option>
                        <option value="in_progress">Mee bezig</option>
                        <option value="ready">Klaar voor publicatie</option>
                        <option value="scheduled">Ingepland</option>
                        <option value="done">Afgerond</option>
                      </select>
                      <a className="rounded border border-[#d8cfc0] bg-white px-3 py-2 text-center text-xs font-bold text-[#a3681a]" href={`/admin/content?slug=${encodeURIComponent(task.page_slug || "home")}`}>Open pagina</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#d8cfc0] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <TriangleAlert className="h-5 w-5 text-[#a3681a]" />
                <p className="font-semibold">Auditpunten</p>
              </div>
              <div className="space-y-3">
                {issues.filter((issue) => !["fixed", "ignored"].includes(issue.status || "")).slice(0, 12).map((issue) => (
                  <div className="rounded-md border border-[#eee7db] p-3" key={issue.id}>
                    <p className="text-sm font-semibold">{issue.title}</p>
                    <p className="mt-1 text-xs leading-5 text-[#675f55]">{issue.recommendation}</p>
                    <div className="mt-3 flex gap-2">
                      <button className="inline-flex items-center gap-1.5 rounded bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100" onClick={() => updateSeoRecord("SeoAuditIssue", issue.id, "fixed")} type="button">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Opgelost
                      </button>
                      <button className="rounded bg-stone-100 px-2.5 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-200" onClick={() => updateSeoRecord("SeoAuditIssue", issue.id, "ignored")} type="button">
                        Negeren
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[#d8cfc0] bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a3681a]">Echte zoekprestaties</p>
              <h2 className="mt-1 text-xl font-semibold">Search Console kansen</h2>
            </div>
            <p className="text-sm text-[#675f55]">
              {initialSnapshot
                ? `${initialSnapshot.impressions || 0} vertoningen · gemiddelde positie ${Number(initialSnapshot.position || 0).toFixed(1)}`
                : "Nog geen Search Console-snapshot. Gebruik de syncknop na het koppelen van Google in Maton."}
            </p>
          </div>
          {initialQueries.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[#f3eee5] text-xs uppercase tracking-[0.12em] text-[#675f55]">
                  <tr>
                    <th className="px-3 py-3">Zoekopdracht / pagina</th>
                    <th className="px-3 py-3">Klikken</th>
                    <th className="px-3 py-3">Vertoningen</th>
                    <th className="px-3 py-3">Positie</th>
                    <th className="px-3 py-3">Kans</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee7db]">
                  {initialQueries.slice(0, 25).map((record) => (
                    <tr key={record.id}>
                      <td className="max-w-md truncate px-3 py-3 font-semibold">{record.query || record.page_url}</td>
                      <td className="px-3 py-3">{record.clicks || 0}</td>
                      <td className="px-3 py-3">{record.impressions || 0}</td>
                      <td className="px-3 py-3">{Number(record.position || 0).toFixed(1)}</td>
                      <td className="px-3 py-3"><span className="rounded bg-amber-50 px-2 py-1 font-bold text-amber-800">{record.opportunity_score || 0}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-[#d8cfc0] bg-[#fbfaf7] px-5 py-10 text-center text-sm text-[#675f55]">
              Geen zoekdata geladen. De syncknop geeft precies aan of de Maton Google-verbinding nog ontbreekt.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

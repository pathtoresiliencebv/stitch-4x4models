// Re-exports for server-only helpers that can be used from route handlers
// without pulling in the whole google-services surface (which has GA4 props
// that some handlers don't need).
export {
  matonGet,
  matonSend,
  hasMatonKey,
} from "@/lib/maton";
export {
  submitGscSitemap,
  listGscSitemaps,
  querySearchAnalytics,
  getGscSite,
  listGscSites,
} from "@/lib/google-services";
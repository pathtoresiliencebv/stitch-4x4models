import { createClient } from "@base44/sdk";

export const base44 = createClient({
  appId: process.env.NEXT_PUBLIC_BASE44_APP_ID || "6a09fd6a73c15fa19aeb41f8",
});

export default base44;

import { createClient } from "@base44/sdk";

export const base44 = createClient({
  appId: process.env.NEXT_PUBLIC_BASE44_APP_ID || "699871557dfcaafa02868052",
});

export default base44;

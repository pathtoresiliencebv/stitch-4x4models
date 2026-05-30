"use client";

import "@puckeditor/core/puck.css";
import { Puck } from "@puckeditor/core";
import { useRouter, useSearchParams } from "next/navigation";
import { puckConfig, type PuckMetadata } from "@/lib/puck/config";
import type { PuckPageData } from "@/types/puck";

export default function PuckEditorClient({
  initialData,
  metadata,
  page,
  locale,
}: {
  initialData: PuckPageData;
  metadata: PuckMetadata;
  page: string;
  locale: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="h-screen w-screen bg-white text-black">
      <Puck
        config={puckConfig}
        data={initialData}
        metadata={metadata}
        height="100dvh"
        headerTitle={`${page} / ${locale}`}
        headerPath={`/${locale}/${page === "home" ? "" : page}`}
        onPublish={async (data) => {
          const response = await fetch(`/api/cms/puck?page=${page}&locale=${locale}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data }),
          });

          if (!response.ok) {
            throw new Error("Could not publish page to the CMS");
          }

          router.refresh();
          const returnTo = searchParams.get("returnTo");
          if (returnTo) window.open(returnTo, "_blank");
        }}
        iframe={{ enabled: false }}
      />
    </div>
  );
}

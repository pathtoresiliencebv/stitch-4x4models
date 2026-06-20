import { Render } from "@puckeditor/core/rsc";
import MotionPage from "@/components/MotionPage";
import { puckConfig, type PuckMetadata } from "@/lib/puck/config";
import type { PuckPageData } from "@/types/puck";

export default function PuckPageRenderer({
  data,
  metadata,
}: {
  data: PuckPageData;
  metadata: PuckMetadata;
}) {
  return (
    <MotionPage>
      <Render config={puckConfig} data={data} metadata={metadata} />
    </MotionPage>
  );
}

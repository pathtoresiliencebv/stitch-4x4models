import type { Data } from "@puckeditor/core";
import type { PuckComponents, PuckRootProps } from "@/lib/puck/config";

export type PuckPageData = Data<PuckComponents, PuckRootProps>;

export type ManagedPage = "home" | "vehicles" | "journal" | "gear";

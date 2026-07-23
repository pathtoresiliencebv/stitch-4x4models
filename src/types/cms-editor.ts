import type { WebsiteCard, WebsitePage, WebsiteSection } from "@/types/base44";

export type CmsEditorCard = Omit<WebsiteCard, "id"> & {
  id?: string;
  editor_key?: string;
};

export type CmsEditorSection = Omit<WebsiteSection, "id"> & {
  id?: string;
  editor_key?: string;
  cards: CmsEditorCard[];
};

export type CmsEditorPage = WebsitePage & {
  updated_date?: string;
  sections: CmsEditorSection[];
};

export type CmsEditorMutation = {
  page: Pick<
    WebsitePage,
    | "id"
    | "title"
    | "slug"
    | "status"
    | "locale"
    | "seo_title"
    | "meta_description"
    | "focus_keyword"
    | "secondary_keywords"
    | "canonical_url"
    | "featured_image_url"
  >;
  sections: CmsEditorSection[];
  archiveMissing?: boolean;
};

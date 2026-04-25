export interface PreviewDoc {
  _id: string;
  _type: string;
  _updatedAt?: string;
  /** Sanity's original document id, including `drafts.` prefix when the doc is a draft. */
  _originalId?: string;
}

export interface PreviewBannerProps {
  doc: PreviewDoc;
}

export default null;

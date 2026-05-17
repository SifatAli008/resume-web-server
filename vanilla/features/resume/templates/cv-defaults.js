/** Default portrait for templates that commonly include a photo (EU / Asia style). */
export const DEFAULT_CV_PHOTO_URL =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256&q=80";

/**
 * Templates where a profile photo is typical (sidebar / international layouts).
 * User can still turn photo off via "Include profile photo" on any template.
 */
export const PHOTO_DEFAULT_TEMPLATE_IDS = new Set([2, 4, 7, 10, 14, 18, 20]);

export function tplIdFromTemplateId(templateId) {
  const m = /^resume_fluvo_(\d+)$/.exec(String(templateId || ""));
  return m ? Number(m[1]) : 1;
}

export function templateWantsPhotoByDefault(tplId) {
  return PHOTO_DEFAULT_TEMPLATE_IDS.has(Number(tplId));
}

/**
 * @param {"load" | "switch"} mode
 * - load: respect saved showPhoto; only fill default image URL when photo is on
 * - switch: when entering a photo-friendly template, turn photo on + default image
 */
export function applyTemplatePhotoDefaults(draft, templateId, mode = "switch") {
  const n = tplIdFromTemplateId(templateId);
  if (!templateWantsPhotoByDefault(n)) return draft;

  const url = String(draft.photoUrl || "").trim();

  if (mode === "load") {
    if (!draft.showPhoto) return draft;
    return { ...draft, photoUrl: url || DEFAULT_CV_PHOTO_URL };
  }

  return {
    ...draft,
    showPhoto: true,
    photoUrl: url || DEFAULT_CV_PHOTO_URL,
  };
}

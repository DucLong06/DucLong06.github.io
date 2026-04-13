/**
 * featured-projects-order.ts
 * Explicit slug ordering for the bento grid — deterministic, not date-sorted.
 * First entry (face-detection-ml-system) spans 2 cols as the hero card.
 */
export const FEATURED_ORDER = [
  'face-detection-ml-system',
  'booking-duongcam-art',
  'legal-prompts',
  'alqac-2023',
  'text2sql-vietnamese',
  'ocr-api',
] as const;

export type FeaturedSlug = typeof FEATURED_ORDER[number];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const ALLOWED_INVOICE_TYPES = [
  ...ALLOWED_FILE_TYPES,
  "application/pdf",
];

export const PHOTO_DOCUMENT_TYPES = [
  "membership_photo_1",
  "membership_photo_2",
  "membership_photo_3",
] as const;

export const PAYMENT_INVOICE_TYPE = "payment_invoice";
export const MEMBERSHIP_ID_CARD_TYPE = "membership_id_card";
export const STAMPED_INVOICE_TYPE = "stamped_invoice";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export const FILE_FIELD_MAP = {
  nationalId: "national_id",
  businessLicense: "business_license",
  cocCertificate: "coc_certificate",
  workExperience: "work_experience",
  photo1: "membership_photo_1",
  photo2: "membership_photo_2",
} as const;

export type FileField = keyof typeof FILE_FIELD_MAP;

export function parseYearsOfExperience(value: string): number {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new Error("Invalid years of experience");
  }
  return parsed;
}

import { randomUUID } from "crypto";
import { PoolClient } from "pg";
import { withTransaction } from "@/lib/db";

export type ApplicantType = "owner" | "barber";
export type MembershipLevel = "gold" | "silver" | "white";
export type ApplicationStatus = "pending" | "under_review" | "approved" | "rejected";

export interface MembershipApplicationInput {
  fullName: string;
  phone: string;
  email?: string;
  barbershopName: string;
  address: string;
  applicantType: ApplicantType;
  membershipLevel: MembershipLevel;
}

export interface DocumentInput {
  documentType: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  fileData: Buffer;
}

export interface CreatedApplication {
  id: string;
  applicationRef: string;
  status: ApplicationStatus;
  submittedAt: Date;
}

export function generateApplicationRef(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EBOA-${timestamp}-${random}`;
}

export async function createMembershipApplication(
  data: MembershipApplicationInput,
  documents: DocumentInput[]
): Promise<CreatedApplication> {
  const id = randomUUID();
  const applicationRef = generateApplicationRef();
  const profession = data.applicantType === "owner" ? "Barbershop Owner" : "Barber";

  return withTransaction(async (client: PoolClient) => {
    const appResult = await client.query(
      `INSERT INTO membership_applications (
        id, application_ref, full_name, date_of_birth, phone, email, address, city,
        profession, barbershop_name, years_of_experience, barbershop_address,
        applicant_type, membership_level, agreement
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING id, application_ref, status, submitted_at`,
      [
        id,
        applicationRef,
        data.fullName,
        null,
        data.phone,
        data.email?.toLowerCase() || null,
        data.address,
        null,
        profession,
        data.barbershopName,
        0,
        null,
        data.applicantType,
        data.membershipLevel,
        true,
      ]
    );

    for (const doc of documents) {
      await client.query(
        `INSERT INTO application_documents (
          id, application_id, document_type, file_name, mime_type, file_size, file_data
        ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          randomUUID(),
          id,
          doc.documentType,
          doc.fileName,
          doc.mimeType,
          doc.fileSize,
          doc.fileData,
        ]
      );
    }

    const row = appResult.rows[0];
    return {
      id: row.id,
      applicationRef: row.application_ref,
      status: row.status,
      submittedAt: row.submitted_at,
    };
  });
}

export async function getMembershipApplicationByRef(ref: string) {
  const { getPool } = await import("@/lib/db");
  const result = await getPool().query(
    `SELECT
      a.application_ref,
      a.full_name,
      a.status,
      a.applicant_type,
      a.membership_level,
      a.submitted_at,
      a.updated_at,
      a.reviewed_at,
      COUNT(d.id)::int AS documents_count
    FROM membership_applications a
    LEFT JOIN application_documents d ON d.application_id = a.id
    WHERE a.application_ref = $1
    GROUP BY a.id`,
    [ref]
  );

  return result.rows[0] || null;
}

export async function createContactMessage(data: {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { getPool } = await import("@/lib/db");
  const id = randomUUID();

  const result = await getPool().query(
    `INSERT INTO contact_messages (id, name, phone, email, subject, message)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id, created_at`,
    [id, data.name, data.phone, data.email.toLowerCase(), data.subject, data.message]
  );

  return result.rows[0];
}

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

type Queryable = {
  query: (text: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
};

export interface DocumentInput {
  documentType: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  fileData: Buffer;
}

export interface StoredDocument {
  id: string;
  documentType: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  fileData: Buffer;
  status?: ApplicationStatus;
  applicationRef?: string;
  membershipId?: string | null;
}

function toBuffer(data: unknown): Buffer {
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  if (typeof data === "string") return Buffer.from(data, "base64");
  return Buffer.alloc(0);
}

export interface CreatedApplication {
  id: string;
  applicationRef: string;
  status: ApplicationStatus;
  submittedAt: Date;
}

export interface MembershipApplicationRecord {
  id: string;
  applicationRef: string;
  membershipId: string | null;
  fullName: string;
  phone: string;
  email: string | null;
  address: string;
  barbershopName: string | null;
  applicantType: ApplicantType;
  membershipLevel: MembershipLevel;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  reviewNotes: string | null;
  documents: Array<{
    id: string;
    documentType: string;
    fileName: string;
    mimeType: string;
  }>;
}

export function generateApplicationRef(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EBOA-${timestamp}-${random}`;
}

function mapApplication(row: Record<string, unknown>, documents: MembershipApplicationRecord["documents"] = []): MembershipApplicationRecord {
  return {
    id: row.id as string,
    applicationRef: row.application_ref as string,
    membershipId: (row.membership_id as string) || null,
    fullName: row.full_name as string,
    phone: row.phone as string,
    email: (row.email as string) || null,
    address: row.address as string,
    barbershopName: (row.barbershop_name as string) || null,
    applicantType: row.applicant_type as ApplicantType,
    membershipLevel: row.membership_level as MembershipLevel,
    status: row.status as ApplicationStatus,
    submittedAt: row.submitted_at as string,
    updatedAt: row.updated_at as string,
    reviewedAt: (row.reviewed_at as string) || null,
    reviewNotes: (row.review_notes as string) || null,
    documents,
  };
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

async function loadDocuments(db: Queryable, applicationId: string) {
  const result = await db.query(
    `SELECT id, document_type, file_name, mime_type
     FROM application_documents
     WHERE application_id = $1
     ORDER BY uploaded_at ASC`,
    [applicationId]
  );
  return result.rows.map((row) => ({
    id: row.id as string,
    documentType: row.document_type as string,
    fileName: row.file_name as string,
    mimeType: row.mime_type as string,
  }));
}

export async function getMembershipApplicationByRef(ref: string) {
  const { getPool } = await import("@/lib/db");
  const result = await getPool().query(
    `SELECT
      a.id,
      a.application_ref,
      a.membership_id,
      a.full_name,
      a.phone,
      a.email,
      a.address,
      a.barbershop_name,
      a.status,
      a.applicant_type,
      a.membership_level,
      a.submitted_at,
      a.updated_at,
      a.reviewed_at,
      a.review_notes
    FROM membership_applications a
    WHERE a.application_ref = $1`,
    [ref]
  );

  if (!result.rows[0]) return null;
  const documents = await loadDocuments(getPool(), result.rows[0].id);
  return mapApplication(result.rows[0], documents);
}

export async function listMembershipApplications(status?: ApplicationStatus) {
  const { getPool } = await import("@/lib/db");
  const result = status
    ? await getPool().query(
        `SELECT id, application_ref, membership_id, full_name, phone, email, address,
                barbershop_name, status, applicant_type, membership_level,
                submitted_at, updated_at, reviewed_at, review_notes
         FROM membership_applications
         WHERE status = $1
         ORDER BY submitted_at DESC`,
        [status]
      )
    : await getPool().query(
        `SELECT id, application_ref, membership_id, full_name, phone, email, address,
                barbershop_name, status, applicant_type, membership_level,
                submitted_at, updated_at, reviewed_at, review_notes
         FROM membership_applications
         ORDER BY submitted_at DESC`
      );

  return result.rows.map((row) => mapApplication(row));
}

export async function getMembershipApplicationById(id: string) {
  const { getPool } = await import("@/lib/db");
  const result = await getPool().query(
    `SELECT id, application_ref, membership_id, full_name, phone, email, address,
            barbershop_name, status, applicant_type, membership_level,
            submitted_at, updated_at, reviewed_at, review_notes
     FROM membership_applications
     WHERE id = $1`,
    [id]
  );
  if (!result.rows[0]) return null;
  const documents = await loadDocuments(getPool(), id);
  return mapApplication(result.rows[0], documents);
}

function mapStoredDocument(row: Record<string, unknown>): StoredDocument {
  return {
    id: row.id as string,
    documentType: row.document_type as string,
    fileName: row.file_name as string,
    mimeType: row.mime_type as string,
    fileSize: Number(row.file_size),
    fileData: toBuffer(row.file_data),
    status: row.status as ApplicationStatus | undefined,
    applicationRef: row.application_ref as string | undefined,
    membershipId: (row.membership_id as string) || null,
  };
}

export async function getApplicationDocument(applicationId: string, documentType: string) {
  const { getPool } = await import("@/lib/db");
  const result = await getPool().query(
    `SELECT id, document_type, file_name, mime_type, file_size, file_data
     FROM application_documents
     WHERE application_id = $1 AND document_type = $2`,
    [applicationId, documentType]
  );
  return result.rows[0] ? mapStoredDocument(result.rows[0]) : null;
}

export async function getApplicationDocumentByTypeForRef(ref: string, documentType: string) {
  const { getPool } = await import("@/lib/db");
  const result = await getPool().query(
    `SELECT d.id, d.document_type, d.file_name, d.mime_type, d.file_size, d.file_data,
            a.status, a.application_ref, a.membership_id
     FROM application_documents d
     JOIN membership_applications a ON a.id = d.application_id
     WHERE a.application_ref = $1 AND d.document_type = $2`,
    [ref, documentType]
  );
  return result.rows[0] ? mapStoredDocument(result.rows[0]) : null;
}

export async function nextMembershipId(client: Queryable): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `EBOA-${year}-`;
  const result = await client.query(
    `SELECT membership_id
     FROM membership_applications
     WHERE membership_id LIKE $1
     ORDER BY membership_id DESC
     LIMIT 1`,
    [`${prefix}%`]
  );
  const latest = result.rows[0]?.membership_id as string | undefined;
  const nextNumber = latest ? Number(latest.slice(prefix.length)) + 1 : 1;
  return `${prefix}${String(Number.isFinite(nextNumber) ? nextNumber : 1).padStart(4, "0")}`;
}

export async function rejectMembershipApplication(id: string, reviewNotes?: string) {
  const { getPool } = await import("@/lib/db");
  const result = await getPool().query(
    `UPDATE membership_applications
     SET status = 'rejected',
         review_notes = $2,
         reviewed_at = NOW(),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, application_ref, membership_id, full_name, phone, email, address,
               barbershop_name, status, applicant_type, membership_level,
               submitted_at, updated_at, reviewed_at, review_notes`,
    [id, reviewNotes || null]
  );
  if (!result.rows[0]) return null;
  return mapApplication(result.rows[0]);
}

export async function approveMembershipApplication(
  id: string,
  generatedDocuments: DocumentInput[],
  reviewNotes?: string,
  membershipId?: string
) {
  return withTransaction(async (client: PoolClient) => {
    const existing = await client.query(
      `SELECT id, status FROM membership_applications WHERE id = $1 FOR UPDATE`,
      [id]
    );
    if (!existing.rows[0]) return null;
    if (existing.rows[0].status === "approved") {
      throw new Error("Application is already approved");
    }

    const assignedId = membershipId || (await nextMembershipId(client));
    const updated = await client.query(
      `UPDATE membership_applications
       SET status = 'approved',
           membership_id = $2,
           review_notes = $3,
           reviewed_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, application_ref, membership_id, full_name, phone, email, address,
                 barbershop_name, status, applicant_type, membership_level,
                 submitted_at, updated_at, reviewed_at, review_notes`,
      [id, assignedId, reviewNotes || null]
    );

    for (const doc of generatedDocuments) {
      await client.query(
        `INSERT INTO application_documents (
          id, application_id, document_type, file_name, mime_type, file_size, file_data
        ) VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (application_id, document_type)
        DO UPDATE SET
          file_name = EXCLUDED.file_name,
          mime_type = EXCLUDED.mime_type,
          file_size = EXCLUDED.file_size,
          file_data = EXCLUDED.file_data,
          uploaded_at = NOW()`,
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

    const documents = await loadDocuments(client, id);
    return mapApplication(updated.rows[0], documents);
  });
}

export async function peekNextMembershipId() {
  const { getPool } = await import("@/lib/db");
  return nextMembershipId(getPool());
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

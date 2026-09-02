import { randomUUID } from "crypto";
import { getPool } from "@/lib/db";

export type PostType = "event" | "job" | "announcement" | "general";
export type PostStatus = "draft" | "published" | "archived";

export interface PostInput {
  type: PostType;
  title: string;
  summary?: string;
  body: string;
  category?: string;
  location?: string;
  eventDate?: string;
  applicationDeadline?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: PostStatus;
  image?: {
    fileName: string;
    mimeType: string;
    data: Buffer;
  } | null;
}

export interface PostRecord {
  id: string;
  slug: string;
  type: PostType;
  title: string;
  summary: string | null;
  body: string;
  category: string | null;
  location: string | null;
  eventDate: string | null;
  applicationDeadline: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  hasImage: boolean;
  imageMimeType: string | null;
  imageFileName: string | null;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const pool = getPool();
  const base = slugify(title) || "post";
  let slug = base;
  let counter = 1;

  while (true) {
    const result = await pool.query(
      `SELECT id FROM posts WHERE slug = $1${excludeId ? " AND id != $2" : ""} LIMIT 1`,
      excludeId ? [slug, excludeId] : [slug]
    );
    if (result.rows.length === 0) return slug;
    slug = `${base}-${counter++}`;
  }
}

function mapRow(row: Record<string, unknown>): PostRecord {
  return {
    id: row.id as string,
    slug: row.slug as string,
    type: row.type as PostType,
    title: row.title as string,
    summary: (row.summary as string) ?? null,
    body: row.body as string,
    category: (row.category as string) ?? null,
    location: (row.location as string) ?? null,
    eventDate: row.event_date ? String(row.event_date).slice(0, 10) : null,
    applicationDeadline: row.application_deadline
      ? String(row.application_deadline).slice(0, 10)
      : null,
    contactEmail: (row.contact_email as string) ?? null,
    contactPhone: (row.contact_phone as string) ?? null,
    hasImage: Boolean(row.image_data),
    imageMimeType: (row.image_mime_type as string) ?? null,
    imageFileName: (row.image_file_name as string) ?? null,
    status: row.status as PostStatus,
    publishedAt: row.published_at ? new Date(row.published_at as string).toISOString() : null,
    createdAt: new Date(row.created_at as string).toISOString(),
    updatedAt: new Date(row.updated_at as string).toISOString(),
  };
}

const SELECT_FIELDS = `
  id, slug, type, title, summary, body, category, location,
  event_date, application_deadline, contact_email, contact_phone,
  (image_data IS NOT NULL) AS image_data,
  image_mime_type, image_file_name,
  status, published_at, created_at, updated_at
`;

export async function listPosts(options: {
  type?: PostType;
  status?: PostStatus | PostStatus[];
  limit?: number;
  includeBody?: boolean;
}): Promise<PostRecord[]> {
  const pool = getPool();
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (options.type) {
    params.push(options.type);
    conditions.push(`type = $${params.length}`);
  }

  if (options.status) {
    const statuses = Array.isArray(options.status) ? options.status : [options.status];
    params.push(statuses);
    conditions.push(`status = ANY($${params.length})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = options.limit ? `LIMIT ${Math.min(options.limit, 100)}` : "";

  const bodyField = options.includeBody === false ? "NULL AS body" : "body";

  const result = await pool.query(
    `SELECT
      id, slug, type, title, summary, ${bodyField}, category, location,
      event_date, application_deadline, contact_email, contact_phone,
      (image_data IS NOT NULL) AS image_data,
      image_mime_type, image_file_name,
      status, published_at, created_at, updated_at
    FROM posts ${where}
    ORDER BY COALESCE(published_at, created_at) DESC
    ${limit}`,
    params
  );

  return result.rows.map((row) => ({
    ...mapRow({ ...row, body: row.body ?? "" }),
  }));
}

export async function getPostById(id: string): Promise<PostRecord | null> {
  const pool = getPool();
  const result = await pool.query(
    `SELECT ${SELECT_FIELDS.replace("(image_data IS NOT NULL) AS image_data", "image_data")} FROM posts WHERE id = $1`,
    [id]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function getPostBySlug(slug: string, publishedOnly = true): Promise<PostRecord | null> {
  const pool = getPool();
  const result = await pool.query(
    `SELECT ${SELECT_FIELDS.replace("(image_data IS NOT NULL) AS image_data", "image_data")} FROM posts WHERE slug = $1${publishedOnly ? " AND status = 'published'" : ""}`,
    [slug]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function getPostImage(id: string): Promise<{
  data: Buffer;
  mimeType: string;
  fileName: string;
} | null> {
  const pool = getPool();
  const result = await pool.query(
    `SELECT image_data, image_mime_type, image_file_name FROM posts WHERE id = $1 AND image_data IS NOT NULL`,
    [id]
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    data: row.image_data as Buffer,
    mimeType: row.image_mime_type as string,
    fileName: row.image_file_name as string,
  };
}

export async function createPost(data: PostInput): Promise<PostRecord> {
  const pool = getPool();
  const id = randomUUID();
  const slug = await generateUniqueSlug(data.title);
  const publishedAt = data.status === "published" ? new Date() : null;

  const result = await pool.query(
    `INSERT INTO posts (
      id, slug, type, title, summary, body, category, location,
      event_date, application_deadline, contact_email, contact_phone,
      image_mime_type, image_file_name, image_data,
      status, published_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
    RETURNING ${SELECT_FIELDS.replace("(image_data IS NOT NULL) AS image_data", "image_data")}`,
    [
      id,
      slug,
      data.type,
      data.title,
      data.summary || null,
      data.body,
      data.category || null,
      data.location || null,
      data.eventDate || null,
      data.applicationDeadline || null,
      data.contactEmail || null,
      data.contactPhone || null,
      data.image?.mimeType || null,
      data.image?.fileName || null,
      data.image?.data || null,
      data.status,
      publishedAt,
    ]
  );

  return mapRow(result.rows[0]);
}

export async function updatePost(
  id: string,
  data: PostInput,
  options?: { removeImage?: boolean }
): Promise<PostRecord | null> {
  const pool = getPool();
  const existing = await getPostById(id);
  if (!existing) return null;

  const slug =
    data.title !== existing.title ? await generateUniqueSlug(data.title, id) : existing.slug;

  let publishedAt = existing.publishedAt;
  if (data.status === "published" && existing.status !== "published") {
    publishedAt = new Date().toISOString();
  } else if (data.status !== "published") {
    publishedAt = null;
  }

  const returnFields = `id, slug, type, title, summary, body, category, location,
    event_date, application_deadline, contact_email, contact_phone,
    image_data, image_mime_type, image_file_name,
    status, published_at, created_at, updated_at`;

  const baseParams = [
    data.type,
    data.title,
    data.summary || null,
    data.body,
    data.category || null,
    data.location || null,
    data.eventDate || null,
    data.applicationDeadline || null,
    data.contactEmail || null,
    data.contactPhone || null,
    data.status,
    publishedAt,
    slug,
    id,
  ];

  if (options?.removeImage) {
    const result = await pool.query(
      `UPDATE posts SET
        type = $1, title = $2, summary = $3, body = $4, category = $5, location = $6,
        event_date = $7, application_deadline = $8, contact_email = $9, contact_phone = $10,
        status = $11, published_at = $12, slug = $13,
        image_mime_type = NULL, image_file_name = NULL, image_data = NULL,
        updated_at = NOW()
      WHERE id = $14
      RETURNING ${returnFields}`,
      baseParams
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  if (data.image) {
    const result = await pool.query(
      `UPDATE posts SET
        type = $1, title = $2, summary = $3, body = $4, category = $5, location = $6,
        event_date = $7, application_deadline = $8, contact_email = $9, contact_phone = $10,
        status = $11, published_at = $12, slug = $13,
        image_mime_type = $14, image_file_name = $15, image_data = $16,
        updated_at = NOW()
      WHERE id = $17
      RETURNING ${returnFields}`,
      [...baseParams.slice(0, 13), data.image.mimeType, data.image.fileName, data.image.data, id]
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  const result = await pool.query(
    `UPDATE posts SET
      type = $1, title = $2, summary = $3, body = $4, category = $5, location = $6,
      event_date = $7, application_deadline = $8, contact_email = $9, contact_phone = $10,
      status = $11, published_at = $12, slug = $13, updated_at = NOW()
    WHERE id = $14
    RETURNING ${returnFields}`,
    baseParams
  );

  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function updatePostStatus(id: string, status: PostStatus): Promise<PostRecord | null> {
  const pool = getPool();
  const publishedAt = status === "published" ? new Date() : null;

  const result = await pool.query(
    `UPDATE posts SET status = $1, published_at = $2, updated_at = NOW() WHERE id = $3
     RETURNING ${SELECT_FIELDS.replace("(image_data IS NOT NULL) AS image_data", "image_data")}`,
    [status, publishedAt, id]
  );

  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function deletePost(id: string): Promise<boolean> {
  const pool = getPool();
  const result = await pool.query(`DELETE FROM posts WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
}

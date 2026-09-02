import { z } from "zod";

export const postTypeSchema = z.enum(["event", "job", "announcement", "general"]);
export const postStatusSchema = z.enum(["draft", "published", "archived"]);

export const postFormSchema = z
  .object({
    type: postTypeSchema,
    title: z.string().min(3, "Title must be at least 3 characters"),
    summary: z.string().max(500).optional().or(z.literal("")),
    body: z.string().min(10, "Body must be at least 10 characters"),
    category: z.string().max(100).optional().or(z.literal("")),
    location: z.string().max(200).optional().or(z.literal("")),
    eventDate: z.string().optional().or(z.literal("")),
    applicationDeadline: z.string().optional().or(z.literal("")),
    contactEmail: z
      .string()
      .email("Invalid email")
      .optional()
      .or(z.literal("")),
    contactPhone: z.string().max(30).optional().or(z.literal("")),
    status: postStatusSchema,
  })
  .superRefine((data, ctx) => {
    if (data.type === "event" && !data.eventDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Event date is required for events",
        path: ["eventDate"],
      });
    }
  });

export type PostFormData = z.infer<typeof postFormSchema>;

export function parsePostFormData(data: Record<string, string>): PostFormData {
  return postFormSchema.parse({
    type: data.type,
    title: data.title,
    summary: data.summary || "",
    body: data.body,
    category: data.category || "",
    location: data.location || "",
    eventDate: data.eventDate || "",
    applicationDeadline: data.applicationDeadline || "",
    contactEmail: data.contactEmail || "",
    contactPhone: data.contactPhone || "",
    status: data.status || "draft",
  });
}

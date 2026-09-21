import { z } from "zod";
import type { Translations } from "@/lib/i18n";
import en from "@/lib/i18n/en";

export function createContactFormSchema(t: Translations) {
  return z.object({
    name: z.string().min(2, t.contact.errors.nameMin),
    phone: z.string().min(10, t.contact.errors.phoneInvalid),
    email: z.string().email(t.contact.errors.emailInvalid),
    subject: z.string().min(3, t.contact.errors.subjectMin),
    message: z.string().min(10, t.contact.errors.messageMin),
  });
}

export const contactFormSchema = createContactFormSchema(en);

export type ContactFormData = z.infer<typeof contactFormSchema>;

export function createMembershipFormSchema(t: Translations) {
  return z.object({
    fullName: z.string().min(2, t.membership.errors.fullName),
    phone: z.string().min(10, t.membership.errors.phone),
    email: z
      .string()
      .email(t.membership.errors.email)
      .optional()
      .or(z.literal("")),
    telegramUsername: z
      .string()
      .trim()
      .transform((value) => value.replace(/^@+/, ""))
      .pipe(
        z
          .string()
          .min(3, t.membership.errors.telegramUsername)
          .regex(/^[a-zA-Z0-9_]{3,32}$/, t.membership.errors.telegramUsername)
      ),
    barbershopName: z.string().min(2, t.membership.errors.barbershopName),
    address: z.string().min(5, t.membership.errors.address),
    applicantType: z.enum(["owner", "barber"], {
      message: t.membership.errors.applicantType,
    }),
    membershipLevel: z.enum(["gold", "silver", "white"], {
      message: t.membership.errors.membershipLevel,
    }),
  });
}

export const membershipFormSchema = createMembershipFormSchema(en);

export type MembershipFormData = z.infer<typeof membershipFormSchema>;

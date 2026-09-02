import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const membershipFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  barbershopName: z.string().min(2, "Barbershop name is required"),
  address: z.string().min(5, "Address is required"),
  applicantType: z.enum(["owner", "barber"], {
    message: "Please select Barber or Barbershop Owner",
  }),
  membershipLevel: z.enum(["gold", "silver", "white"], {
    message: "Please select a membership level",
  }),
});

export type MembershipFormData = z.infer<typeof membershipFormSchema>;

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
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  profession: z.string().min(2, "Profession is required"),
  barbershopName: z.string().optional(),
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
  barbershopAddress: z.string().optional(),
  applicantType: z.enum(["owner", "barber"], {
    message: "Please select owner or barber",
  }),
  agreement: z.literal(true, {
    message: "You must confirm the information is accurate",
  }),
});

export type MembershipFormData = z.infer<typeof membershipFormSchema>;

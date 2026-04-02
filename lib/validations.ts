import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Please enter a valid email address").optional(),
});

export const domainSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .transform((val) => val.trim().toLowerCase())
    .refine(
      (val) => /^(?!-)(?:[a-z0-9-]{1,63}\.)+[a-z]{2,63}$/.test(val),
      { message: "Please enter a valid domain (example.com)" }
    ),
  expiresAt: z.string().transform((val) => new Date(val)),
  notes: z.string().max(500, "Notes too long").optional().default(""),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type DomainInput = z.infer<typeof domainSchema>;

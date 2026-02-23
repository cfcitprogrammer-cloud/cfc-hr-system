import { z } from "zod";

export const issueRefCheckSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .refine((val) => ["maam", "sir"].includes(val), {
      message: "Invalid title",
    }),

  receiverName: z.string().min(1, "Receiver name is required"),

  receiverEmail: z
    .string()
    .min(1, "Receiver email is required")
    .email("Invalid email address"),

  employeeName: z.string().min(1, "Employee name is required"),

  position: z.string().min(1, "Position is required"),

  company: z.string().min(1, "Company is required"),
});

export type IssueRefCheckFormValues = z.infer<typeof issueRefCheckSchema>;

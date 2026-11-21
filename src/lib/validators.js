import { z } from "zod";

export const PASSWORD_MESSAGE =
  "Needs an uppercase letter, a lowercase letter and at least 6 characters";

export const passwordSchema = z
  .string()
  .min(6, PASSWORD_MESSAGE)
  .regex(/[A-Z]/, PASSWORD_MESSAGE)
  .regex(/[a-z]/, PASSWORD_MESSAGE);

const BD_PHONE_RE = /^(?:\+?880|0)1[3-9]\d{8}$/;

export function normalizePhone(value) {
  const compact = String(value ?? "").replace(/[\s-]/g, "");
  if (!BD_PHONE_RE.test(compact)) return null;
  const digits = compact.replace(/^\+/, "");
  const local = digits.startsWith("880") ? digits.slice(3) : digits.slice(1);
  return `+880${local}`;
}

export const phoneSchema = z
  .string()
  .refine((v) => normalizePhone(v) !== null, {
    message: "Enter a valid Bangladeshi mobile number",
  });

export const equipmentSchema = z.object({
  name: z.string().min(4, "Name needs at least 4 characters").max(80),
  description: z.string().min(20, "Description needs at least 20 characters").max(2000),
  category: z.enum([
    "Construction Equipment",
    "Photography Equipment",
    "Vehicles & Transportation",
    "Agriculture Equipment",
    "Electronics",
    "Event Equipment",
  ]),
  location: z.string().min(2, "Location is required").max(120),
  price: z.coerce.number().int().positive("Price must be a positive amount in BDT"),
  rentalType: z.enum(["daily", "weekly", "monthly"]),
  quantity: z.coerce.number().int().min(0).max(999),
  condition: z.enum(["Like new", "Excellent", "Good", "Fair"]),
  brand: z.string().min(1, "Brand is required").max(60),
  model: z.string().min(1, "Model is required").max(60),
  image: z.string().url("Image must be a valid URL"),
  terms: z.string().min(10, "Terms need at least 10 characters").max(2000),
});

export const bookingSchema = z.object({
  equipmentId: z.string().min(1),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  phone: phoneSchema,
  address: z
    .string()
    .min(5, "Address needs at least 5 characters")
    .max(200, "Address must be under 200 characters"),
  notes: z.string().max(500, "Notes must be under 500 characters").optional().default(""),
});

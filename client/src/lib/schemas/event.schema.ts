import { z } from "zod";
import Decimal from "decimal.js";
import { parseDateString } from "@/lib/utils";

export const baseEventSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title is too short, minimum 3 characters" })
    .max(255, { message: "Title is too long, maximum 255 characters" }),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(0, {
      message: "Invalid price, minimum zero (0) dollars",
    })
    .refine((x) => /^\d+(\.\d{1,2})?$/.test(x.toString()), {
      message: "Price must have at most two decimal places",
      path: ["price"],
    })
    .transform((val) => new Decimal(val).times(100).toNumber()),
  startDate: z
    .string()
    .min(1, { message: "Start date is required" })
    .refine(
      (dateString) => {
        const date = parseDateString(dateString);
        return date !== false;
      },
      {
        message: "Invalid date format, must be in the format dd/mm/yyyy",
        path: ["startDate"],
      }
    ),
  endDate: z
    .string()
    .min(1, { message: "End date is required" })
    .refine(
      (dateString) => {
        const date = parseDateString(dateString);
        return date !== false;
      },
      {
        message: "Invalid date format, must be in the format dd/mm/yyyy",
        path: ["endDate"],
      }
    ),
});

export const eventSchema = baseEventSchema.refine(
  (data) => {
    const startDate = parseDateString(data.startDate);
    const endDate = parseDateString(data.endDate);

    return endDate > startDate;
  },
  { message: "End date must be after start date", path: ["endDate"] }
);

export const eventUpdateSchema = baseEventSchema.extend({
  id: z.string(),
  status: z.enum(["started", "completed", "paused"], {
    message: "Invalid status",
  }),
});

export const eventDeleteSchema = z.object({
  eventId: z.string(),
});

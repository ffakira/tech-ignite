import { z } from "zod";
import { parseDateString } from "@/lib/utils";

export const eventSchema = z
  .object({
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
      .refine((x) => x * 100 - Math.trunc(x * 100) < Number.EPSILON, {
        message: "Price must have at most two decimal places",
      })
      .transform((val) => val * 100),
    startDate: z.string().refine(
      (dateString) => {
        const date = parseDateString(dateString);
        return date instanceof Date && !isNaN(date.getTime());
      },
      { message: "Invalid date format, must be in the format dd/mm/yyyy" }
    ),
    endDate: z.string().refine(
      (dateString) => {
        const date = parseDateString(dateString);
        return date instanceof Date && !isNaN(date.getTime());
      },
      { message: "Invalid date format, must be in the format dd/mm/yyyy" }
    ),
  })
  .refine((data) => {
    const startDate = parseDateString(data.startDate);
    const endDate = parseDateString(data.endDate);

    return endDate > startDate;
  });

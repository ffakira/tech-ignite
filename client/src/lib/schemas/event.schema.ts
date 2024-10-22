import { z } from "zod";
import { parseDateString } from "../utils";

export const eventSchema = z
  .object({
    title: z
      .string()
      .min(3, { message: "Title is too short, minimum 3 characters" })
      .max(255, { message: "Title is too long, maximum 255 characters" }),
    price: z
      .number()
      .min(0, {
        message: "Invalid price, miparseFloat(val)nimum zero (0) dollars",
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

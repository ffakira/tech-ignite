import { z } from "zod";

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
    startDate: z.date().refine((date) => date > new Date(), {
      message: "Start date must be in the future",
    }),
    endDate: z.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be greater than start date",
    path: ["endDate"],
  });

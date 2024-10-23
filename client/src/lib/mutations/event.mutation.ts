/**
 * @TODO implement mutations for events
 */

import { useMutation } from "@tanstack/react-query";
import {
  eventDeleteSchema,
  eventSchema,
  eventUpdateSchema,
} from "@/lib/schemas/event.schema";
import { z } from "zod";
import { parseDateString } from "@/lib/utils";

export function useCreateEventMutation() {
  return useMutation({
    mutationFn: async (input: z.infer<typeof eventSchema>) => {
      const result = eventSchema.safeParse(input);

      if (!result.success) {
        console.log(result.error.errors);
        return { status: "error", errors: result.error.errors } as const;
      }

      try {
        const startDate = parseDateString(result.data.startDate) as Date;
        const endDate = parseDateString(result.data.endDate) as Date;

        const response = await fetch(
          `${import.meta.env.VITE_API_V1_URL}/events/new`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              ...result.data,
              startDate: Math.floor(startDate.valueOf() / 1000),
              endDate: Math.floor(endDate.valueOf() / 1000),
            }),
          }
        );

        // if (!response.ok) {
        //   return { status: "error", errors: ["An error occurred"] } as const;
        // }

        const data = await response.json();

        if (data.status === 400) {
          return { status: "error", errors: "Bad request" } as const;
        }

        return { status: "success", data } as const;
      } catch (error) {
        console.error(error);
        return { status: "error", errors: ["Internal server error"] } as const;
      }
    },
  });
}

export function useUpdateEventMutation() {
  return useMutation({
    mutationFn: async (input: z.infer<typeof eventUpdateSchema>) => {
      const result = eventUpdateSchema.safeParse(input);

      if (!result.success) {
        console.log(result.error.errors);
        return { status: "error", errors: result.error.errors } as const;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_V1_URL}/events/${result.data.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(result.data),
          }
        );

        if (!response.ok) {
          return { status: "error", errors: ["An error occurred"] } as const;
        }

        const data = await response.json();

        return { status: "success", data } as const;
      } catch (error) {
        console.error(error);
        return { status: "error", errors: ["Internal server error"] } as const;
      }
    },
  });
}

export function useDeleteEventMutation() {
  return useMutation({
    mutationFn: async (input: z.infer<typeof eventDeleteSchema>) => {
      const result = eventDeleteSchema.safeParse(input);

      if (!result.success) {
        console.log(result.error.errors);
        return { status: "error", errors: result.error.errors } as const;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_V1_URL}/events/${result.data.eventId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          return { status: "error", errors: ["An error occurred"] } as const;
        }

        const data = await response.json();

        return { status: "success", data } as const;
      } catch (error) {
        console.error(error);
        return { status: "error", errors: ["Internal server error"] } as const;
      }
    },
  });
}

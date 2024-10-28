import { QueryOptions, queryOptions } from "@tanstack/react-query";

export function useEventQuery(id: number, options?: QueryOptions) {
  return queryOptions({
    queryKey: ["event", id],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_V1_URL}/events/${id}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.status === 404) {
          return { status: "error", errors: ["No data"], data: [] } as const;
        }

        return { status: "success", data } as const;
      } catch (error) {
        console.error(error);
        return { status: "error", errors: ["Internal server error"] } as const;
      }
    },
    ...options,
  });
}

export function useEventsQuery(options?: QueryOptions) {
  return queryOptions({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_V1_URL}/events`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.status === 404) {
          return { status: "error", errors: ["No data"], data: [] } as const;
        }

        return { status: "success", data } as const;
      } catch (error) {
        console.error(error);
        return {
          status: "error",
          errors: ["Internal server error"],
          data: [],
        } as const;
      }
    },
    ...options,
  });
}

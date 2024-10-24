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

        if (!response.ok) {
          return { status: "error", errors: ["An error occurred"] } as const;
        }

        const data = await response.json();
        console.log(data);
        return { status: "success", data } as const;
      } catch (error) {
        return { status: "error", errors: ["Internal server error"] } as const;
      }
    },
    ...options,
  });
}

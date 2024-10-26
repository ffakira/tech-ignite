import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useEventQuery } from "@/lib/queries/event.query";
import { formatDate } from "@/lib/utils";
import Decimal from "decimal.js";
import { ClockIcon } from "lucide-react";
import { EventStatusBadge } from "@/components/event-status-badge";

export function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const id = Number(eventId);

  const result: any = useQuery({
    ...useEventQuery(id),
    enabled: !isNaN(id),
  });

  if (isNaN(id)) {
    return (
      <div>
        <p>Invalid event ID</p>
      </div>
    );
  }

  if (result.isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  const { data: event } = result.data;

  if (!event) {
    return (
      <div>
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="font-semibold text-2xl text-stone-700">{event.title}</h1>
        <EventStatusBadge status={event.status} />
      </div>
      <p className="flex gap-1.5">
        <span className="text-stone-700">Price:</span>
        {event.price === 0 ? (
          "Free"
        ) : (
          <>${new Decimal(event.price).div(100).toNumber()}</>
        )}
      </p>
      <div className="flex gap-10">
        <div>
          <p className="font-semibold text-stone-700">Start Date</p>
          <div className="flex items-center gap-1.5">
            <ClockIcon className="shrink-0 size-4" />
            <time>{formatDate(Number(event.startDate))}</time>
          </div>
        </div>
        <div>
          <p className="font-semibold text-stone-700">End Date</p>
          <div className="flex items-center gap-1.5">
            <ClockIcon className="shrink-0 size-4" />
            <time>{formatDate(Number(event.endDate))}</time>
          </div>
        </div>
      </div>
    </div>
  );
}

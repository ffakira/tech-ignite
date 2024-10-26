export function EventStatusBadge({
  status,
}: {
  status: "started" | "paused" | "completed";
}) {
  if (status === "started") {
    return (
      <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
        started
      </span>
    );
  }

  if (status === "paused") {
    return (
      <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
        paused
      </span>
    );
  }

  if (status === "completed") {
    return (
      <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
        completed
      </span>
    );
  }
}

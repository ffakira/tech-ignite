import { useForm, Controller } from "react-hook-form";
import { Input, Button } from "react-aria-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { eventSchema } from "@/lib/schemas/event.schema";

export function NewEventPage() {
  const form = useForm<z.output<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    // Handle form submission
    console.log(data);
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Create Event</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <Controller
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <Input
                  className="border focus:outline-none py-1.5 px-2 rounded-md focus:outline-blue-100"
                  placeholder="Title"
                  {...field}
                />
              );
            }}
          />
          <Controller
            control={form.control}
            name="price"
            render={({ field }) => {
              return (
                <Input
                  className="w-full border"
                  placeholder="Price"
                  {...field}
                />
              );
            }}
          />
          <Controller
            control={form.control}
            name="startDate"
            render={({ field }) => {
              return (
                <Input
                  className="w-full border"
                  placeholder="Start Date"
                  {...field}
                />
              );
            }}
          />
          <Controller
            control={form.control}
            name="endDate"
            render={({ field }) => {
              return (
                <Input
                  className="w-full border"
                  placeholder="End Date"
                  {...field}
                />
              );
            }}
          />
          <Button type="submit">Create Event</Button>
        </fieldset>
      </form>
    </div>
  );
}

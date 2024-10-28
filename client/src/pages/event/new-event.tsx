import { useForm, Controller } from "react-hook-form";
import { Input, Button, Label, Group } from "react-aria-components";
import { TagIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { eventSchema } from "@/lib/schemas/event.schema";
import { button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCreateEventMutation } from "@/lib/mutations/event.mutation";
import { CalendarPicker } from "@/components/calendar-picker";
import { input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export function NewEventPage() {
  const toastId = "event:created";
  const navigate = useNavigate();

  const createEventMutation = useCreateEventMutation();

  const form = useForm<z.output<typeof eventSchema>>({
    disabled: createEventMutation.isPending,
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      startDate: "",
      endDate: "",
      price: 0,
    },
  });

  const submit = form.handleSubmit((data) => {
    // Handle form submission
    createEventMutation.mutate(data, {
      onSuccess: (data) => {
        console.log("", data.data);
        form.reset();

        toast.success("Event created successfully", {
          id: toastId,
          duration: 3000,
        });

        navigate(`/events/${data.data.id}`);
      },
      onError: (error) => {
        console.error(error);
        toast.error("An error occurred while creating the event", {
          id: toastId,
          duration: 3000,
        });
      },
    });
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Create Event</h1>
      <form onSubmit={submit} className="shadow-lg px-4 py-2 pb-4">
        <fieldset className="space-y-4">
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => {
              return (
                <div className="space-y-2">
                  <Label
                    className="font-semibold text-stone-700"
                    htmlFor={field.name}
                  >
                    Title
                  </Label>
                  <div className="space-y-1">
                    <Input
                      className={cn(
                        input(),
                        fieldState.error
                          ? "border-red-300 focus:ring-red-300"
                          : "border-gray-200 focus:ring-blue-300"
                      )}
                      placeholder="Title"
                      {...field}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm italic">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            }}
          />
          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => {
              return (
                <div className="space-y-2">
                  <Label
                    className="font-semibold text-stone-700"
                    htmlFor={field.name}
                  >
                    Price
                  </Label>
                  <div className="space-y-1">
                    <Group
                      aria-label="Price"
                      className={cn(
                        "group flex border items-center px-2.5 rounded-md py-1.5 gap-2",
                        fieldState.error ? "border-red-300" : "border-gray-200"
                      )}
                    >
                      <span className="bg-gray-200 -ml-2.5 -my-1.5 h-9 w-8 rounded-l-md flex items-center justify-center">
                        <TagIcon
                          className="shrink-0 size-4 text-stone-500"
                          aria-label="Price"
                        />
                      </span>
                      <Input
                        type="number"
                        className="flex-1 focus:outline-none bg-transparent"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          if (e.target.value.length === 0) {
                            form.setValue(field.name, 0);
                          }

                          const value = parseFloat(e.target.value);
                          form.setValue(field.name, value);
                        }}
                      />
                    </Group>
                    {fieldState.error && (
                      <p className="text-red-500 text-sm italic">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="startDate"
              render={({ field }) => {
                return (
                  <CalendarPicker
                    ref={field.ref}
                    name={field.name}
                    label="Start Date"
                    placeholder="Start Date"
                    value={field.value}
                    onChange={field.onChange}
                  />
                );
              }}
            />
            <Controller
              control={form.control}
              name="endDate"
              render={({ field }) => {
                return (
                  <CalendarPicker
                    ref={field.ref}
                    name={field.name}
                    label="End Date"
                    placeholder="End Date"
                    value={field.value}
                    onChange={field.onChange}
                  />
                );
              }}
            />
          </div>
          <Button
            type="submit"
            isDisabled={createEventMutation.isPending}
            className={button({ class: "w-full sm:w-fit float-end" })}
          >
            Create Event
          </Button>
        </fieldset>
      </form>
    </div>
  );
}

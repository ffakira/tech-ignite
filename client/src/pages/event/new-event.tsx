import { useForm, Controller } from "react-hook-form";
import {
  Input,
  Button,
  Label,
  Group,
  Calendar,
  Heading,
  CalendarGrid,
  CalendarCell,
  DialogTrigger,
  Popover,
  Dialog,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
} from "react-aria-components";
import { today, getLocalTimeZone } from "@internationalized/date";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { eventSchema } from "@/lib/schemas/event.schema";
import { button } from "@/components/ui/button";
import {
  calendarCell,
  calendarHeaderButton,
  calendarHeading,
} from "@/components/ui/calendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * @TODO migrate calendar components to its own component
 * @TODO integrate react-hook-form context provider
 */
export function NewEventPage() {
  const toastId = "event:created";
  const onDateChangeToastId = "event:date-changed";

  /**
   * @TODO integrate useNewEventMutation hook
   */

  const form = useForm<z.output<typeof eventSchema>>({
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
    console.log("test", data);

    toast.success("Event created successfully", {
      id: toastId,
      duration: 3000,
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
                        "w-full border focus:outline-none py-1.5 px-2 rounded-md focus:ring-1",
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
              render={({ field, fieldState }) => {
                return (
                  <div className="space-y-1.5">
                    <Label
                      className="font-semibold text-stone-700"
                      htmlFor={field.name}
                    >
                      Start Date
                    </Label>
                    <Group className="relative flex border rounded-md px-2 py-1.5">
                      <Input
                        className="flex-1 text-stone-700 -my-1.5 w-full bg-transparent focus:outline-none"
                        placeholder="Start Date"
                        {...field}
                      />
                      <DialogTrigger>
                        <Button
                          className={button({
                            class: "rounded-l-none -mr-2 -my-1.5",
                          })}
                        >
                          <CalendarIcon className="shrink-0 size-4" />
                        </Button>
                        <Popover className="absolute left-0">
                          <Dialog className="bg-white border rounded-md shadow-lg p-4 focus:outline-none">
                            {({ close }) => (
                              <Calendar
                                aria-label="Start date"
                                minValue={today(getLocalTimeZone())}
                                onChange={(data) => {
                                  const date = `${data.day}/${data.month}/${data.year}`;
                                  form.setValue("startDate", date);
                                  toast.info(`Start date changed: ${date}`, {
                                    id: onDateChangeToastId,
                                    duration: 3000,
                                  });
                                  close();
                                }}
                              >
                                <header className="flex w-full justify-between gap-4 mb-4">
                                  <Button
                                    className={calendarHeaderButton()}
                                    slot="previous"
                                  >
                                    <ChevronLeftIcon
                                      className="group-data-[disabled]:text-gray-400"
                                      aria-label="Previous month"
                                    />
                                  </Button>
                                  <Heading className={calendarHeading()} />
                                  <Button
                                    className={calendarHeaderButton()}
                                    slot="next"
                                  >
                                    <ChevronRightIcon
                                      className="group-data-[disabled]:text-gray-400"
                                      aria-label="Next month"
                                    />
                                  </Button>
                                </header>
                                <CalendarGrid>
                                  <CalendarGridHeader>
                                    {(day) => (
                                      <CalendarHeaderCell>
                                        {day}
                                      </CalendarHeaderCell>
                                    )}
                                  </CalendarGridHeader>
                                  <CalendarGridBody>
                                    {(date) => (
                                      <CalendarCell
                                        className={calendarCell()}
                                        date={date}
                                      />
                                    )}
                                  </CalendarGridBody>
                                </CalendarGrid>
                              </Calendar>
                            )}
                          </Dialog>
                        </Popover>
                      </DialogTrigger>
                    </Group>
                    {fieldState.error && (
                      <p className="text-red-500 text-sm italic">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
            <Controller
              control={form.control}
              name="endDate"
              render={({ field, fieldState }) => {
                return (
                  <div className="relative space-y-2">
                    <Label
                      className="font-semibold text-stone-700"
                      htmlFor={field.name}
                    >
                      End Date
                    </Label>
                    <div className="space-y-1">
                      <Group className="relative flex border rounded-md px-2 py-1.5">
                        <Input
                          className="flex-1 text-stone-700 -my-1.5 w-full bg-transparent focus:outline-none"
                          placeholder="End Date"
                          {...field}
                        />
                        <DialogTrigger>
                          <Button
                            className={button({
                              class: "rounded-l-none -mr-2 -my-1.5",
                            })}
                          >
                            <CalendarIcon
                              className="shrink-0 size-4"
                              aria-label="Start date"
                            />
                          </Button>
                          <Popover className="absolute left-0">
                            <Dialog className="bg-white border rounded-md shadow-lg p-4 focus:outline-none">
                              {({ close }) => (
                                <Calendar
                                  aria-label="End date"
                                  minValue={today(getLocalTimeZone())}
                                  onChange={(data) => {
                                    const date = `${data.day}/${data.month}/${data.year}`;
                                    form.setValue("endDate", date);
                                    toast.info(`End date changed: ${date}`, {
                                      id: onDateChangeToastId,
                                      duration: 3000,
                                    });
                                    close();
                                  }}
                                >
                                  <header className="flex w-full justify-between gap-4 mb-4">
                                    <Button
                                      className={calendarHeaderButton()}
                                      slot="previous"
                                    >
                                      <ChevronLeftIcon
                                        className="group-data-[disabled]:text-gray-400"
                                        aria-label="Previous month"
                                      />
                                    </Button>
                                    <Heading className={calendarHeading()} />
                                    <Button
                                      className={calendarHeaderButton()}
                                      slot="next"
                                    >
                                      <ChevronRightIcon
                                        className="group-data-[disabled]:text-gray-400"
                                        aria-label="Next month"
                                      />
                                    </Button>
                                  </header>
                                  <CalendarGrid>
                                    <CalendarGridHeader>
                                      {(day) => (
                                        <CalendarHeaderCell>
                                          {day}
                                        </CalendarHeaderCell>
                                      )}
                                    </CalendarGridHeader>
                                    <CalendarGridBody>
                                      {(date) => (
                                        <CalendarCell
                                          className={calendarCell()}
                                          date={date}
                                        />
                                      )}
                                    </CalendarGridBody>
                                  </CalendarGrid>
                                </Calendar>
                              )}
                            </Dialog>
                          </Popover>
                        </DialogTrigger>
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
          </div>
          <Button type="submit" className={button({ class: "float-end" })}>
            Create Event
          </Button>
        </fieldset>
      </form>
    </div>
  );
}

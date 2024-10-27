import { button } from "@/components/ui/button";
import { useEventsQuery } from "@/lib/queries/event.query";
import { cn, formatDate, formatDateInput } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ClockIcon, PencilIcon, SettingsIcon, XIcon } from "lucide-react";
import { type PropsWithChildren, useEffect, useState } from "react";
import Decimal from "decimal.js";
import {
  Button,
  Dialog,
  DialogTrigger,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event, eventUpdateSchema } from "@/lib/schemas/event.schema";
import { z } from "zod";
import {
  useDeleteEventMutation,
  useUpdateEventMutation,
} from "@/lib/mutations/event.mutation";
import { toast } from "sonner";
import { CalendarPicker } from "@/components/calendar-picker";
import { Link } from "react-router-dom";
import { EventStatusBadge } from "@/components/event-status-badge";
import { input } from "@/components/ui/input";

export function HomePage() {
  // @TODO add types on queryOptions return types
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const result: any = useQuery({ ...useEventsQuery() });

  if (result.isLoading) {
    return <p>Loading...</p>;
  }

  const { data: events } = result;

  if (!events || !Array.isArray(events.data) || events.data.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="font-semibold text-2xl">All Events</h1>
        <div className="bg-gray-200 grid justify-center p-4 rounded-md gap-4">
          <h2 className="text-xl">No Events Found</h2>
          <Link to="/events/new" className={button()}>
            Create new event
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      <h1 className="font-semibold text-2xl">All Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {events.data.map(
          (event: Event & { status: "started" | "completed" | "paused" }) => {
            return (
              <div
                key={event.id}
                className="relative border p-4 rounded-md shadow-lg space-y-6 hover:border-blue-300 z-1"
              >
                <h2
                  title={event.title}
                  className="truncate w-3/4 text-xl font-semibold text-stone-800"
                >
                  {event.title}
                </h2>
                <EditDialogTrigger event={event}>
                  <Button
                    type="button"
                    className={button({
                      class: "absolute -top-4 right-2 z-10",
                    })}
                  >
                    <SettingsIcon
                      className="shrink-0 size-4"
                      aria-label="Edit or delete event"
                    />
                    <span className="sr-only">Edit or delete event</span>
                  </Button>
                </EditDialogTrigger>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="bg-gray-200 text-stone-700 font-semibold py-1 w-fit rounded-full px-4 text-sm">
                        {event.price === 0 ? (
                          "Free"
                        ) : (
                          <>${new Decimal(event.price).div(100).toNumber()}</>
                        )}
                      </p>
                    </div>
                    <EventStatusBadge status={event.status} />
                  </div>
                  <div className="flex">
                    <div className="flex-1">
                      <p className="font-semibold">Start Date</p>
                      <time className="inline-flex gap-1 items-center text-sm">
                        <ClockIcon className="shrink-0 size-4" aria-label="" />
                        {formatDate(Number(event.startDate))}
                      </time>
                    </div>
                    <div>
                      <p className="font-semibold">End Date</p>
                      <time className="inline-flex gap-1 items-center text-sm">
                        <ClockIcon className="shrink-0 size-4" aria-label="" />
                        {formatDate(Number(event.endDate))}
                      </time>
                    </div>
                  </div>

                  <Link
                    className={button({ class: "flex" })}
                    to={`/events/${event.id}`}
                  >
                    View event details
                  </Link>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

function EditDialogTrigger({
  children,
  event,
}: PropsWithChildren<{
  event: Event & { status: "started" | "completed" | "paused" };
}>) {
  const toastUpdateId = "event:edit";
  const toastDeleteId = "event:delete";

  const [edit, setEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const deleteEventMutation = useDeleteEventMutation();
  const updateEventMutation = useUpdateEventMutation();

  const options = [
    { id: "started", name: "Started" },
    { id: "paused", name: "Paused" },
    { id: "completed", name: "Completed" },
  ];

  const form = useForm<z.infer<typeof eventUpdateSchema>>({
    disabled: updateEventMutation.isPending || deleteEventMutation.isPending,
    resolver: zodResolver(eventUpdateSchema),
    defaultValues: {
      id: Number(event.id),
      title: event.title,
      price: new Decimal(event.price).div(100).toNumber(),
      startDate: formatDateInput(Number(event.startDate)),
      endDate: formatDateInput(Number(event.endDate)),
      status: event.status,
    },
  });

  useEffect(() => {
    form.reset({
      id: Number(event.id),
      title: event.title,
      price: new Decimal(event.price).div(100).toNumber(),
      startDate: formatDateInput(Number(event.startDate)),
      endDate: formatDateInput(Number(event.endDate)),
      status: event.status,
    });
  }, [event, form]);

  const handleOnDelete = () => {
    if (deleteEventMutation.isPending || updateEventMutation.isPending) {
      return;
    }

    deleteEventMutation.mutate(
      { id: Number(event.id) },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["events"] });
          setIsOpen(false);
          toast.success("Event deleted successfully", {
            id: toastDeleteId,
            duration: 3000,
          });
        },
        onError(error) {
          console.error("error:", error);
          toast.error(
            "An error occurred while deleting the event. Please try again later.",
            {
              id: toastDeleteId,
              duration: 3000,
            }
          );
        },
      }
    );
  };

  const submit = form.handleSubmit((data) => {
    if (deleteEventMutation.isPending || updateEventMutation.isPending) {
      return;
    }

    updateEventMutation.mutate(data, {
      onSuccess({ data }) {
        /** @dev updates the new default values */
        form.reset({
          id: data.id,
          title: data.title,
          price: new Decimal(data.price).div(100).toNumber(),
          startDate: formatDateInput(Number(data.startDate)),
          endDate: formatDateInput(Number(data.endDate)),
          status: data.status,
        });

        queryClient.invalidateQueries({ queryKey: ["events"] });
        setIsOpen(false);
        setEdit(false);

        toast.success("Event have been succesfully updated", {
          id: toastUpdateId,
          duration: 3000,
        });
      },
      onError(error) {
        console.log(error);
      },
    });
  });

  return (
    <DialogTrigger onOpenChange={setIsOpen} isOpen={isOpen}>
      {children}
      <ModalOverlay
        isDismissable
        className="bg-black/50 absolute top-0 z-10 w-dvw h-dvh grid place-items-center"
      >
        <Modal className="relative">
          <Dialog className="bg-white shadow-lg w-96 rounded-md focus:outline-none p-4 grid grid-rows-[auto,1fr,auto] gap-2">
            {({ close }) => (
              <>
                <Button
                  className="absolute top-3 right-3"
                  type="button"
                  onPress={close}
                >
                  <XIcon aria-label="Close" />
                  <span className="sr-only">Close</span>
                </Button>

                <div className="inline-flex gap-4">
                  <h1 className="font-semibold text-2xl">Manage Event</h1>
                  <Button
                    onPress={() => setEdit((prev) => !prev)}
                    className={button()}
                  >
                    <PencilIcon className="shrink-0 size-4" />
                  </Button>
                </div>

                {!edit ? (
                  <div className="h-full space-y-4 pb-10">
                    <div className="space-y-1.5">
                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                          <h2
                            title={event.title}
                            className="truncate w-64 text-xl font-semibold"
                          >
                            {event.title}
                          </h2>
                        </div>
                        <EventStatusBadge status={event.status} />
                      </div>
                      <p>
                        <span className="font-semibold">Price: </span>
                        <span>
                          {event.price === 0 ? (
                            "Free"
                          ) : (
                            <>${new Decimal(event.price).div(100).toNumber()}</>
                          )}
                        </span>
                      </p>
                    </div>
                    <div className="grid grid-cols-2">
                      <div>
                        <p className="font-semibold">Start Date</p>
                        <div className="flex items-center gap-1.5">
                          <ClockIcon className="shrink-0 size-4" />
                          <time>{formatDate(+event.startDate)}</time>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">End Date</p>
                        <div className="flex items-center gap-1.5">
                          <ClockIcon className="shrink-0 size-4" />
                          <time>{formatDate(+event.endDate)}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    <form onSubmit={submit}>
                      <fieldset className="space-y-4">
                        <Controller
                          control={form.control}
                          name="title"
                          render={({ field, fieldState }) => {
                            return (
                              <div className="space-y-1">
                                <Label className="font-semibold w-full">
                                  Title
                                </Label>
                                <Input
                                  className={cn(
                                    input(),
                                    fieldState.error
                                      ? "border-red-300 focus:ring-red-300"
                                      : "border-gray-200 focus:ring-blue-300"
                                  )}
                                  placeholder="Titlte"
                                  {...field}
                                />
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
                                  htmlFor={field.name}
                                  className="font-semibold w-full"
                                >
                                  Price
                                </Label>
                                <div className="space-y-1">
                                  <Input
                                    type="number"
                                    className={input()}
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
                          name="status"
                          render={({ field }) => {
                            return (
                              <div className="space-y-1">
                                <Label
                                  htmlFor={field.name}
                                  className="font-semibold"
                                >
                                  Status
                                </Label>
                                <Select
                                  aria-label="Select status"
                                  name={field.name}
                                  className="relative"
                                  selectedKey={field.value}
                                  onSelectionChange={(value) =>
                                    form.setValue(
                                      field.name,
                                      value as
                                        | "started"
                                        | "completed"
                                        | "paused"
                                    )
                                  }
                                >
                                  <Button className="border rounded-md p-2 flex w-full">
                                    <SelectValue />
                                  </Button>
                                  <Popover className="border grid -mt-2 w-[calc(theme(spacing.96)-theme(spacing.8))] shadow-md">
                                    <ListBox
                                      items={options}
                                      className="px-2 space-y-2 bg-white shadow-md rounded-b"
                                    >
                                      {(item) => (
                                        <ListBoxItem className="cursor-pointer w-[calc(theme(spacing.96)-theme(spacing.8))] -mx-2 hover:bg-blue-100 py-1.5 px-2 aria-selected:bg-blue-100">
                                          {item.name}
                                        </ListBoxItem>
                                      )}
                                    </ListBox>
                                  </Popover>
                                </Select>
                              </div>
                            );
                          }}
                        />
                        <Controller
                          control={form.control}
                          name="startDate"
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
                        <Button
                          type="submit"
                          className={button({ class: "w-full" })}
                        >
                          Update
                        </Button>
                      </fieldset>
                    </form>
                  </div>
                )}

                {!edit && (
                  <div className="space-x-2 justify-self-end">
                    <Button
                      onPress={close}
                      isDisabled={
                        deleteEventMutation.isPending ||
                        updateEventMutation.isPending
                      }
                      className={button()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      isDisabled={deleteEventMutation.isPending}
                      onPress={() => {
                        handleOnDelete();
                        if (deleteEventMutation.isSuccess) {
                          close();
                        }
                      }}
                      className={button({ variant: "danger" })}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

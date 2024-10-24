import { button } from "@/components/ui/button";
import { useEventsQuery } from "@/lib/queries/event.query";
import { formatDate, formatDateInput } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ClockIcon, PencilIcon, SettingsIcon, XIcon } from "lucide-react";
import { type PropsWithChildren, useState } from "react";
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
import { eventUpdateSchema } from "@/lib/schemas/event.schema";
import { z } from "zod";
import {
  useDeleteEventMutation,
  useUpdateEventMutation,
} from "@/lib/mutations/event.mutation";
import { toast } from "sonner";

export function HomePage() {
  const result: any = useQuery({ ...useEventsQuery() });

  if (result.isLoading) {
    return <p>Loading...</p>;
  }

  const { data: message } = result.data;
  console.log(message);

  return (
    <div className="relative space-y-4">
      <h1 className="font-semibold text-2xl">All Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {message.map((event: any) => {
          return (
            <div
              key={event.id}
              className="relative border p-4 rounded-md shadow-lg"
            >
              <h1 className="text-2xl font-semibold text-stone-800">
                {event.title}
              </h1>
              <EditDialogTrigger event={event}>
                <Button
                  type="button"
                  className={button({ class: "absolute top-2 right-2" })}
                >
                  <SettingsIcon
                    className="shrink-0 size-4"
                    aria-label="Edit or delete event"
                  />
                  <span className="sr-only">Edit or delete event</span>
                </Button>
              </EditDialogTrigger>
              <EventStatusBadge status={event.status} />
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Start Date</p>
                  <p className="inline-flex gap-1 items-center text-sm">
                    <ClockIcon className="shrink-0 size-4" aria-label="" />
                    {formatDate(event.startDate)}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">End Date</p>
                  <p className="inline-flex gap-1 items-center text-sm">
                    <ClockIcon className="shrink-0 size-4" aria-label="" />
                    {formatDate(event.endDate)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditDialogTrigger({
  children,
  event,
}: PropsWithChildren<{ event: z.infer<typeof eventUpdateSchema> }>) {
  const toastUpdateId = "event:edit";
  const toastDeleteId = "event:delete";

  const [edit, setEdit] = useState(false);
  const [osOpen, setIsOpen] = useState(false);

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
      id: event.id,
      title: event.title,
      price: new Decimal(event.price).div(100).toNumber(),
      startDate: formatDateInput(+event.startDate),
      endDate: formatDateInput(+event.endDate),
      status: event.status,
    },
  });

  const handleOnClose = () => {
    if (deleteEventMutation.isPending || updateEventMutation.isPending) {
      return;
    }

    /** @dev this should not happen */
    form.reset();
    setEdit(false);

    deleteEventMutation.mutate(
      { id: event.id },
      {
        onSuccess() {
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

  console.log("errors:", form.formState.errors);

  const submit = form.handleSubmit((data) => {
    if (deleteEventMutation.isPending || updateEventMutation.isPending) {
      return;
    }

    console.log(data);

    updateEventMutation.mutate(data, {
      onSuccess(data) {
        console.log(data);
        form.reset();
        toast.success("Event have been succesfully updated", {
          id: toastUpdateId,
          duration: 3000,
        });
      },
      onError(data) {
        console.log(data);
      },
    });
  });

  return (
    <DialogTrigger>
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
                  <div className="h-full">
                    <div className="flex gap-2 items-center">
                      <h2 className="text-xl font-semibold">{event.title}</h2>
                      <EventStatusBadge status={event.status} />
                    </div>
                    <div>
                      <p>
                        <span className="font-semibold">Price: </span>
                        <span>
                          ${new Decimal(event.price).div(100).toNumber()}
                        </span>
                      </p>
                    </div>
                    <div className="grid grid-cols-2">
                      <div>
                        <ClockIcon className="shrink-0 size-4" />
                        <time>{formatDate(+event.startDate)}</time>
                      </div>
                      <div>
                        <ClockIcon className="shrink-0 size-4" />
                        <time>{formatDate(+event.endDate)}</time>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    <form onSubmit={submit}>
                      <input
                        type="hidden"
                        value={event.id}
                        {...form.register("id")}
                      />
                      <fieldset className="space-y-4">
                        <Controller
                          control={form.control}
                          name="title"
                          render={({ field }) => {
                            return (
                              <div className="space-y-1">
                                <Label className="font-semibold w-full">
                                  Title
                                </Label>
                                <Input
                                  className="w-full border px-1.5 py-2 rounded-md focus:outline-none"
                                  {...field}
                                />
                              </div>
                            );
                          }}
                        />
                        <Controller
                          control={form.control}
                          name="price"
                          render={({ field }) => {
                            return (
                              <div className="space-y-1">
                                <Label
                                  htmlFor={field.name}
                                  className="font-semibold w-full"
                                >
                                  Price
                                </Label>
                                <Input
                                  className="w-full border px-1.5 py-2 rounded-md focus:outline-none"
                                  {...field}
                                />
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
                                  onChange={(val) => {
                                    console.log(val);
                                  }}
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
                                        <ListBoxItem className="cursor-pointer w-[calc(theme(spacing.96)-theme(spacing.8))] -mx-2 hover:bg-blue-100 py-1.5 px-2">
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
                              <div className="space-y-1">
                                <Label
                                  className="font-semibold"
                                  htmlFor={field.name}
                                >
                                  Start Date
                                </Label>
                                <Input
                                  className="w-full border px-1.5 py-2 rounded-md focus:outline"
                                  {...field}
                                />
                              </div>
                            );
                          }}
                        />
                        <Controller
                          control={form.control}
                          name="endDate"
                          render={({ field }) => {
                            return (
                              <div className="space-y-1">
                                <Label
                                  htmlFor={field.name}
                                  className="font-semibold"
                                >
                                  End Date
                                </Label>
                                <Input
                                  className="w-full border px-1.5 py-2 rounded-md focus:outline-none"
                                  {...field}
                                />
                              </div>
                            );
                          }}
                        />
                      </fieldset>
                      <Button type="submit" className={button()}>
                        Update
                      </Button>
                    </form>
                  </div>
                )}
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
                  {edit ? (
                    <></>
                  ) : (
                    <Button
                      type="button"
                      isDisabled={deleteEventMutation.isPending}
                      onPress={() => {
                        handleOnClose();
                        if (deleteEventMutation.isSuccess) {
                          close();
                        }
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

function EventStatusBadge({
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

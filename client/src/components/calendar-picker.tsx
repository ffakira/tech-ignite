import React, {
  forwardRef,
  type InputHTMLAttributes,
  type ForwardedRef,
} from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Group,
  Input,
  Label,
  Popover,
  Calendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarCell,
  CalendarHeaderCell,
  Heading,
} from "react-aria-components";
import { today, getLocalTimeZone } from "@internationalized/date";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { toast } from "sonner";
import {
  calendarCell,
  calendarHeaderButton,
  calendarHeading,
} from "@/components/ui/calendar";
import { button } from "@/components/ui/button";

export interface CalendarPickerProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * @TODO add validation for date
 */
export const CalendarPicker = forwardRef<HTMLInputElement, CalendarPickerProps>(
  (
    {
      name,
      label,
      placeholder,
      value,
      onChange,
      ...props
    }: CalendarPickerProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div className="space-y-1.5">
        <Label className="font-semibold text-stone-700" htmlFor={name}>
          {label}
        </Label>
        <Group className="relative flex border rounded-md px-2 py-1.5">
          <Input
            ref={ref}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...props}
            className="flex-1 text-stone-700 -my-1.5 w-full bg-transparent focus:outline-none"
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
                    minValue={today(getLocalTimeZone())}
                    onChange={(data) => {
                      const date = `${String(data.day).padStart(2, "0")}/${String(data.month).padStart(2, "0")}/${data.year}`;
                      onChange({
                        target: { value: date } as EventTarget &
                          HTMLInputElement,
                      } as React.ChangeEvent<HTMLInputElement>);
                      toast.info(`Date changed: ${date}`, {
                        id: "onDateChangeToastId",
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
                      <Button className={calendarHeaderButton()} slot="next">
                        <ChevronRightIcon
                          className="group-data-[disabled]:text-gray-400"
                          aria-label="Next month"
                        />
                      </Button>
                    </header>
                    <CalendarGrid>
                      <CalendarGridHeader>
                        {(day) => (
                          <CalendarHeaderCell>{day}</CalendarHeaderCell>
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
      </div>
    );
  }
);

CalendarPicker.displayName = "CalendarPicker";

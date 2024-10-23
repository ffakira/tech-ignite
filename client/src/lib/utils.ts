import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDateString(date: string) {
  /** @dev regex date format dd/mm/yyyy */
  const regexDate =
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(0[1-9]\d{3}|[1-9]\d{3})$/;

  if (!regexDate.test(date)) {
    return false;
  }

  const splitDate = date.split("/");

  if (splitDate.length !== 3) {
    return false;
  }

  const [day, month, year] = splitDate.map((val) => parseInt(val));

  const dateObj = new Date(year, month - 1, day);
  return dateObj;
}

import { QueryClient } from "@tanstack/react-query";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryClient = new QueryClient();

/**
 * @dev parse date string to Date object
 */
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

/**
 * @dev format is in dd MMM yyyy
 */
export function formatDate(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * @dev format is in dd/mm/yyyy
 */
export function formatDateInput(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

import { tv } from "tailwind-variants";

export const calendarHeading = tv({
  base: "font-semibold text-xl text-stone-700 flex",
});

export const calendarCell = tv({
  base: "flex justify-center aria-disabled:cursor-not-allowed aria-disabled:text-gray-500 items-center data-[focused=true]:bg-blue-500 data-[focused=true]:text-white data-[focused=true]:font-semibold data-[hovered]:bg-blue-100 data-[hovered]:text-black data-[hovered]:font-normal size-5 rounded-md p-5 focus:outline-none",
});

export const calendarHeaderButton = tv({
  base: "group data-[disabled]:cursor-not-allowed inline-flex justify-center items-center data-[hovered=true]:bg-gray-300 rounded-md size-8",
});

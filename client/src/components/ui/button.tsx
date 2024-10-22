import { tv } from "tailwind-variants";

export const button = tv({
  base: "px-4 py-2 rounded-md flex-inline items-center justify-center cursor-pointer",
  variants: {
    variant: {
      primary: "bg-blue-500 text-white",
      secondary: "bg-gray-500 text-white",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

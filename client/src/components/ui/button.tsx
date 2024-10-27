import { tv } from "tailwind-variants";

export const button = tv({
  base: "px-4 py-2 rounded-md flex-inline items-center justify-center cursor-pointer font-semibold",
  variants: {
    variant: {
      primary: "bg-blue-500 text-white hover:bg-blue-700",
      secondary: "bg-stone-400 text-white hover:bg-stone-500",
      danger: "bg-red-500 text-white hover:bg-red-700",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

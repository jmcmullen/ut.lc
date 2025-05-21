import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-bold transition-colors focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-cyan text-white hover:bg-opacity-70",
        secondary: "bg-dark-violet text-white hover:bg-opacity-90",
      },
      size: {
        sm: "py-2 px-4 text-sm",
        md: "py-2 px-6 text-base md:py-3 md:px-8 md:text-lg",
        lg: "py-3 px-8 text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      rounded: {
        true: "rounded-full",
        false: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
      rounded: true,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant,
  size,
  fullWidth,
  rounded,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        buttonVariants({ variant, size, fullWidth, rounded }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

import * as React from "react";
import { cn } from "@/utils/cn";
import {
  NumericFormat,
  NumericFormatProps,
  PatternFormat,
} from "react-number-format";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

const CurrencyInput = React.forwardRef<HTMLInputElement, NumericFormatProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <NumericFormat
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        allowNegative={false}
        decimalScale={2}
        fixedDecimalScale
        getInputRef={ref}
        {...props}
      />
    );
  }
);

const PhoneRegex = /^\+\d{2} \(\d{2}\) \d{5}-\d{4}$/

const PhoneInput = React.forwardRef<HTMLInputElement, NumericFormatProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <PatternFormat
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        format="+55 (##) 9####-####"
        mask="_"
        getInputRef={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
CurrencyInput.displayName = "CurrencyInput";
PhoneInput.displayName = "PhoneInput";

export { Input, CurrencyInput, PhoneInput, PhoneRegex };

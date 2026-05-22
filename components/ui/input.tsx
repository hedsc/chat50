import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  erro?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, erro, ...props }, ref) => (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          erro ? "border-red-400 focus-visible:ring-red-400" : "border-input",
          className
        )}
        ref={ref}
        {...props}
      />
      {erro && <p className="mt-1 text-xs text-red-500">{erro}</p>}
    </div>
  )
);
Input.displayName = "Input";

export { Input };

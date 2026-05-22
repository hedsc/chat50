import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { obrigatorio?: boolean }
>(({ className, obrigatorio, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "block text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  >
    {children}
    {obrigatorio && <span className="ml-1 text-red-500">*</span>}
  </label>
));
Label.displayName = "Label";

export { Label };

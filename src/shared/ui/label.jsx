import * as React from "react";
import { cn } from "./utils";

function Label({ htmlFor, children, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={cn("block text-sm font-medium text-gray-700 mb-1", className)}>
      {children}
    </label>
  );
}

export { Label };

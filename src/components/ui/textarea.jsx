import React from "react";

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none ${className}`}
    />
  );
}

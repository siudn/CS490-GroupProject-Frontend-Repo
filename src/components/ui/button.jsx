import React from "react";

export function Button({ children, className = "", variant = "default", ...props }) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2";
  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-400",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

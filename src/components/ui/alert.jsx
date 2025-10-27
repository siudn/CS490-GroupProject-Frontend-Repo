import React from "react";

export function Alert({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-gray-50 border border-gray-200 text-gray-700",
    destructive: "bg-red-50 border border-red-200 text-red-600",
  };
  return <div className={`p-4 rounded-md ${variants[variant]} ${className}`}>{children}</div>;
}

export function AlertDescription({ children }) {
  return <p className="text-sm">{children}</p>;
}

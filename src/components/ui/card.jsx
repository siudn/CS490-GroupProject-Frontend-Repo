import * as React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "grid auto-rows-min items-start gap-2 px-6 pt-6 border-b border-gray-100",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return (
    <div
      className={cn("px-6 py-4", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center px-6 py-4 border-t border-gray-100", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};

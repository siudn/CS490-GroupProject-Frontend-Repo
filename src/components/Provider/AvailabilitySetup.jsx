import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const timeSlots = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM"
];

const schema = z.object({
  days: z.object({
    monday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    tuesday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    wednesday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    thursday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    friday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    saturday: z.object({ available: z.boolean(), start: z.string(), end: z.string() }),
    sunday: z.object({ available: z.boolean(), start: z.string(), end: z.string() })
  })
}).refine((data) => {
  // At least one day must be available
  return Object.values(data.days).some(day => day.available);
}, {
  message: "At least one day must be available"
});

export default function AvailabilitySetup() {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      days: {
        monday: { available: true, start: "9:00 AM", end: "5:00 PM" },
        tuesday: { available: true, start: "9:00 AM", end: "5:00 PM" },
        wednesday: { available: true, start: "9:00 AM", end: "5:00 PM" },
        thursday: { available: true, start: "9:00 AM", end: "5:00 PM" },
        friday: { available: true, start: "9:00 AM", end: "5:00 PM" },
        saturday: { available: false, start: "9:00 AM", end: "5:00 PM" },
        sunday: { available: false, start: "9:00 AM", end: "5:00 PM" }
      }
    }
  });

  const onSubmit = (data) => {
    console.log("Availability saved:", data);
    alert("Availability saved successfully!");
  };

  const DayRow = ({ day, displayName }) => {
    const dayData = watch(`days.${day}`);
    
    return (
      <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-200 last:border-b-0">
        {/* Day Name */}
        <div className="col-span-3 flex items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register(`days.${day}.available`)}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <span className="font-medium text-gray-900">{displayName}</span>
          </label>
        </div>

        {/* Start Time */}
        <div className="col-span-4">
          <select
            {...register(`days.${day}.start`)}
            disabled={!dayData?.available}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
          >
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        {/* End Time */}
        <div className="col-span-4">
          <select
            {...register(`days.${day}.end`)}
            disabled={!dayData?.available}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
          >
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Set Your Weekly Availability
        </h2>
        <p className="text-gray-600">
          Configure your available hours for each day of the week
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 py-3 border-b-2 border-gray-300 mb-4">
          <div className="col-span-3 font-semibold text-gray-700">Day</div>
          <div className="col-span-4 font-semibold text-gray-700">Start Time</div>
          <div className="col-span-4 font-semibold text-gray-700">End Time</div>
        </div>

        {/* Day Rows */}
        <DayRow day="monday" displayName="Monday" />
        <DayRow day="tuesday" displayName="Tuesday" />
        <DayRow day="wednesday" displayName="Wednesday" />
        <DayRow day="thursday" displayName="Thursday" />
        <DayRow day="friday" displayName="Friday" />
        <DayRow day="saturday" displayName="Saturday" />
        <DayRow day="sunday" displayName="Sunday" />

        {/* Error Message */}
        {errors.days && (
          <p className="text-red-600 mt-4">{errors.days.message}</p>
        )}

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-medium"
          >
            Save Availability
          </button>
        </div>
      </form>
    </div>
  );
}


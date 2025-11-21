import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  fetchAvailability,
  createAvailability,
  updateAvailability,
} from "../api.js";

const timeSlots = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
];

const convertTo24Hour = (time12h) => {
  const [time, period] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  hours = Number.parseInt(hours, 10);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes}:00`;
};

const convertTo12Hour = (time24h) => {
  if (!time24h) return "9:00 AM";
  const [hoursStr, minutesStr] = time24h.split(":");
  let hours = Number.parseInt(hoursStr, 10);
  const minutes = minutesStr ?? "00";
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes.slice(0, 2)} ${period}`;
};

const schema = z
  .object({
    days: z.object({
      monday: z.object({
        available: z.boolean(),
        start: z.string(),
        end: z.string(),
      }),
      tuesday: z.object({
        available: z.boolean(),
        start: z.string(),
        end: z.string(),
      }),
      wednesday: z.object({
        available: z.boolean(),
        start: z.string(),
        end: z.string(),
      }),
      thursday: z.object({
        available: z.boolean(),
        start: z.string(),
        end: z.string(),
      }),
      friday: z.object({
        available: z.boolean(),
        start: z.string(),
        end: z.string(),
      }),
      saturday: z.object({
        available: z.boolean(),
        start: z.string(),
        end: z.string(),
      }),
      sunday: z.object({
        available: z.boolean(),
        start: z.string(),
        end: z.string(),
      }),
    }),
  })
  .refine(
    (data) => Object.values(data.days).some((day) => day.available),
    {
      message: "At least one day must be available",
    }
  );

const DAY_MAPPING = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const INVERSE_DAY_MAPPING = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export default function AvailabilitySetup() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [existingEntries, setExistingEntries] = useState({});

  const defaultDayState = useMemo(
    () => ({
      monday: { available: true, start: "9:00 AM", end: "5:00 PM" },
      tuesday: { available: true, start: "9:00 AM", end: "5:00 PM" },
      wednesday: { available: true, start: "9:00 AM", end: "5:00 PM" },
      thursday: { available: true, start: "9:00 AM", end: "5:00 PM" },
      friday: { available: true, start: "9:00 AM", end: "5:00 PM" },
      saturday: { available: false, start: "9:00 AM", end: "5:00 PM" },
      sunday: { available: false, start: "9:00 AM", end: "5:00 PM" },
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { days: defaultDayState },
  });

  const loadAvailability = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    fetchAvailability()
      .then((response) => {
        const fetched = response?.availability ?? [];
        if (!Array.isArray(fetched) || fetched.length === 0) {
          setExistingEntries({});
          reset({ days: defaultDayState });
          return;
        }

        const nextDays = { ...defaultDayState };
        const entryMap = {};
        fetched.forEach((entry) => {
          const dayKey = INVERSE_DAY_MAPPING[entry.day_of_week];
          if (!dayKey) return;
          entryMap[dayKey] = entry.id;
          nextDays[dayKey] = {
            available: entry.is_active ?? true,
            start: convertTo12Hour(entry.start_time),
            end: convertTo12Hour(entry.end_time),
          };
        });
        setExistingEntries(entryMap);
        reset({ days: nextDays });
      })
      .catch((err) => {
        setLoadError(
          err instanceof Error ? err.message : "Failed to load availability."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [defaultDayState, reset]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const onSubmit = async (data) => {
    const entries = Object.entries(data.days)
      .map(([dayName, day]) => {
        const entryId = existingEntries[dayName];
        if (!day.available) {
          if (entryId) {
            return {
              id: entryId,
              day_of_week: DAY_MAPPING[dayName],
              start_time: null,
              end_time: null,
              is_active: false,
            };
          }
          return null;
        }

        const payload = {
          day_of_week: DAY_MAPPING[dayName],
          start_time: convertTo24Hour(day.start),
          end_time: convertTo24Hour(day.end),
          is_active: true,
        };

        return entryId ? { ...payload, id: entryId } : payload;
      })
      .filter(Boolean);

  const createList = entries.filter((entry) => !entry.id && entry.is_active);
  const updateList = entries.filter((entry) => entry.id);

    if (createList.length === 0 && updateList.length === 0) {
      setSaveError("Please select at least one active day.");
      return;
    }

    setSaveError(null);
    setSaveSuccess(false);
    setSaving(true);

    try {
      if (createList.length > 0) {
        await createAvailability(createList);
      }
      if (updateList.length > 0) {
        await updateAvailability(updateList);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      loadAvailability();
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save availability."
      );
    } finally {
      setSaving(false);
    }
  };

  const DayRow = ({ day, displayName }) => {
    const dayData = watch(`days.${day}`);
    return (
      <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-200 last:border-b-0">
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
        <div className="col-span-4">
          <select
            {...register(`days.${day}.start`)}
            disabled={!dayData?.available}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-4">
          <select
            {...register(`days.${day}.end`)}
            disabled={!dayData?.available}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
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

      {loadError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {saveError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {saveError}
        </div>
      )}

      {saveSuccess && (
        <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Availability saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-4 py-3 border-b-2 border-gray-300 mb-4">
          <div className="col-span-3 font-semibold text-gray-700">Day</div>
          <div className="col-span-4 font-semibold text-gray-700">Start Time</div>
          <div className="col-span-4 font-semibold text-gray-700">End Time</div>
        </div>

        <DayRow day="monday" displayName="Monday" />
        <DayRow day="tuesday" displayName="Tuesday" />
        <DayRow day="wednesday" displayName="Wednesday" />
        <DayRow day="thursday" displayName="Thursday" />
        <DayRow day="friday" displayName="Friday" />
        <DayRow day="saturday" displayName="Saturday" />
        <DayRow day="sunday" displayName="Sunday" />

        {errors.days && (
          <p className="text-red-600 mt-4">{errors.days.message}</p>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading || saving}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : loading ? "Loading..." : "Save Availability"}
          </button>
        </div>
      </form>
    </div>
  );
}


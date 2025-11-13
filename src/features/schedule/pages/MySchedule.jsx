import { useEffect, useState, useCallback } from "react";
import { fetchAvailability } from "../api.js";
import { Clock, Calendar, AlertCircle, CheckCircle } from "lucide-react";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const convertTo12Hour = (time24h) => {
  if (!time24h) return "N/A";
  const [hoursStr, minutesStr] = time24h.split(":");
  let hours = Number.parseInt(hoursStr, 10);
  const minutes = minutesStr ?? "00";
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes.slice(0, 2)} ${period}`;
};

export default function MySchedule() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAvailability();
      const availabilities = response?.availability ?? [];
      setAvailability(Array.isArray(availabilities) ? availabilities : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load availability schedule."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  // Group availability by day of week
  const availabilityByDay = availability.reduce((acc, entry) => {
    if (!acc[entry.day_of_week]) {
      acc[entry.day_of_week] = [];
    }
    acc[entry.day_of_week].push(entry);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading schedule...</div>
      </div>
    );
  }

  if (error) {
    // Check if it's a barber profile not found error
    const isBarberNotFound = error.includes("Barber profile not found") || 
                            error.includes("Missing barber_id") ||
                            error.includes("Barber not found");
    
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-yellow-800 font-medium mb-2">Barber Profile Not Set Up</p>
            <p className="text-yellow-700 text-sm mb-4">
              Your account needs to be associated with a barber profile before you can manage your schedule.
              Please contact your salon owner or administrator to set up your barber profile.
            </p>
            {error && (
              <details className="mt-2">
                <summary className="text-yellow-700 text-xs cursor-pointer hover:text-yellow-800">
                  Technical details
                </summary>
                <p className="text-yellow-600 text-xs mt-1 font-mono">{error}</p>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Weekly Schedule</h1>
          <p className="text-gray-600 mt-1">View your weekly availability</p>
        </div>
        <button
          onClick={loadAvailability}
          className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-900 rounded-md hover:bg-gray-200 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {availability.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">No availability set</p>
          <p className="text-gray-500 text-sm mb-4">
            Set up your weekly availability to start receiving appointments.
          </p>
          <button
            onClick={() => window.location.href = "/barber/schedule/edit"}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium"
          >
            Set Up Availability
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="space-y-4">
              {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
                const dayEntries = availabilityByDay[dayOfWeek] || [];
                const activeEntries = dayEntries.filter((e) => e.is_active);

                return (
                  <div
                    key={dayOfWeek}
                    className="flex items-center py-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="w-32 flex-shrink-0">
                      <span className="font-semibold text-gray-900">
                        {DAY_NAMES[dayOfWeek]}
                      </span>
                    </div>
                    <div className="flex-1">
                      {activeEntries.length === 0 ? (
                        <span className="text-gray-400 italic">Not available</span>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {activeEntries.map((entry, idx) => (
                            <div
                              key={entry.id || idx}
                              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md"
                            >
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">
                                {convertTo12Hour(entry.start_time)} - {convertTo12Hour(entry.end_time)}
                              </span>
                              {entry.is_active && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> To update your availability, use the Shift Editor page.
        </p>
      </div>
    </section>
  );
}

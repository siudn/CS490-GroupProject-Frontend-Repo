import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarIcon,
  Clock,
  User as UserIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { fetchAppointments, patchAppointment } from "../api.js";

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

const toDisplayTime = (time24) => {
  if (!time24) return "12:00 PM";
  const [hourStr, minuteStr] = time24.split(":");
  let hour = Number.parseInt(hourStr, 10);
  if (Number.isNaN(hour)) return time24;
  const minute = minuteStr ?? "00";
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute.slice(0, 2)} ${period}`;
};

const to24Hour = (time12) => {
  const [time, period] = time12.split(" ");
  if (!time || !period) return "00:00:00";
  let [hours, minutes] = time.split(":");
  let hourInt = Number.parseInt(hours, 10);
  if (Number.isNaN(hourInt)) hourInt = 0;
  if (period === "PM" && hourInt !== 12) hourInt += 12;
  if (period === "AM" && hourInt === 12) hourInt = 0;
  return `${hourInt.toString().padStart(2, "0")}:${(minutes ?? "00").padEnd(
    2,
    "0"
  )}:00`;
};

const normalizeAppointment = (raw) => {
  const appointmentDate = raw?.appointment_date ?? raw?.date ?? "";
  const startTime = raw?.start_time ?? raw?.time ?? "";
  const price =
    Number.parseFloat(raw?.price) ||
    Number.parseFloat(raw?.total_price) ||
    Number.parseFloat(raw?.service?.price) ||
    0;

  return {
    ...raw,
    id: raw?.id ?? raw?.appointment_id ?? `${appointmentDate}-${startTime}`,
    appointment_date: appointmentDate,
    start_time: startTime,
    end_time: raw?.end_time ?? null,
    displayTime: toDisplayTime(startTime),
    status: raw?.status ?? "scheduled",
    notes: raw?.notes ?? "",
    price,
  };
};

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editFormData, setEditFormData] = useState({
    time: "",
    notes: "",
    status: "scheduled",
  });
  const [conflictError, setConflictError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const handleDateClick = (dateNumber) => {
    if (dateNumber >= 1 && dateNumber <= 31 && !Number.isNaN(dateNumber)) {
      const newDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        dateNumber
      );
      setSelectedDate(newDate);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const loadAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    setAppointmentsError(null);
    try {
      const response = await fetchAppointments();
      const rows = Array.isArray(response?.appointments)
        ? response.appointments
        : Array.isArray(response)
        ? response
        : [];
      setAppointments(rows.map(normalizeAppointment));
    } catch (err) {
      setAppointmentsError(
        err instanceof Error
          ? err.message
          : "Failed to load appointments for this barber."
      );
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const getCalendarDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startDay - 1; i >= 0; i -= 1) {
      days.push({
        date: prevMonthDays - i,
        month: -1,
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i += 1) {
      days.push({
        date: i,
        month: 0,
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i += 1) {
      days.push({
        date: i,
        month: 1,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const selectedDateISO = useMemo(
    () => selectedDate.toISOString().split("T")[0],
    [selectedDate]
  );

  const todayAppointments = appointments.filter(
    (a) => a.appointment_date === selectedDateISO
  );

  const appointmentsByDate = appointments.reduce((acc, apt) => {
    if (!apt.appointment_date) return acc;
    if (!acc[apt.appointment_date]) {
      acc[apt.appointment_date] = [];
    }
    acc[apt.appointment_date].push(apt);
    return acc;
  }, {});

  const sortedDates = Object.keys(appointmentsByDate).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const isPastDate = (dateString) => {
    const appointmentDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate < today;
  };

  const getSlotStatus = (time) => {
    const hasAppointment = todayAppointments.find(
      (a) => a.displayTime === time
    );
    const isBlocked = blockedSlots.includes(time);

    if (hasAppointment) return "booked";
    if (isBlocked) return "blocked";
    return "available";
  };

  const handleBlockSlot = () => {
    if (!selectedSlot) return;

    const hasExistingAppointment = todayAppointments.find(
      (a) => a.displayTime === selectedSlot
    );

    if (hasExistingAppointment) {
      setConflictError(
        `Cannot block ${selectedSlot} - Appointment already scheduled at this time`
      );
      setTimeout(() => setConflictError(null), 5000);
      return;
    }

    setBlockedSlots((prev) => [...prev, selectedSlot]);
    setShowBlockDialog(false);
    setSelectedSlot("");
    setConflictError(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleUnblockSlot = (time) => {
    setBlockedSlots((prev) => prev.filter((slot) => slot !== time));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setEditFormData({
      time: appointment.displayTime ?? "9:00 AM",
      notes: appointment.notes ?? "",
      status: appointment.status ?? "scheduled",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAppointment) return;

    const conflictingTime = editFormData.time;
    const hasConflict = todayAppointments.some(
      (a) =>
        a.displayTime === conflictingTime && a.id !== editingAppointment?.id
    );
    const isBlocked = blockedSlots.includes(conflictingTime);

    if (hasConflict) {
      setConflictError(
        `Cannot schedule at ${conflictingTime} - Time slot is already booked`
      );
      setTimeout(() => setConflictError(null), 5000);
      return;
    }

    if (isBlocked) {
      setConflictError(
        `Cannot schedule at ${conflictingTime} - Time slot is blocked`
      );
      setTimeout(() => setConflictError(null), 5000);
      return;
    }

    try {
      setSavingEdit(true);
      await patchAppointment({
        id: editingAppointment.id,
        start_time: to24Hour(editFormData.time),
        notes: editFormData.notes || undefined,
        status: editFormData.status,
      });
      setShowEditModal(false);
      setEditingAppointment(null);
      await loadAppointments();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setConflictError(
        err instanceof Error
          ? err.message
          : "Failed to update appointment via backend PATCH /api/appointments."
      );
      setTimeout(() => setConflictError(null), 5000);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingAppointment(null);
  };

  return (
    <div className="space-y-6">
      {savedSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <p className="text-green-600">Schedule updated successfully!</p>
        </div>
      )}

      {conflictError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <p className="text-red-600">{conflictError}</p>
        </div>
      )}

      {appointmentsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {appointmentsError}
        </div>
      )}

      <div className="mb-6">
        <nav className="flex p-1 bg-gray-200 rounded-full w-full">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 py-2 font-medium text-sm rounded-full ${
              activeTab === "schedule"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            My Schedule
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex-1 py-2 font-medium text-sm rounded-full ${
              activeTab === "notifications"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Notifications
          </button>
        </nav>
      </div>

      {activeTab === "schedule" && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <CalendarIcon className="w-5 h-5 text-gray-600" />
                  <p className="text-sm text-gray-600">Today&apos;s Appointments</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {todayAppointments.length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <p className="text-sm text-gray-600">Hours Booked</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {(todayAppointments.length * 0.75).toFixed(1)}h
                </p>
                <p className="text-xs text-gray-500 mt-1">~45 min per appointment</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                  <p className="text-sm text-gray-600">Expected Revenue</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  $
                  {todayAppointments
                    .reduce((sum, a) => sum + (a.price ?? 0), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Daily Schedule</h2>
              <p className="text-gray-600">View and manage your appointments</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={handlePrevMonth}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {currentMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <button
                    onClick={handleNextMonth}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-0 mb-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-600 py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7" style={{ gap: "2px" }}>
                  {getCalendarDates().map((day, idx) => {
                    const isSelected =
                      day.isCurrentMonth &&
                      selectedDate.getDate() === day.date &&
                      selectedDate.getMonth() === currentMonth.getMonth() &&
                      selectedDate.getFullYear() === currentMonth.getFullYear();
                    const now = new Date();
                    const isToday =
                      day.isCurrentMonth &&
                      now.getDate() === day.date &&
                      now.getMonth() === currentMonth.getMonth() &&
                      now.getFullYear() === currentMonth.getFullYear();

                    return (
                      <button
                        key={idx}
                        onClick={() =>
                          day.isCurrentMonth && handleDateClick(day.date)
                        }
                        style={{ width: "100%", height: "32px" }}
                        className={`flex items-center justify-center text-xs rounded bg-gray-100 border border-gray-300 ${
                          isSelected
                            ? "bg-gray-900 text-white font-semibold"
                            : day.isCurrentMonth
                            ? "hover:bg-gray-200 text-gray-600"
                            : "text-gray-300 cursor-not-allowed"
                        } ${
                          isToday && !isSelected ? "border-blue-500 border-2" : ""
                        }`}
                        disabled={!day.isCurrentMonth}
                      >
                        {day.date}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedDate.toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <button
                    onClick={() => setShowBlockDialog(true)}
                    className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-900 rounded-md hover:bg-gray-200 text-sm font-medium"
                  >
                    Block Time
                  </button>
                </div>

                <div
                  className="max-h-96 overflow-y-auto flex flex-col"
                  style={{ gap: "20px" }}
                >
                  {timeSlots.map((time) => {
                    const status = getSlotStatus(time);
                    const appointment = todayAppointments.find(
                      (a) => a.displayTime === time
                    );

                    return (
                      <div
                        key={time}
                        style={{
                          paddingTop: "12px",
                          paddingBottom: "12px",
                          paddingLeft: "20px",
                          paddingRight: "20px",
                        }}
                        className={`rounded-lg border border-gray-200 ${
                          status === "booked"
                            ? "bg-blue-50 border-blue-200"
                            : status === "blocked"
                            ? "bg-gray-100 border-gray-300"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-700">
                              {time}
                            </span>
                          </div>

                          {status === "booked" && appointment && (
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                Booked
                              </span>
                              <span className="text-sm text-gray-600">Customer</span>
                            </div>
                          )}

                          {status === "blocked" && (
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-700 font-medium">
                                Blocked
                              </span>
                              <button
                                onClick={() => handleUnblockSlot(time)}
                                className="px-3 py-1.5 bg-gray-200 border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-300"
                              >
                                Unblock
                              </button>
                            </div>
                          )}

                          {status === "available" && (
                            <button className="px-3 py-1.5 bg-gray-200 border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-300">
                              Available
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                All Appointments
              </h2>
              <p className="text-sm text-gray-600">
                View and manage all your appointments
              </p>
            </div>

            {loadingAppointments ? (
              <div className="text-sm text-gray-500">Loading appointments…</div>
            ) : sortedDates.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No appointments scheduled</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedDates.map((date) => {
                  const dateAppointments = appointmentsByDate[date];
                  const dateObj = new Date(date);
                  const past = isPastDate(date);

                  return (
                    <div
                      key={date}
                      className="border-b border-gray-200 pb-6 last:border-b-0"
                    >
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {dateObj.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {past && (
                            <span className="ml-2 text-sm text-gray-500">
                              (Past)
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {dateAppointments.length} appointment
                          {dateAppointments.length !== 1 ? "s" : ""}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {dateAppointments
                          .slice()
                          .sort((a, b) => a.displayTime.localeCompare(b.displayTime))
                          .map((appointment) => (
                            <div
                              key={appointment.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Clock className="h-4 w-4" />
                                  <span className="font-medium">
                                    {appointment.displayTime}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    Customer
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Barber-side details unavailable
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-gray-800 text-white rounded text-sm font-medium">
                                  ${appointment.price.toFixed(2)}
                                </span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium capitalize">
                                  {appointment.status.replace("_", " ")}
                                </span>
                                {!past && (
                                  <button
                                    onClick={() => handleEditAppointment(appointment)}
                                    className="px-3 py-1.5 bg-gray-200 border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={savingEdit}
                                  >
                                    Edit
                                  </button>
                                )}
                                {past && (
                                  <span className="text-xs text-gray-500">
                                    Completed
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <p className="text-gray-500">No notifications</p>
        </div>
      )}

      {showBlockDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Block Time Slot</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a time slot to mark as unavailable
            </p>
            <div className="space-y-2 mb-4">
              {timeSlots
                .filter((time) => getSlotStatus(time) === "available")
                .map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedSlot(time)}
                    className={`w-full px-4 py-2 rounded-md ${
                      selectedSlot === time
                        ? "bg-gray-900 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBlockDialog(false);
                  setSelectedSlot("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockSlot}
                disabled={!selectedSlot}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Block Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Edit Appointment</h3>
              <p className="text-sm text-gray-600">Update appointment details</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <select
                  value={editFormData.time}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={editFormData.notes}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Add any notes about this appointment..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseEditModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {savingEdit ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button className="fixed bottom-6 right-6 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 flex items-center justify-center">
        ?
      </button>
    </div>
  );
}


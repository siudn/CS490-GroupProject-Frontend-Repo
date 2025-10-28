import { useEffect, useMemo, useState } from "react";
import { listAvailability, rescheduleAppointment } from "../api.js";

export default function RescheduleModal({ appt, onClose, onSuccess }) {
  const [dateISO, setDateISO] = useState(toISO(new Date(appt.whenISO)));
  const [slots, setSlots] = useState([]);
  const [time, setTime] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await listAvailability({
        salonId: appt.salon.id,
        employeeId: appt.employee.id,
        dateISO,
      });
      setSlots(s);
      setTime(null);
    })();
  }, [appt.salon.id, appt.employee.id, dateISO]);

  async function confirm() {
    if (!time) return;
    setSaving(true);
    const res = await rescheduleAppointment(appt.id, { dateISO, time });
    setSaving(false);
    if (res?.ok) {
      onSuccess({ ...appt, whenISO: res.updated.whenISO, status: "confirmed" });
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-16 mx-auto w-[min(760px,92vw)] rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold">Reschedule • {appt.salon.name}</div>
          <button onClick={onClose} className="rounded-md border px-3 py-1 hover:bg-gray-50">Close</button>
        </div>
        <div className="p-6 space-y-6">
          <div className="text-sm text-gray-600">
            Current: {new Date(appt.whenISO).toLocaleString()}
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="rounded-xl border p-3">
              <Calendar dateISO={dateISO} onDateISO={setDateISO} />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-2">Available Time Slots</div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {slots.map((s) => (
                  <button
                    key={s.time}
                    onClick={() => s.status === "free" && setTime(s.time)}
                    disabled={s.status !== "free"}
                    className={`rounded-xl border px-4 py-2 text-sm ${
                      s.status === "free"
                        ? "hover:bg-gray-50"
                        : s.status === "booked"
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-200 text-gray-400"
                    } ${time === s.time ? "ring-2 ring-violet-600 border-violet-600" : ""}`}
                    title={s.status === "blocked" ? "Blocked" : s.status === "booked" ? "Booked" : "Available"}
                  >
                    {toFriendlyTime(s.time)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="rounded-xl border px-4 py-2 hover:bg-gray-50">Cancel</button>
            <button
              onClick={confirm}
              disabled={!time || saving}
              className="rounded-xl bg-gray-900 text-white px-4 py-2 disabled:opacity-40"
            >
              {saving ? "Saving…" : "Confirm New Time"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Calendar({ dateISO, onDateISO }) {
  const d = new Date(dateISO);
  const ym = new Date(d.getFullYear(), d.getMonth(), 1);
  const days = buildCalendarDays(dateISO);
  const prev = () => onDateISO(toISO(new Date(d.getFullYear(), d.getMonth() - 1, d.getDate())));
  const next = () => onDateISO(toISO(new Date(d.getFullYear(), d.getMonth() + 1, d.getDate())));
  return (
    <div className="w-72">
      <div className="flex items-center justify-between mb-2">
        <button onClick={prev} className="rounded-md border px-2 py-1">&lt;</button>
        <div className="font-medium">{ym.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
        <button onClick={next} className="rounded-md border px-2 py-1">&gt;</button>
      </div>
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map((w) => <div key={w} className="text-center py-1">{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((cell) => (
          <button
            key={cell.key}
            disabled={!cell.currentMonth || cell.past}
            onClick={() => onDateISO(cell.iso)}
            className={`h-8 rounded-md text-sm ${
              cell.iso === dateISO ? "bg-black text-white" : "border hover:bg-gray-50"
            } ${!cell.currentMonth || cell.past ? "text-gray-400 border-gray-200" : ""}`}
          >
            {cell.day}
          </button>
        ))}
      </div>
    </div>
  );
}

function buildCalendarDays(dateISO) {
  const d = new Date(dateISO);
  const y = d.getFullYear(), m = d.getMonth();
  const first = new Date(y, m, 1);
  const start = new Date(y, m, 1 - first.getDay());
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const dt = new Date(start);
    dt.setDate(start.getDate() + i);
    cells.push({
      key: dt.toISOString(),
      iso: toISO(dt),
      day: dt.getDate(),
      currentMonth: dt.getMonth() === m,
      past: dt < stripTime(new Date()),
    });
  }
  return cells;
}
function toISO(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10); }
function stripTime(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function toFriendlyTime(hhmm){ if(!hhmm) return ""; const [h,m]=hhmm.split(":").map(Number); const ampm=h>=12?"PM":"AM"; const hh=((h+11)%12)+1; return `${hh}:${m.toString().padStart(2,"0")} ${ampm}`; }

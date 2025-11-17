import { useEffect, useMemo, useState } from "react";
import { createAppointment, listAvailability, listEmployees } from "../api.js";

export default function BookingWizardModal({ salon, onClose }) {
  const [step, setStep] = useState(1);
  const [employee, setEmployee] = useState(null);
  const [service, setService] = useState(null);
  const [dateISO, setDateISO] = useState(toISO(new Date()));
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [employees, setEmployees] = useState(salon.employees ?? []);
  const services = salon.services ?? [];

  useEffect(() => {
    if (salon.employees) return;
    (async () => {
      try {
        const rows = await listEmployees(salon.id);
        setEmployees(rows);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [salon]);

  useEffect(() => {
    if (!employee || !service || !dateISO) return;
    let alive = true;
    setSelectedSlot(null);
    setSlots([]);
    setError("");
    (async () => {
      try {
        const data = await listAvailability({
          salonId: salon.id,
          employeeId: employee.id,
          serviceId: service.id,
          dateISO,
        });
        if (alive) setSlots(data);
      } catch (err) {
        if (alive) setError("Unable to load availability for that day.");
      }
    })();
    return () => { alive = false; };
  }, [salon.id, employee, service, dateISO]);

  const progress = useMemo(() => {
    if (result) return 100;
    return Math.round((step / 4) * 100);
  }, [step, result]);

  const canNext =
    (step === 1 && !!employee) ||
    (step === 2 && !!service) ||
    (step === 3 && !!selectedSlot) ||
    step === 4;

  function next() {
    if (step < 4) setStep(step + 1);
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  async function handleConfirm() {
    if (!employee || !service || !selectedSlot) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        barber_id: employee.id,
        service_id: service.id,
        salon_id: salon.id,
        start_at: selectedSlot.start_at,
        end_at: selectedSlot.end_at,
        notes: note || undefined,
      };
      const created = await createAppointment(payload);
      setResult(created);
    } catch (err) {
      setError(err.message || "Failed to create appointment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-auto w-[min(960px,92vw)] rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="text-lg font-semibold">Book an Appointment</div>
            <div className="text-sm text-gray-600">
              {result ? "Confirmed" : `Step ${step} of 4`}
            </div>
          </div>
          <button onClick={onClose} className="rounded-md px-3 py-1 border hover:bg-gray-50">Close</button>
        </div>

        <div className="px-6 pt-4">
          <div className="h-2 rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-violet-600" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {result ? (
            <ConfirmationSummary appointment={result} onClose={onClose} />
          ) : (
            <>
              {step === 1 && (
                <Step1SelectEmployee
                  employees={employees}
                  value={employee}
                  onChange={setEmployee}
                />
              )}
              {step === 2 && (
                <Step2SelectService services={services} value={service} onChange={setService} />
              )}
              {step === 3 && (
                <Step3DateTime
                  dateISO={dateISO}
                  onDateISO={setDateISO}
                  slots={slots}
                  slot={selectedSlot}
                  onSelect={setSelectedSlot}
                  error={error}
                />
              )}
              {step === 4 && (
                <Step4Review
                  employee={employee}
                  service={service}
                  slot={selectedSlot}
                  note={note}
                  onNote={setNote}
                  error={error}
                  saving={saving}
                  onConfirm={handleConfirm}
                />
              )}
              {!result && (
                <div className="flex items-center justify-between gap-4">
                  <button onClick={back} className="w-40 rounded-xl border px-4 py-2 hover:bg-gray-50">
                    Back
                  </button>
                  <button
                    onClick={step < 4 ? next : undefined}
                    disabled={!canNext || step === 4}
                    className="w-48 rounded-xl bg-gray-900 text-white px-4 py-2 disabled:opacity-40"
                  >
                    {step < 4 ? "Continue" : "Review"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Step1SelectEmployee({ employees, value, onChange }) {
  if (!employees.length) {
    return <div className="text-sm text-gray-600">No team members listed for this salon yet.</div>;
  }
  return (
    <div className="space-y-4">
      <div className="font-medium">Select Your Barber</div>
      <div className="grid md:grid-cols-2 gap-4">
        {employees.map((e) => (
          <button
            key={e.id}
            onClick={() => onChange(e)}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left hover:shadow-sm ${
              value?.id === e.id ? "ring-2 ring-violet-600 border-violet-600" : ""
            }`}
          >
            <img
              src={e.avatar || "https://placehold.co/80x80?text=Barber"}
              alt={e.name}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">{e.name}</div>
              <div className="text-sm text-gray-500">
                {(e.specialties || []).slice(0, 2).join(", ") || "Stylist"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2SelectService({ services, value, onChange }) {
  if (!services.length) {
    return <div className="text-sm text-gray-600">No services have been added yet.</div>;
  }
  return (
    <div className="space-y-4">
      <div className="font-medium">Choose a Service</div>
      <div className="space-y-3">
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s)}
            className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 hover:shadow-sm ${
              value?.id === s.id ? "ring-2 ring-violet-600 border-violet-600" : ""
            }`}
          >
            <div className="flex flex-col items-start">
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-gray-500 leading-tight">
                {s.duration_minutes ? `${s.duration_minutes} min` : "Duration varies"}
              </div>
            </div>
            <div className="font-semibold text-right">
              {s.price != null ? `$${Number(s.price).toFixed(2)}` : "See salon"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step3DateTime({ dateISO, onDateISO, slots, slot, onSelect, error }) {
  return (
    <div className="space-y-6">
      <div className="font-medium">Pick Date &amp; Time</div>
      <div className="flex flex-wrap gap-6">
        <div className="rounded-xl border p-3">
          <Calendar dateISO={dateISO} onDateISO={onDateISO} />
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-2">Available Time Slots</div>
          {error && <div className="text-sm text-rose-600 mb-2">{error}</div>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {slots.map((s) => (
              <button
                key={s.start_at}
                onClick={() => onSelect(s)}
                className={`rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 ${
                  slot?.start_at === s.start_at ? "ring-2 ring-violet-600 border-violet-600" : ""
                }`}
              >
                {s.label || toFriendlyTime(new Date(s.start_at).toISOString().slice(11, 16))}
              </button>
            ))}
            {slots.length === 0 && (
              <div className="col-span-full text-sm text-gray-500">
                No open slots for this day. Try another date.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4Review({ employee, service, slot, note, onNote, error, saving, onConfirm }) {
  return (
    <div className="space-y-4">
      <div className="font-medium">Review &amp; Confirm</div>
      <div className="rounded-xl border p-4 text-sm text-gray-700 space-y-1">
        <div>• Barber: {employee?.name}</div>
        <div>• Service: {service?.name}</div>
        <div>• Date: {slot ? toReadable(slot.start_at) : "--"}</div>
        <div>• Time: {slot ? new Date(slot.start_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "--"}</div>
      </div>
      <textarea
        value={note}
        onChange={(e) => onNote(e.target.value)}
        placeholder="Add any special requests or context for your stylist…"
        rows={4}
        className="w-full rounded-xl border px-3 py-2 bg-gray-50"
      />
      {error && <div className="text-sm text-rose-600">{error}</div>}
      <button
        onClick={onConfirm}
        disabled={saving}
        className="w-full rounded-xl bg-gray-900 text-white py-3 font-medium disabled:opacity-40"
      >
        {saving ? "Booking…" : "Confirm Appointment"}
      </button>
    </div>
  );
}

function ConfirmationSummary({ appointment, onClose }) {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto size-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
        ✓
      </div>
      <h2 className="text-xl font-semibold text-gray-900">Appointment Confirmed</h2>
      <p className="text-sm text-gray-600">
        We’ve scheduled your service for {toReadable(appointment.start_at)} at{" "}
        {new Date(appointment.start_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.
      </p>
      <button
        onClick={onClose}
        className="w-full rounded-xl bg-gray-900 text-white py-3 font-medium hover:opacity-90"
      >
        Close
      </button>
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

function toISO(d) {
  const copy = new Date(d);
  return new Date(copy.getFullYear(), copy.getMonth(), copy.getDate()).toISOString().slice(0, 10);
}

function stripTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toFriendlyTime(hhmm) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function toReadable(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

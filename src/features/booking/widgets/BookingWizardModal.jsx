import { useEffect, useMemo, useState } from "react";
import { listEmployees, listAvailability } from "../api.js";

export default function BookingWizardModal({ salon, onClose }) {
  const [step, setStep] = useState(1); // 1..5
  const [employee, setEmployee] = useState(null);
  const [service, setService]   = useState(null);
  const [dateISO, setDateISO]   = useState(toISO(new Date())); // yyyy-mm-dd
  const [slots, setSlots]       = useState([]);
  const [time, setTime]         = useState(null);
  const [note, setNote]         = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    (async () => setEmployees(await listEmployees(salon.id)))();
  }, [salon.id]);

  useEffect(() => {
    if (!employee || !dateISO) return;
    (async () => {
      const data = await listAvailability({ salonId: salon.id, employeeId: employee.id, dateISO });
      setSlots(data);
      setTime(null);
    })();
  }, [salon.id, employee, dateISO]);

  const progress = useMemo(() => step / 5 * 100, [step]);

  function next() { if (step < 5) setStep(step + 1); }
  function back() { if (step > 1) setStep(step - 1); }

  const canNext =
    (step === 1 && !!employee) ||
    (step === 2 && !!service) ||
    (step === 3 && !!time) ||
    (step === 4) ||
    (step === 5);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-auto w-[min(960px,92vw)] rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="text-lg font-semibold">Book an Appointment</div>
            <div className="text-sm text-gray-600">Step {step} of 5</div>
          </div>
          <button onClick={onClose} className="rounded-md px-3 py-1 border hover:bg-gray-50">Close</button>
        </div>

        <div className="px-6 pt-4">
          <div className="h-2 rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-violet-600" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-6">
          {step === 1 && <Step1SelectEmployee employees={employees} value={employee} onChange={setEmployee} />}
          {step === 2 && <Step2SelectService services={salon.services} value={service} onChange={setService} />}
          {step === 3 && (
            <Step3DateTime
              dateISO={dateISO}
              onDateISO={setDateISO}
              slots={slots}
              time={time}
              onTime={setTime}
            />
          )}
          {step === 4 && (
            <Step4Details
              note={note}
              onNote={setNote}
              employee={employee}
              service={service}
              dateISO={dateISO}
              time={time}
            />
          )}
          {step === 5 && <Step5PaymentStub />}

          <div className="mt-6 flex items-center gap-3 justify-between">
            <button onClick={back} className="w-40 rounded-xl border px-4 py-2 hover:bg-gray-50">Back</button>
            <button
              onClick={next}
              disabled={!canNext}
              className="w-48 rounded-xl bg-gray-900 text-white px-4 py-2 disabled:opacity-40"
            >
              {step < 5 ? "Continue" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step1SelectEmployee({ employees, value, onChange }) {
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
            <img src={e.avatar} alt={e.name} className="h-14 w-14 rounded-full object-cover" />
            <div>
              <div className="font-medium">{e.name}</div>
              <div className="text-sm text-gray-500">{e.title}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2SelectService({ services, value, onChange }) {
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
                <div className="text-sm text-gray-500 leading-tight">{s.durationMin} min</div>
            </div>
            <div className="font-semibold text-right">${s.price}</div>
            </button>
        ))}
      </div>
    </div>
  );
}

function Step3DateTime({ dateISO, onDateISO, slots, time, onTime }) {
  const days = useMemo(() => buildCalendarDays(dateISO), [dateISO]);

  return (
    <div className="space-y-6">
      <div className="font-medium">Pick Date &amp; Time</div>

      <div className="flex flex-wrap gap-6">
        <div className="rounded-xl border p-3">
          <Calendar dateISO={dateISO} onDateISO={onDateISO} />
        </div>

        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-2">Available Time Slots</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {slots.map((s) => (
              <button
                key={s.time}
                onClick={() => s.status === "free" && onTime(s.time)}
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
          <div className="mt-2 text-xs text-gray-500">
            Gray slots are already booked. Blocked slots are unavailable.
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4Details({ note, onNote, employee, service, dateISO, time }) {
  return (
    <div className="space-y-4">
      <div className="font-medium">Add Special Requests (Optional)</div>
      <textarea
        value={note}
        onChange={(e) => onNote(e.target.value)}
        placeholder="Any special requests or notes for your barber…"
        rows={5}
        className="w-full rounded-xl border px-3 py-2 bg-gray-50"
      />
      <div className="rounded-xl border p-4">
        <div className="font-medium mb-2">Your appointment details:</div>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Barber: {employee?.name}</li>
          <li>• Service: {service?.name}</li>
          <li>• Date: {toReadable(dateISO)}</li>
          <li>• Time: {toFriendlyTime(time)}</li>
        </ul>
      </div>
    </div>
  );
}

function Step5PaymentStub() {
  return (
    <div className="space-y-4">
      <div className="font-medium">Payment</div>
      <div className="space-y-3">
        {["Credit Card", "Debit Card", "PayPal"].map((p) => (
          <div key={p} className="rounded-2xl border px-4 py-3 flex items-center gap-3">
            <span className="text-xl">💳</span>
            <span>{p}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
        <span>🔒</span>
        <span>Your payment information is encrypted and secure.</span>
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
        <div className="font-medium">
          {ym.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
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

function toISO(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10); }
function stripTime(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function toFriendlyTime(hhmm){ if(!hhmm) return ""; const [h,m]=hhmm.split(":").map(Number); const ampm=h>=12?"PM":"AM"; const hh=((h+11)%12)+1; return `${hh}:${m.toString().padStart(2,"0")} ${ampm}`; }
function toReadable(iso){ const d=new Date(iso); return d.toLocaleDateString(undefined,{year:"numeric",month:"2-digit",day:"2-digit"}); }

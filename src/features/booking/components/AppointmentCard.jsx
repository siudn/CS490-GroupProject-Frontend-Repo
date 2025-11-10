import { Link } from "react-router-dom";

export default function AppointmentCard({
  appt,
  onCancel,
  onReschedule,
  compact = false,
  children,
}) {
  const d = new Date(appt.whenISO);
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        {/* LEFT: title + meta */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{appt.salon.name}</div>
            <StatusBadge status={appt.status} />
          </div>
          <div className="mt-2 grid grid-cols-[20px_1fr] gap-x-2 text-sm text-gray-700">
            <span>📅</span>
            <span>
              {d.toLocaleDateString(undefined, {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>⏰</span>
            <span>
              {d.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
            <span>📍</span>
            <span className="truncate">{appt.salon.address}</span>
          </div>
        </div>

        {/* RIGHT: details column */}
        <div className="w-64 text-sm">
          <Row label="Service:" value={appt.service.name} />
          <Row label="Barber:" value={appt.employee.name} />
          <Row label="Price:" value={`$${appt.service.price}`} />
          <Row
            label="Payment:"
            value={
              <PaymentPill
                status={
                  appt.paymentStatus || (appt.status === "cancelled" ? "refunded" : "paid")
                }
              />
            }
          />
        </div>
      </div>

      {/* CANCELLATION REASON */}
      {appt.status === "cancelled" && appt.cancellationReason && (
        <div className="mt-3 w-full">
            <div className="rounded-xl border bg-red-50 text-red-700 text-sm px-3 py-2">
            Cancellation reason: {appt.cancellationReason}
            </div>
        </div>
      )}

      {/* ACTIONS */}
      {!compact && appt.status !== "cancelled" && (
        <div className="mt-4 flex gap-3">
          <Link
            to={`/booking/salon/${appt.salon.id}`}
            className="rounded-xl border px-3 py-2 hover:bg-gray-50"
          >
            View Salon
          </Link>
          {onReschedule && (
            <button
              onClick={() => onReschedule(appt)}
              className="rounded-xl border px-3 py-2 hover:bg-gray-50"
            >
              Reschedule
            </button>
          )}
          {onCancel && (
            <button
              onClick={() => onCancel(appt)}
              className="rounded-xl border px-3 py-2 text-white bg-rose-600 hover:bg-rose-700"
            >
              Cancel
            </button>
          )}
        </div>
      )}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1 text-gray-700">
      <span className="text-gray-500">{label}</span>
      <span className="ml-2">{value}</span>
    </div>
  );
}

function PaymentPill({ status }) {
  const map = {
    paid: ["bg-gray-900 text-white", "paid"],
    refunded: ["bg-gray-200 text-gray-800", "refunded"],
  };
  const [cls, label] = map[status] || map.paid;
  return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>{label}</span>;
}

function StatusBadge({ status }) {
  const map = {
    pending: ["bg-yellow-50 text-yellow-800 border-yellow-200", "Pending"],
    awaiting_vendor: ["bg-amber-50 text-amber-800 border-amber-200", "Awaiting"],
    confirmed: ["bg-gray-900 text-white border-gray-900", "Confirmed"],
    completed: ["bg-gray-100 text-gray-700 border-gray-200", "Completed"],
    cancelled: ["bg-rose-50 text-rose-700 border-rose-200", "Cancelled"],
    reschedule_requested: ["bg-indigo-50 text-indigo-700 border-indigo-200", "Reschedule"],
  };
  const [cls, label] = map[status] || ["bg-gray-100 text-gray-700 border-gray-200", status];
  return (
    <span className={`text-xs border rounded-full px-2 py-0.5 ${cls}`}>{label}</span>
  );
}

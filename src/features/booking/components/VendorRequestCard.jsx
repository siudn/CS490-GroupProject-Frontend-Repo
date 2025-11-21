export default function VendorRequestCard({ item, onConfirm, onDeny, compact=false }) {
  const d = new Date(item.start_at || item.whenISO);
  const salon = item.salon || {};
  const service = item.service || {};
  const barber = item.barber || item.employee || {};
  const customer = item.customer || {};
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{customer.name || "Customer"}</div>
            <StatusBadge status={item.status} />
          </div>
          <div className="mt-1 text-sm text-gray-700">
            {service.name} • {service.duration_minutes ? `${service.duration_minutes} min` : "Duration varies"} •{" "}
            {service.price != null ? `$${Number(service.price).toFixed(2)}` : "See salon"}
          </div>
          <div className="mt-2 grid grid-cols-[20px_1fr] gap-x-2 text-sm text-gray-700">
            <span>📅</span><span>{d.toLocaleDateString(undefined,{month:"numeric",day:"numeric",year:"numeric"})}</span>
            <span>⏰</span><span>{d.toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})}</span>
            <span>💈</span><span>{salon.name} — {barber.name}</span>
          </div>
          {item.note && (
            <div className="mt-2 rounded-xl border bg-gray-50 text-gray-700 text-sm px-3 py-2">
              Customer note: {item.note}
            </div>
          )}
          {item.status === "denied" && item.cancellation_reason && (
            <div className="mt-2 rounded-xl border bg-rose-50 text-rose-700 text-sm px-3 py-2">
              Denied reason: {item.cancellation_reason}
            </div>
          )}
        </div>

        {!compact && item.status === "pending" && (
          <div className="w-56 flex flex-col gap-2">
            <button onClick={() => onConfirm(item)} className="rounded-xl bg-gray-900 text-white px-3 py-2 hover:opacity-90">
              Confirm
            </button>
            <button onClick={() => onDeny(item)} className="rounded-xl border px-3 py-2 text-rose-700 border-rose-300 hover:bg-rose-50">
              Deny
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: ["bg-amber-50 text-amber-800 border-amber-200", "Pending"],
    confirmed: ["bg-green-50 text-green-800 border-green-200", "Confirmed"],
    denied: ["bg-rose-50 text-rose-700 border-rose-200", "Denied"],
  };
  const [cls, label] = map[status] || ["bg-gray-100 text-gray-700 border-gray-200", status];
  return <span className={`text-xs border rounded-full px-2 py-0.5 ${cls}`}>{label}</span>;
}

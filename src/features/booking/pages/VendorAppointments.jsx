import { useCallback, useEffect, useState } from "react";
import { listVendorRequests, vendorConfirm } from "../api.js";
import VendorRequestCard from "../components/VendorRequestCard.jsx";
import VendorDenyModal from "../widgets/VendorDenyModal.jsx";

export default function VendorAppointments() {
  const [data, setData] = useState({ pending: [], upcoming: [], denied: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [denyItem, setDenyItem] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listVendorRequests();
      setData(res);
      setErr("");
    } catch (e) {
      setErr("Failed to load vendor appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onConfirm(item) {
    await vendorConfirm(item.id, "Confirmed by vendor");
    load();
  }

  function onDeny(item) { setDenyItem(item); }
  const applyDenied = () => load();

  if (loading) return <div className="max-w-6xl mx-auto p-6 text-gray-600">Loading…</div>;
  if (err) return <div className="max-w-6xl mx-auto p-6 text-red-600">{err}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Vendor • Appointments</h1>

      <section className="space-y-3">
        <div className="text-lg font-medium">Pending Confirmation</div>
        {data.pending.length === 0 ? (
          <div className="text-sm text-gray-600">No pending requests.</div>
        ) : (
          <div className="space-y-4">
            {data.pending.map((it) => (
              <VendorRequestCard key={it.id} item={it} onConfirm={onConfirm} onDeny={onDeny} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="text-lg font-medium">Upcoming (Confirmed)</div>
        {data.upcoming.length === 0 ? (
          <div className="text-sm text-gray-600">No upcoming confirmed appointments.</div>
        ) : (
          <div className="space-y-4">
            {data.upcoming.map((it) => (
              <VendorRequestCard key={it.id} item={it} compact />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="text-lg font-medium">Denied</div>
        {data.denied.length === 0 ? (
          <div className="text-sm text-gray-600">No denied requests.</div>
        ) : (
          <div className="space-y-4">
            {data.denied.map((it) => (
              <VendorRequestCard key={it.id} item={it} compact />
            ))}
          </div>
        )}
      </section>

      {denyItem && (
        <VendorDenyModal
          item={denyItem}
          onClose={() => setDenyItem(null)}
          onSuccess={applyDenied}
        />
      )}
    </div>
  );
}

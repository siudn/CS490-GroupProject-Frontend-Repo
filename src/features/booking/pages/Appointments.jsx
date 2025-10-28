import { useEffect, useState } from "react";
import { listUserAppointments, cancelAppointment, prepReschedule } from "../api.js";
import AppointmentCard from "../components/AppointmentCard.jsx";

export default function Appointments() {
  const [data, setData] = useState({ active: [], history: [] });
  const [tab, setTab] = useState("upcoming"); // 'upcoming' | 'past'
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    setLoading(true);
    const res = await listUserAppointments();
    setData(res); setLoading(false);
  })(); }, []);

  async function onCancel(appt) {
    if (!confirm(`Cancel appointment ${appt.id}?`)) return;
    await cancelAppointment(appt.id);
    setData(({ active, history }) => ({
      active: active.filter(a => a.id !== appt.id),
      history: [{ ...appt, status: "cancelled", paymentStatus: "refunded", cancellationReason: "User requested" }, ...history],
    }));
  }
  async function onReschedule(appt) { await prepReschedule(appt.id); alert("Reschedule flow (FRONT-20)"); }

  const upcoming = data.active;
  const past = data.history;

  if (loading) return <div className="max-w-6xl mx-auto p-6 text-gray-600">Loading…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">My Appointments</h1>

      {/* Figma-style tab bar */}
      <div className="rounded-full bg-gray-100 p-1 w-full md:w-[560px]">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setTab("upcoming")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${tab==="upcoming"?"bg-white shadow text-gray-900":"text-gray-700"}`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setTab("past")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${tab==="past"?"bg-white shadow text-gray-900":"text-gray-700"}`}
          >
            Past ({past.length})
          </button>
        </div>
      </div>

      {/* Lists */}
      {tab === "upcoming" ? (
        upcoming.length === 0 ? (
          <div className="text-sm text-gray-600">No upcoming appointments.</div>
        ) : (
          <div className="space-y-4">
            {upcoming.map(a => (
              <AppointmentCard key={a.id} appt={a} onCancel={onCancel} onReschedule={onReschedule} />
            ))}
          </div>
        )
      ) : past.length === 0 ? (
        <div className="text-sm text-gray-600">No past appointments.</div>
      ) : (
        <div className="space-y-4">
          {past.map(a => (
            <AppointmentCard key={a.id} appt={a} compact />
          ))}
        </div>
      )}
    </div>
  );
}

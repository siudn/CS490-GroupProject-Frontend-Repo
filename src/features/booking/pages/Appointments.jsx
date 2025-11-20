import { useCallback, useEffect, useState } from "react";
import { listUserAppointments, submitReview } from "../api.js";
import AppointmentCard from "../components/AppointmentCard.jsx";
import RescheduleModal from "../widgets/RescheduleModal.jsx";
import CancelModal from "../widgets/CancelModal.jsx";
import PostAppointmentReview from "../components/PostAppointmentReview.jsx";

export default function Appointments() {
  const [data, setData] = useState({ upcoming: [], past: [] });
  const [tab, setTab] = useState("upcoming"); // 'upcoming' | 'past'
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // modal targets
  const [resAppt, setResAppt] = useState(null);
  const [cancelAppt, setCancelAppt] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listUserAppointments();
      setData(res);
      setErr("");
    } catch (e) {
      console.error("Failed to load appointments", e);
      setErr(e?.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // handlers (open modals)
  function onReschedule(appt) { setResAppt(appt); }
  function onCancel(appt) { setCancelAppt(appt); }

  // apply updates from modals
  async function handleSubmitReview(id, payload) {
    const clean = {
      stars: payload.stars,
      comment: payload.comment?.trim() ?? "",
    };

    await submitReview(id, clean);
    await load();
  }

  if (loading) return <div className="max-w-6xl mx-auto p-6 text-gray-600">Loading…</div>;
  if (err) return <div className="max-w-6xl mx-auto p-6 text-red-600">{err}</div>;

  const upcoming = data.upcoming;
  const past = data.past;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">My Appointments</h1>
      <div className="rounded-full bg-gray-100 p-1 w-full md:w-[560px]">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setTab("upcoming")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === "upcoming" ? "bg-white shadow text-gray-900" : "text-gray-700"
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setTab("past")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === "past" ? "bg-white shadow text-gray-900" : "text-gray-700"
            }`}
          >
            Past ({past.length})
          </button>
        </div>
      </div>

      {tab === "upcoming" ? (
        upcoming.length === 0 ? (
          <div className="text-sm text-gray-600">No upcoming appointments.</div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((a) => (
              <AppointmentCard
                key={a.id}
                appt={a}
                onCancel={onCancel}
                onReschedule={onReschedule}
              />
            ))}
          </div>
        )
      ) : past.length === 0 ? (
        <div className="text-sm text-gray-600">No past appointments.</div>
      ) : (
        <div className="space-y-4">
          {past.map((a) => (
            <AppointmentCard key={a.id} appt={a} compact>
              {a.status === "completed" ? (
                <PostAppointmentReview
                  appointmentId={a.id}
                  existingReview={a.review}
                  salonName={a.salon?.name}
                  employeeName={a.barber?.name || a.employee?.name}
                  onSubmit={handleSubmitReview}
                />
              ) : null}
            </AppointmentCard>
          ))}
        </div>
      )}

      {resAppt && (
        <RescheduleModal
          appt={resAppt}
          onClose={() => setResAppt(null)}
          onSuccess={() => load()}
        />
      )}
      {cancelAppt && (
        <CancelModal
          appt={cancelAppt}
          onClose={() => setCancelAppt(null)}
          onSuccess={() => load()}
        />
      )}
    </div>
  );
}

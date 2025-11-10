import { useEffect, useState } from "react";
import {
  listUserAppointments,
  cancelAppointment as cancelApi, // not used directly—handled via modal
  prepReschedule as prepApi,
  submitReview,
} from "../api.js";
import AppointmentCard from "../components/AppointmentCard.jsx";
import RescheduleModal from "../widgets/RescheduleModal.jsx";
import CancelModal from "../widgets/CancelModal.jsx";
import PostAppointmentReview from "../components/PostAppointmentReview.jsx";

export default function Appointments() {
  const [data, setData] = useState({ active: [], history: [] });
  const [tab, setTab] = useState("upcoming"); // 'upcoming' | 'past'
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // modal targets
  const [resAppt, setResAppt] = useState(null);
  const [cancelAppt, setCancelAppt] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await listUserAppointments();
        if (alive) setData(res);
      } catch (e) {
        if (alive) setErr("Failed to load appointments.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // handlers (open modals)
  function onReschedule(appt) { setResAppt(appt); }
  function onCancel(appt) { setCancelAppt(appt); }

  // apply updates from modals
  function applyUpdate(updated) {
    setData(({ active, history }) => {
      const inActive = active.some(a => a.id === updated.id);
      if (updated.status === "cancelled") {
        return {
          active: inActive ? active.filter(a => a.id !== updated.id) : active,
          history: [{ ...updated }, ...history],
        };
      }
      return {
        active: active.map(a => (a.id === updated.id ? { ...a, ...updated } : a)),
        history,
      };
    });
  }

  function applyReview(id, review) {
    setData(({ active, history }) => ({
      active,
      history: history.map((appt) =>
        appt.id === id ? { ...appt, review } : appt,
      ),
    }));
  }

  async function handleSubmitReview(id, payload) {
    const clean = {
      stars: payload.stars,
      comment: payload.comment?.trim() ?? "",
    };

    const res = await submitReview(id, clean);
    if (!res?.ok) {
      throw new Error(res?.error || "Unable to submit review.");
    }
    applyReview(id, { stars: clean.stars, text: clean.comment });
  }

  if (loading) return <div className="max-w-6xl mx-auto p-6 text-gray-600">Loading…</div>;
  if (err) return <div className="max-w-6xl mx-auto p-6 text-red-600">{err}</div>;

  const upcoming = data.active;
  const past = data.history;

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
                  salonName={a.salon.name}
                  employeeName={a.employee.name}
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
          onSuccess={applyUpdate}
        />
      )}
      {cancelAppt && (
        <CancelModal
          appt={cancelAppt}
          onClose={() => setCancelAppt(null)}
          onSuccess={applyUpdate}
        />
      )}
    </div>
  );
}

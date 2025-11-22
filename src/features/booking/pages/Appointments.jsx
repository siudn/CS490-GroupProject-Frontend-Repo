import { useCallback, useEffect, useState } from "react";
import { listUserAppointments, submitReview, updateAppointment } from "../api.js";
import AppointmentCard from "../components/AppointmentCard.jsx";
import RescheduleModal from "../widgets/RescheduleModal.jsx";
import CancelModal from "../widgets/CancelModal.jsx";
import PostAppointmentReview from "../components/PostAppointmentReview.jsx";

export default function Appointments() {
  const [all, setAll] = useState([]);
  const [tab, setTab] = useState("upcoming"); // upcoming | inprogress | past | cancelled
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // modal targets
  const [resAppt, setResAppt] = useState(null);
  const [cancelAppt, setCancelAppt] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listUserAppointments();
      const merged = [...(res?.upcoming || []), ...(res?.past || [])];
      setAll(merged);
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

  async function saveNote(apptId, noteText) {
    try {
      await updateAppointment({ id: apptId, notes: noteText?.trim() || null });
      await load();
    } catch (e) {
      console.error("Failed to save note", e);
    }
  }

  if (loading) return <div className="max-w-6xl mx-auto p-6 text-gray-600">Loading…</div>;
  if (err) return <div className="max-w-6xl mx-auto p-6 text-red-600">{err}</div>;

  const now = new Date();
  const isCancelled = (a) => (a?.status || "").toLowerCase() === "cancelled";
  const isPast = (a) => {
    const start = a.start_at ? new Date(a.start_at) : null;
    return start ? start < now : false;
  };
  const isInProgress = (a) => {
    if (!a?.start_at) return false;
    const start = new Date(a.start_at);
    const end = a.end_at
      ? new Date(a.end_at)
      : new Date(start.getTime() + (a.duration_minutes || 30) * 60 * 1000);
    return start <= now && now < end && !isCancelled(a);
  };

  const upcoming = all.filter((a) => !isCancelled(a) && !isPast(a) && !isInProgress(a));
  const inprogress = all.filter((a) => isInProgress(a));
  const past = all.filter((a) => !isCancelled(a) && isPast(a) && !isInProgress(a));
  const cancelled = all.filter((a) => isCancelled(a));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">My Appointments</h1>
      <div className="rounded-full bg-gray-100 p-1 w-full md:w-[720px]">
        <div className="grid grid-cols-4">
          {[
            ["upcoming", `Upcoming (${upcoming.length})`],
            ["inprogress", `In Progress (${inprogress.length})`],
            ["past", `Past (${past.length})`],
            ["cancelled", `Cancelled (${cancelled.length})`],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                tab === key ? "bg-white shadow text-gray-900" : "text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "upcoming" && (
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
                onSaveNote={saveNote}
              />
            ))}
          </div>
        )
      )}

      {tab === "inprogress" && (
        inprogress.length === 0 ? (
          <div className="text-sm text-gray-600">No in-progress appointments.</div>
        ) : (
          <div className="space-y-4">
            {inprogress.map((a) => (
              <AppointmentCard
                key={a.id}
                appt={a}
                compact
                onCancel={onCancel}
                onSaveNote={saveNote}
              />
            ))}
          </div>
        )
      )}

      {tab === "past" && (
        past.length === 0 ? (
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
        )
      )}

      {tab === "cancelled" && (
        cancelled.length === 0 ? (
          <div className="text-sm text-gray-600">No cancelled appointments.</div>
        ) : (
          <div className="space-y-4">
            {cancelled.map((a) => (
              <AppointmentCard key={a.id} appt={a} compact onSaveNote={saveNote} />
            ))}
          </div>
        )
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

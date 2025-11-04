import { useState } from "react";
import { cancelAppointment } from "../api.js";

const PRESET = ["Schedule conflict", "Unexpected event", "Booked by mistake", "Other"];

export default function CancelModal({ appt, onClose, onSuccess }) {
  const [reason, setReason] = useState(PRESET[0]);
  const [custom, setCustom] = useState("");
  const [saving, setSaving] = useState(false);

  async function confirm() {
    const msg = reason === "Other" ? (custom || "Other") : reason;
    setSaving(true);
    const res = await cancelAppointment(appt.id, msg);
    setSaving(false);
    if (res?.ok) {
      onSuccess({ ...appt, status: "cancelled", paymentStatus: "refunded", cancellationReason: msg });
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-24 mx-auto w-[min(520px,92vw)] rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold">Cancel Appointment</div>
          <button onClick={onClose} className="rounded-md border px-3 py-1 hover:bg-gray-50">Close</button>
        </div>
        <div className="p-5 space-y-3">
          <div className="text-sm text-gray-700">Why are you cancelling?</div>
          <div className="space-y-2">
            {PRESET.map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm">
                <input type="radio" name="reason" value={r} checked={reason===r} onChange={() => setReason(r)} />
                <span>{r}</span>
              </label>
            ))}
          </div>
          {reason === "Other" && (
            <input
              value={custom}
              onChange={(e)=>setCustom(e.target.value)}
              placeholder="Add a short note…"
              className="w-full rounded-xl border px-3 py-2"
            />
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="rounded-xl border px-4 py-2 hover:bg-gray-50">Keep</button>
            <button
              onClick={confirm}
              disabled={saving}
              className="rounded-xl bg-rose-600 text-white px-4 py-2 disabled:opacity-40"
            >
              {saving ? "Cancelling…" : "Confirm Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

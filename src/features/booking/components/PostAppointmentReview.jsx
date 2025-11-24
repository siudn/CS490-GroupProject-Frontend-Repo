import { useEffect, useMemo, useState } from "react";
import { Star, Edit2 } from "lucide-react";
import { Button } from "../../../shared/ui/button.jsx";
import { Textarea } from "../../../shared/ui/textarea.jsx";

const STAR_SCALE = [1, 2, 3, 4, 5];

export default function PostAppointmentReview({
  appointmentId,
  existingReview,
  salonName,
  employeeName,
  onSubmit,
}) {
  // Normalize review data - handle both old format (stars, text) and new format (rating, comment, id)
  const reviewId = existingReview?.id || existingReview?.review_id;
  const reviewRating = existingReview?.rating ?? existingReview?.stars ?? 0;
  const reviewComment = existingReview?.comment ?? existingReview?.text ?? "";
  
  const [isEditing, setIsEditing] = useState(false);
  const [savedReview, setSavedReview] = useState(existingReview ? { id: reviewId, stars: reviewRating, text: reviewComment } : null);
  const [rating, setRating] = useState(reviewRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(reviewComment);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  useEffect(() => {
    const reviewId = existingReview?.id || existingReview?.review_id;
    const reviewRating = existingReview?.rating ?? existingReview?.stars ?? 0;
    const reviewComment = existingReview?.comment ?? existingReview?.text ?? "";
    
    if (existingReview) {
      setSavedReview({ id: reviewId, stars: reviewRating, text: reviewComment });
      setRating(reviewRating);
      setComment(reviewComment);
      setStatus("success");
      setIsEditing(false);
    } else {
      setSavedReview(null);
      setRating(0);
      setComment("");
      setStatus("idle");
      setIsEditing(false);
    }
  }, [existingReview]);

  const displayRating = hoverRating || rating;

  const heading = useMemo(() => {
    if (savedReview && !isEditing) return "Thanks for your feedback!";
    return "How was your visit?";
  }, [savedReview, isEditing]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "submitting") return;
    if (!rating) {
      setError("Please select a star rating.");
      return;
    }
    setError("");
    setStatus("submitting");
    try {
      await onSubmit(appointmentId, { stars: rating, comment }, savedReview?.id);
      setSavedReview({ id: savedReview?.id, stars: rating, text: comment });
      setStatus("success");
      setIsEditing(false);
    } catch (e) {
      setStatus("idle");
      setError(e?.message || "Unable to submit review. Please try again.");
    }
  }

  if (savedReview && !isEditing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <StarRow value={savedReview.stars} readOnly />
            <span className="text-sm text-gray-600">
              You rated {salonName} {savedReview.stars} out of 5.
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit2 className="size-4" />
            Edit
          </Button>
        </div>
        {savedReview.text ? (
          <p className="mt-3 text-sm leading-6 text-gray-700">{savedReview.text}</p>
        ) : (
          <p className="mt-3 text-sm text-gray-500">No written feedback provided.</p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-5"
    >
      <div>
        <h3 className="text-base font-semibold text-gray-900">{heading}</h3>
        <p className="text-sm text-gray-600">
          Tell us about your appointment with {employeeName} at {salonName}.
        </p>
      </div>

      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverRating(0)}
      >
        {STAR_SCALE.map((star) => {
          const active = star <= displayRating;
          return (
            <button
              key={star}
              type="button"
              className="rounded-full p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              onMouseEnter={() => setHoverRating(star)}
              onFocus={() => setHoverRating(star)}
              onClick={() => {
                setRating(star);
                setHoverRating(0);
              }}
            >
              <Star
                className={`size-6 ${active ? "text-amber-500" : "text-gray-300"}`}
                fill={active ? "currentColor" : "none"}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span className="sr-only">{`${star} star${star > 1 ? "s" : ""}`}</span>
            </button>
          );
        })}
      </div>

      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share anything that stood out during your visit…"
        maxLength={1000}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center justify-between">
        {status === "success" ? (
          <span className="text-sm text-emerald-600">Review saved!</span>
        ) : (
          <span className="text-sm text-gray-500">
            Your rating helps other customers choose their stylist.
          </span>
        )}
        <div className="flex items-center gap-2">
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setRating(savedReview?.stars ?? 0);
                setComment(savedReview?.text ?? "");
                setError("");
              }}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Saving…" : isEditing ? "Update review" : "Submit review"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function StarRow({ value, readOnly = false }) {
  return (
    <div className="flex items-center gap-1">
      {STAR_SCALE.map((star) => {
        const active = star <= value;
        return (
          <Star
            key={star}
            className={`size-5 ${active ? "text-amber-500" : "text-gray-300"}`}
            fill={active ? "currentColor" : "none"}
            strokeWidth={1.8}
            aria-hidden={readOnly}
          />
        );
      })}
    </div>
  );
}


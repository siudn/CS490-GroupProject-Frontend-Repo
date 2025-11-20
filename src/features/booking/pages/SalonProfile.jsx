import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSalon, getSalonReviews } from "../api.js";
import BookingWizardModal from "../widgets/BookingWizardModal.jsx";
import { useAuth } from "../../auth/auth-provider.jsx";

export default function SalonProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [salon, setSalon] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [openWizard, setOpenWizard] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const s = await getSalon(id);
        const r = await getSalonReviews(id);
        if (!alive) return;
        setSalon(s);
        setReviews(r);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const filteredReviews = useMemo(() => {
    if (reviewFilter === "all") return reviews;
    if (reviewFilter === "with-text") {
      return reviews.filter((r) => r.text && r.text.trim().length > 0);
    }
    if (reviewFilter.startsWith("star-")) {
      const target = Number(reviewFilter.split("-")[1]);
      return reviews.filter((r) => r.stars === target);
    }
    return reviews;
  }, [reviews, reviewFilter]);

  const distribution = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      const stars = Math.min(Math.max(r.stars, 1), 5);
      counts[stars] += 1;
    });
    const total = reviews.length || 1;
    return {
      counts,
      percentages: Object.fromEntries(
        Object.entries(counts).map(([star, count]) => [
          star,
          Math.round((count / total) * 100),
        ]),
      ),
    };
  }, [reviews]);

  if (loading) return <div className="max-w-6xl mx-auto p-6 text-gray-600">Loading…</div>;
  if (!salon) return <div className="max-w-6xl mx-auto p-6 text-red-600">Salon not found.</div>;

  const heroImage =
    salon.logo_url ||
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80";
  const ratingValue = salon.rating ?? 0;
  const reviewsCount = salon.reviews_count ?? reviews.length;
  const services = salon.services ?? [];

  const roleBackPaths = {
    customer: "/browse",
    owner: "/salon-dashboard",
    salon_owner: "/salon-dashboard",
    barber: "/schedule",
    admin: "/admin/dashboard",
  };
  const backPath = user ? roleBackPaths[user.role] || "/browse" : "/browse";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Link to={backPath} className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">&larr; Back to all salons</Link>

      <div className="bg-white border rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <img src={heroImage} alt={salon.name} className="rounded-xl w-full h-56 object-cover md:col-span-1" />
          <div className="md:col-span-2 space-y-2">
            <h1 className="text-2xl font-semibold">{salon.name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span>⭐ {ratingValue ? ratingValue.toFixed(1) : "New"}</span>
              <span>({reviewsCount} reviews)</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">📍 {salon.address}</div>
            {Array.isArray(salon.hours) && salon.hours.length > 0 && (
              <div className="text-sm text-gray-600 flex items-center gap-2">
                🕘 {salon.hours.map((row) => formatHourRange(row)).join(" • ")}
              </div>
            )}
            {salon.description && <p className="pt-2 text-gray-700">{salon.description}</p>}
          </div>
        </div>

        {salon.gallery?.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {salon.gallery.map((src, i) => (
              <img key={i} src={src} alt={`gallery-${i}`} className="h-28 w-full object-cover rounded-lg" />
            ))}
          </div>
        )}

        <h2 className="mt-6 text-lg font-semibold">Available Services</h2>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.length === 0 && (
            <div className="rounded-xl border bg-gray-50 text-gray-600 p-4 text-sm">
              Services have not been published yet. Check back soon.
            </div>
          )}
          {services.map((svc) => (
            <div
              key={svc.id}
              className="flex items-center justify-between rounded-xl border px-4 py-3 bg-white"
            >
              <div>
                <div className="font-medium">{svc.name}</div>
                <div className="text-sm text-gray-500">
                  {svc.duration_minutes ? `${svc.duration_minutes} min` : "Duration varies"}
                </div>
              </div>
              <div className="text-gray-800 font-semibold">
                {svc.price != null ? `$${Number(svc.price).toFixed(2)}` : "See salon"}
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-lg font-semibold">Meet the Team</h2>
        {salon.employees?.length ? (
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {salon.employees.map((emp) => (
              <div key={emp.id} className="flex items-center gap-4 rounded-xl border p-4 bg-white">
                <img
                  src={emp.avatar || "https://placehold.co/96x96?text=Staff"}
                  alt={emp.name}
                  className="h-16 w-16 rounded-full object-cover border"
                />
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="text-base font-medium text-gray-900">{emp.name}</div>
                  {emp.years_experience != null && (
                    <div>{emp.years_experience} yrs experience</div>
                  )}
                  <div className="capitalize">
                    Status: {emp.is_active ? "Available" : "Inactive"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-600">
            This salon hasn’t published its team yet. Start a booking to see available staff.
          </p>
        )}

        <button
            onClick={() => setOpenWizard(true)}
            className="mt-6 w-full rounded-xl bg-black text-white py-3 font-medium hover:opacity-90"
        >
            Book Now
        </button>

        {openWizard && (
            <BookingWizardModal salon={salon} onClose={() => setOpenWizard(false)} />
        )}
      </div>

      <ReviewSection
        salon={salon}
        reviews={filteredReviews}
        totalReviews={reviewsCount}
        distribution={distribution}
        activeFilter={reviewFilter}
        onFilterChange={setReviewFilter}
        hasWrittenReviews={reviews.some((r) => r.text?.trim())}
      />
    </div>
  );
}

function ReviewSection({
  salon,
  reviews,
  totalReviews,
  distribution,
  activeFilter,
  onFilterChange,
  hasWrittenReviews,
}) {
  const average = salon.rating ?? 0;
  const total = totalReviews ?? reviews.length;

  if (total === 0) {
    return (
      <div className="bg-white border rounded-2xl p-8 text-center space-y-4">
        <div className="mx-auto size-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
          <span className="text-3xl">★</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">No reviews yet</h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Be the first to share your experience at {salon.name}. After your appointment,
          you’ll be able to leave a star rating and feedback to help other guests.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Guest Reviews</h2>
          <p className="text-sm text-gray-600">
            {total === 1 ? "1 review" : `${total} reviews`} • {salon.name}
          </p>
        </div>
        <div className="rounded-xl border bg-gray-50 px-4 py-3 text-center">
          <div className="text-2xl font-semibold text-gray-900">{average.toFixed(1)}</div>
          <div className="text-xs uppercase tracking-wide text-gray-500">Average rating</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <RatingDistributionCard distribution={distribution} />

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <FilterButton
              label="All reviews"
              active={activeFilter === "all"}
              onClick={() => onFilterChange("all")}
            />
            {[5, 4, 3, 2, 1].map((star) => (
              <FilterButton
                key={star}
                label={`${star} star`}
                active={activeFilter === `star-${star}`}
                onClick={() => onFilterChange(`star-${star}`)}
              />
            ))}
            <FilterButton
              label="With comments"
              active={activeFilter === "with-text"}
              onClick={() => onFilterChange("with-text")}
              disabled={!hasWrittenReviews}
            />
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-gray-50 px-6 py-8 text-center">
              <p className="text-sm font-medium text-gray-700">No reviews match this filter.</p>
              <p className="mt-1 text-sm text-gray-500">
                Try selecting a different rating or check back soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((r) => (
                <Review key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Review({ review }) {
  return (
    <div className="rounded-xl border p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="font-medium">{review.user?.name || "Guest"}</div>
        <div className="text-yellow-500">
          {"★".repeat(review.stars)}
          <span className="text-gray-300">{"★".repeat(5 - review.stars)}</span>
        </div>
      </div>
      <p className="mt-2 text-gray-700 text-sm">{review.text || "No written feedback."}</p>
    </div>
  );
}

function RatingDistributionCard({ distribution }) {
  const order = [5, 4, 3, 2, 1];
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">Rating breakdown</h3>
      <div className="mt-4 flex flex-col gap-3">
        {order.map((star) => (
          <div key={star} className="flex items-center gap-3">
            <span className="w-10 text-sm font-medium text-gray-600">{star}★</span>
            <div className="h-2 flex-1 rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${distribution.percentages[star] ?? 0}%` }}
              />
            </div>
            <span className="w-10 text-right text-xs text-gray-500">
              {distribution.counts[star] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {label}
    </button>
  );
}

function formatHourRange(row) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const label = days[row?.day_of_week ?? 0];
  if (row?.is_closed) return `${label}: Closed`;
  const pretty = (value) => {
    if (!value) return "";
    const [h, m] = value.split(":");
    const dt = new Date();
    dt.setHours(Number(h), Number(m || 0), 0, 0);
    return dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };
  return `${label}: ${pretty(row?.open_time)} - ${pretty(row?.close_time)}`;
}

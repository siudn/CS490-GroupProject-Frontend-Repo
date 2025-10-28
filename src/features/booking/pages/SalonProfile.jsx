import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSalon, getSalonReviews } from "../api.js";

export default function SalonProfile() {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="max-w-6xl mx-auto p-6 text-gray-600">Loading…</div>;
  if (!salon) return <div className="max-w-6xl mx-auto p-6 text-red-600">Salon not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Link to="/booking" className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">&larr; Back to all salons</Link>

      <div className="bg-white border rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <img src={salon.img} alt={salon.name} className="rounded-xl w-full h-56 object-cover md:col-span-1" />
          <div className="md:col-span-2 space-y-2">
            <h1 className="text-2xl font-semibold">{salon.name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span>⭐ {salon.rating}</span>
              <span>({salon.reviewsCount} reviews)</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">📍 {salon.address}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2">🕘 {salon.hours}</div>
            <p className="pt-2 text-gray-700">{salon.blurb}</p>
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
          {salon.services.map((svc) => (
            <div
              key={svc.id}
              className="flex items-center justify-between rounded-xl border px-4 py-3 bg-white"
            >
              <div>
                <div className="font-medium">{svc.name}</div>
                <div className="text-sm text-gray-500">{svc.durationMin} min</div>
              </div>
              <div className="text-gray-800 font-semibold">${svc.price}</div>
            </div>
          ))}
        </div>

        <button className="mt-6 w-full rounded-xl bg-black text-white py-3 font-medium hover:opacity-90">
          Book Now
        </button>
      </div>

      <div className="bg-white border rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Reviews</h2>
          <button className="text-sm text-indigo-600 hover:underline">View all</button>
        </div>
        <div className="mt-3 grid md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <Review key={r.id} review={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Review({ review }) {
  return (
    <div className="rounded-xl border p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="font-medium">{review.user}</div>
        <div className="text-yellow-500">{'★'.repeat(review.stars)}<span className="text-gray-300">{'★'.repeat(5 - review.stars)}</span></div>
      </div>
      <p className="mt-2 text-gray-700 text-sm">{review.text}</p>
    </div>
  );
}

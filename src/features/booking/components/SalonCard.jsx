import { Link } from "react-router-dom";

export default function SalonCard({ salon }) {
  const linkTarget = `/salon/${salon.id}`;

  const services = (salon.services ?? []).map((s) => (typeof s === "string" ? s : s.name)).filter(Boolean);
  const rating = salon.rating != null ? salon.rating.toFixed(1) : "New";
  const reviews = salon.reviews_count ?? salon.reviews ?? 0;
  const image =
    salon.logo_url ||
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=600&q=80";

  return (
    <Link to={linkTarget} className="bg-white rounded-xl border overflow-hidden shadow-sm block hover:shadow-md transition">
      <img src={image} alt={salon.name} className="h-44 w-full object-cover" />
      <div className="p-4 space-y-2">
        <div className="font-semibold">{salon.name}</div>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span>⭐ {rating}</span>
          <span>({reviews})</span>
        </div>
        <div className="text-sm text-gray-600">📍 {salon.address}</div>
        {salon.description && (
          <p className="text-sm text-gray-700 line-clamp-2">{salon.description}</p>
        )}
        <div className="flex flex-wrap gap-1">
          {services.slice(0, 4).map((s) => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{s}</span>
          )) || <span className="text-xs text-gray-500">Services coming soon</span>}
        </div>
      </div>
    </Link>
  );
}

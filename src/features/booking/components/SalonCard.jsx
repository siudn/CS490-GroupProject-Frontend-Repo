import { Link } from "react-router-dom";

export default function SalonCard({ salon, userCoords }) {
  const distance =
    salon.distMiles != null
      ? salon.distMiles
      : userCoords && salon.coords
      ? haversineMiles(userCoords.lat, userCoords.lng, salon.coords.lat, salon.coords.lng)
      : null;

  return (
    <Link to={`/booking/salon/${salon.id}`} className="bg-white rounded-xl border overflow-hidden shadow-sm block hover:shadow-md transition">
      <img src={salon.img} alt={salon.name} className="h-44 w-full object-cover" />
      <div className="p-4 space-y-2">
        <div className="font-semibold">{salon.name}</div>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span>⭐ {salon.rating}</span>
          <span>({salon.reviews})</span>
          {distance != null && <span className="text-gray-500">{distance.toFixed(1)} mi away</span>}
        </div>
        <div className="text-sm text-gray-600">📍 {salon.address}</div>
        <p className="text-sm text-gray-700 line-clamp-2">{salon.blurb}</p>
        <div className="flex flex-wrap gap-1">
          {salon.services.map((s) => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

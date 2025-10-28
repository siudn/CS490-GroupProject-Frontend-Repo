import { api } from "../../shared/api/client.js";

/** Get services (mock or real) */
export async function listServices() {
  if (import.meta.env.VITE_MOCK === "1") return MOCK_SERVICES;
  return api("/services"); // -> ["haircut","color",...]
}

/** Get salons; only use coords when sort === 'nearby' */
export async function listSalons({
  q = "",
  location = "",
  services = [],
  sort = "top",           // "top" | "nearby"
  coords = null,          // { lat, lng } OR null
}) {
  const useCoords = sort === "nearby" && coords?.lat != null && coords?.lng != null;

  if (import.meta.env.VITE_MOCK === "1") {
    return filterSortMock({
      q,
      location,
      services,
      sort,
      coords: useCoords ? coords : null,
    });
  }

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (location && !useCoords) params.set("location", location); // ignore text location if using coords
  if (services.length) params.set("services", services.join(","));
  params.set("sort", sort);
  if (useCoords) {
    params.set("lat", coords.lat);
    params.set("lng", coords.lng);
  }
  const rows = await api(`/salons?${params.toString()}`);

  // If backend doesn't return distance/sorting yet, handle here
  if (useCoords) {
    return rows
      .map((s) => ({ ...s, distMiles: s.coords ? distanceMiles(coords, s.coords) : null }))
      .sort((a, b) => (a.distMiles ?? 1e9) - (b.distMiles ?? 1e9));
  }
  if (sort === "top") return rows.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  return rows;
}

/** Get a single salon with details (services, hours, gallery) */
export async function getSalon(id) {
  if (import.meta.env.VITE_MOCK === "1") {
    const s = MOCK_SALON_DETAILS[id];
    if (!s) throw new Error("Salon not found");
    return s;
  }
  return api(`/salons/${id}`);
}

/** Get paged reviews for a salon (simple first page for now) */
export async function getSalonReviews(id) {
  if (import.meta.env.VITE_MOCK === "1") {
    return (MOCK_SALON_DETAILS[id]?.reviews || []).slice(0, 6);
  }
  return api(`/salons/${id}/reviews?limit=6`);
}

/* ---------------- Helpers + Mock ---------------- */

function distanceMiles(a, b) {
  if (!a || !b) return null;
  const R = 3958.8; // miles
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

function filterSortMock({ q, location, services, sort, coords }) {
  let out = [...MOCK_SALONS];
  const qlc = q.trim().toLowerCase();

  if (qlc) {
    out = out.filter(
      (s) =>
        s.name.toLowerCase().includes(qlc) ||
        s.address.toLowerCase().includes(qlc)
    );
  }
  if (!coords && location.trim()) {
    const llc = location.toLowerCase();
    out = out.filter((s) => s.address.toLowerCase().includes(llc));
  }
  if (services?.length) {
    out = out.filter((s) => services.every((x) => s.services.includes(x)));
  }

  if (sort === "nearby" && coords) {
    out = out
      .map((s) => ({ ...s, distMiles: distanceMiles(coords, s.coords) }))
      .sort((a, b) => (a.distMiles ?? 1e9) - (b.distMiles ?? 1e9));
  } else if (sort === "top") {
    out.sort((a, b) => b.rating - a.rating);
  }
  return out;
}

const MOCK_SERVICES = ["haircut", "color", "blowout", "shave", "beard"];

const MOCK_SALONS = [
  {
    id: "1",
    name: "Glamour Salon",
    rating: 4.9,
    reviews: 203,
    address: "789 Broadway, New York, NY",
    blurb: "Full-service salon for all your beauty needs",
    img: "https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=1200&auto=format&fit=crop",
    services: ["haircut", "color", "blowout"],
    coords: { lat: 40.729, lng: -73.993 },
  },
  {
    id: "2",
    name: "Elite Hair Studio",
    rating: 4.8,
    reviews: 127,
    address: "123 Main St, New York, NY",
    blurb: "Premium hair styling and grooming services",
    img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200&auto=format&fit=crop",
    services: ["haircut", "shave", "beard"],
    coords: { lat: 40.741, lng: -73.989 },
  },
  {
    id: "3",
    name: "Classic Barber Shop",
    rating: 4.6,
    reviews: 89,
    address: "456 Park Ave, New York, NY",
    blurb: "Traditional barbering with modern style",
    img: "https://images.unsplash.com/photo-1559599101-7d2c36f5fa42?q=80&w=1200&auto=format&fit=crop",
    services: ["haircut", "shave"],
    coords: { lat: 40.754, lng: -73.98 },
  },
];

const GALLERY1 = [
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556228453-bf6e7b3f3a3a?q=80&w=1200&auto=format&fit=crop",
];

const MOCK_SALON_DETAILS = {
  "1": {
    id: "1",
    name: "Glamour Salon",
    rating: 4.9,
    reviewsCount: 203,
    address: "789 Broadway, New York, NY",
    hours: "Open 9am - 8pm",
    blurb: "Full-service salon for all your beauty needs",
    img: "https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=1200&auto=format&fit=crop",
    services: [
      { id: "svc1", name: "Haircut", durationMin: 45, price: 45 },
      { id: "svc2", name: "Hair Coloring", durationMin: 60, price: 90 },
      { id: "svc3", name: "Beard Trim", durationMin: 30, price: 30 },
      { id: "svc4", name: "Hot Towel Shave", durationMin: 45, price: 45 },
    ],
    gallery: GALLERY1,
    reviews: [
      { id: "r1", user: "Alex R.", stars: 5, text: "Amazing service and friendly staff." },
      { id: "r2", user: "Sofia M.", stars: 5, text: "Best color I've had in years." },
      { id: "r3", user: "Daniel K.", stars: 4, text: "Great cut, will return." },
      { id: "r4", user: "Priya S.", stars: 5, text: "Clean, quick, and professional." },
      { id: "r5", user: "Michael T.", stars: 4, text: "Booked same-day, super convenient." },
      { id: "r6", user: "Yuna L.", stars: 5, text: "Stylist really listened to what I wanted." },
    ],
  },
  "2": {
    id: "2",
    name: "Elite Hair Studio",
    rating: 4.8,
    reviewsCount: 127,
    address: "123 Main St, New York, NY",
    hours: "Open 10am - 7pm",
    blurb: "Premium hair styling and grooming services",
    img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200&auto=format&fit=crop",
    services: [
      { id: "svc5", name: "Haircut", durationMin: 45, price: 50 },
      { id: "svc6", name: "Shave", durationMin: 30, price: 25 },
      { id: "svc7", name: "Beard Trim", durationMin: 20, price: 20 },
    ],
    gallery: GALLERY1,
    reviews: [
      { id: "r1", user: "Diego P.", stars: 5, text: "Top-tier studio and vibe." },
      { id: "r2", user: "Mara C.", stars: 4, text: "Loved the style, thanks!" },
    ],
  },
  "3": {
    id: "3",
    name: "Classic Barber Shop",
    rating: 4.6,
    reviewsCount: 89,
    address: "456 Park Ave, New York, NY",
    hours: "Open 9am - 6pm",
    blurb: "Traditional barbering with modern style",
    img: "https://images.unsplash.com/photo-1559599101-7d2c36f5fa42?q=80&w=1200&auto=format&fit=crop",
    services: [
      { id: "svc8", name: "Haircut", durationMin: 40, price: 35 },
      { id: "svc9", name: "Hot Towel Shave", durationMin: 40, price: 40 },
    ],
    gallery: GALLERY1,
    reviews: [
      { id: "r1", user: "Tina W.", stars: 5, text: "My son's favorite barbershop." },
    ],
  },
};

export { distanceMiles };

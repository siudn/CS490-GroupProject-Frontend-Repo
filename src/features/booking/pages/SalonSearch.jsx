import { useEffect, useMemo, useState } from "react";
import { listSalons, listServices } from "../api.js";
import SalonCard from "../components/SalonCard.jsx";

export default function SalonSearch() {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceLimit, setServiceLimit] = useState(10);
  const [sort, setSort] = useState("top");
  const [loading, setLoading] = useState(false);
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const s = await listServices();
      if (alive) setAllServices(s);
    })();
    return () => { alive = false; };
  }, []);

  const [qDebounced, setQDebounced] = useState(q);
  useEffect(() => {
    const id = setTimeout(() => setQDebounced(q), 300);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await listSalons({
          q: qDebounced,
          location,
          services,
          sort,
        });
        if (alive) setSalons(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [qDebounced, location, services, sort]);

  const toggleService = (s) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const clearFilters = () => {
    setQ("");
    setLocation("");
    setServices([]);
    setSort("top");
    setServiceSearch("");
    setServiceLimit(10);
  };

  useEffect(() => {
    setServiceLimit(10);
  }, [serviceSearch]);

  const filteredServices = useMemo(() => {
    const query = serviceSearch.trim().toLowerCase();
    if (!query) return allServices;
    return allServices.filter((name) => name.toLowerCase().includes(query));
  }, [allServices, serviceSearch]);

  const visibleServices = useMemo(
    () => filteredServices.slice(0, serviceLimit),
    [filteredServices, serviceLimit]
  );

  const chips = useMemo(
    () =>
      services.map((s) => (
        <button
          key={s}
          className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700"
          onClick={() => toggleService(s)}
        >
          {s} ✕
        </button>
      )),
    [services]
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white border rounded-xl p-5">
        <h2 className="text-lg font-semibold">Find Your Perfect Salon</h2>
        <p className="text-sm text-gray-600">
          Browse and book appointments at top-rated salons near you
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name…"
            className="md:col-span-5 w-full rounded-lg border px-3 py-2"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (city, zip)…"
            className="md:col-span-4 w-full rounded-lg border px-3 py-2"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="md:col-span-3 w-full rounded-lg border px-3 py-2"
          >
            <option value="top">Top Rated</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          <input
            value={serviceSearch}
            onChange={(e) => setServiceSearch(e.target.value)}
            placeholder="Search services…"
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
            {visibleServices.map((s) => (
              <button
                key={s}
                onClick={() => toggleService(s)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  services.includes(s) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"
                }`}
              >
                {s}
              </button>
            ))}
            {visibleServices.length === 0 && (
              <div className="text-sm text-gray-500">No services match your search.</div>
            )}
          </div>

          {filteredServices.length > serviceLimit && (
            <button
              onClick={() => setServiceLimit((prev) => prev + 10)}
              className="text-sm font-medium text-indigo-600 self-start"
            >
              Show more services
            </button>
          )}

          {(services.length > 0 || q || location || serviceSearch) && (
            <button onClick={clearFilters} className="text-sm text-gray-600 underline self-start">
              Clear filters
            </button>
          )}
        </div>

        {services.length > 0 && <div className="mt-2 flex gap-2 flex-wrap">{chips}</div>}
      </div>

      {loading ? (
        <div className="text-gray-500">Loading salons…</div>
      ) : salons.length === 0 ? (
        <div className="text-gray-600">No salons match your filters.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {salons.map((s) => (
            <SalonCard key={s.id} salon={s} />
          ))}
        </div>
      )}
    </div>
  );
}

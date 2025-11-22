import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../shared/api/client.js";

export default function OwnerDashboard() {
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api("/salons/mine");
        if (cancelled) return;
        setSalon(res.salon || null);
      } catch (err) {
        if (!cancelled) setSalon(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
        cancelled = true;
    };
  }, []);

  const statusBadge = () => {
    if (!salon) return null;
    const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold";
    if (salon.status === "verified") return <span className={`${base} bg-green-100 text-green-800`}>Verified</span>;
    if (salon.status === "pending") return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
    if (salon.status === "rejected") return <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>;
    return <span className={`${base} bg-gray-100 text-gray-700`}>{salon.status}</span>;
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Salon Owner Dashboard</h1>
          <p className="text-gray-600">Overview of your salon business.</p>
        </div>
        {salon && statusBadge()}
      </div>

      {loading && (
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Loading your salon...</p>
        </div>
      )}

      {!loading && !salon && (
        <div className="p-6 bg-white border rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">No salon on file</h3>
            <p className="text-sm text-gray-600">Submit your first application to unlock the owner tools.</p>
          </div>
          <button
            onClick={() => navigate("/salon-registration")}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Register Salon
          </button>
        </div>
      )}

      {!loading && salon && salon.status !== "verified" && (
        <div className="p-6 bg-white border rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{salon.name || "Your salon"}</h3>
            <p className="text-sm text-gray-600">Status: {salon.status || "pending"}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/salon-registration")}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              View / Edit Application
            </button>
          </div>
        </div>
      )}

      {!loading && salon && salon.status === "verified" && (
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-1">{salon.name}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {salon.city}, {salon.state} {salon.zip_code}
          </p>
          <p className="text-sm text-gray-500">Owner tools coming soon.</p>
        </div>
      )}

      <div className="p-6 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-500">👷 This page is under construction</p>
      </div>
    </div>
  );
}

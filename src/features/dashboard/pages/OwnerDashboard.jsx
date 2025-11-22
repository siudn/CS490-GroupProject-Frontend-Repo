import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../shared/api/client.js";
import { checkSetupStatus } from "../../salon-reg/api.js";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

export default function OwnerDashboard() {
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(null);
  const [checkingSetup, setCheckingSetup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api("/salons/mine");
        if (cancelled) return;
        const salonData = res.salon || null;
        setSalon(salonData);
        
        // Check setup status if salon is verified
        if (salonData && salonData.status === "verified" && salonData.id) {
          setCheckingSetup(true);
          try {
            const setupStatus = await checkSetupStatus(salonData.id);
            if (!cancelled) {
              setSetupComplete(setupStatus.isComplete);
            }
          } catch (err) {
            if (!cancelled) setSetupComplete(false);
          } finally {
            if (!cancelled) setCheckingSetup(false);
          }
        } else {
          setSetupComplete(null);
        }
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
        <div className="p-6 bg-white border rounded-lg shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">{salon.name}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {salon.city}, {salon.state} {salon.zip_code}
            </p>
          </div>
          
          {checkingSetup ? (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Checking setup status...</p>
            </div>
          ) : setupComplete === false ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-1">Setup Required</h4>
                  <p className="text-sm text-amber-800 mb-3">
                    Complete your salon setup to unlock the full owner portal. You need to:
                  </p>
                  <ul className="text-sm text-amber-800 space-y-1 mb-4 list-disc list-inside">
                    <li>Set salon hours</li>
                    <li>Add at least one service</li>
                    <li>Add at least one employee</li>
                    <li>Assign at least one service to an employee</li>
                  </ul>
                  <button
                    onClick={() => navigate("/salon-setup")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                  >
                    Complete Setup
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : setupComplete === true ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Setup Complete!</h4>
                  <p className="text-sm text-green-800">
                    Your salon is fully configured and ready to accept bookings.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

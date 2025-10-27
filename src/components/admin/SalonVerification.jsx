import React, { useState } from "react";
import { CheckCircle, XCircle, Clock, FileText, Phone } from "lucide-react";

export default function SalonVerification() {
  const [pendingSalons, setPendingSalons] = useState([
    {
      id: "1",
      name: "Luxe Hair Studio",
      address: "456 Oak St, New York, NY 10002",
      phone: "(555) 234-5678",
      description: "Premium hair salon offering cutting-edge styles",
      document: "#",
      image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400",
      status: "pending",
    },
    {
      id: "2",
      name: "Urban Cuts",
      address: "789 Elm St, Brooklyn, NY 11201",
      phone: "(555) 345-6789",
      description: "Modern barbershop for the urban professional",
      document: "#",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
      status: "pending",
    },
  ]);

  const [approvedSalons, setApprovedSalons] = useState([]);
  const [rejectedSalons, setRejectedSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [view, setView] = useState("pending");

  const handleApprove = (salon) => {
    setPendingSalons(pendingSalons.filter((s) => s.id !== salon.id));
    setApprovedSalons([...approvedSalons, { ...salon, status: "approved" }]);
  };

  const handleReject = (salon) => {
    if (!rejectionReason) return;
    setPendingSalons(pendingSalons.filter((s) => s.id !== salon.id));
    setRejectedSalons([
      ...rejectedSalons,
      { ...salon, status: "rejected", rejectionReason },
    ]);
    setRejectionReason("");
  };

  const SalonCard = ({ salon, showActions }) => (
    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-3">
      <div className="flex gap-4">
        <img
          src={salon.image}
          alt={salon.name}
          className="w-28 h-28 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{salon.name}</h3>
            {salon.status === "pending" && (
              <span className="text-gray-600 text-sm flex items-center gap-1">
                <Clock size={14} /> Pending
              </span>
            )}
            {salon.status === "approved" && (
              <span className="text-green-600 text-sm flex items-center gap-1">
                <CheckCircle size={14} /> Approved
              </span>
            )}
            {salon.status === "rejected" && (
              <span className="text-red-600 text-sm flex items-center gap-1">
                <XCircle size={14} /> Rejected
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{salon.address}</p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Phone size={14} /> {salon.phone}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-700">{salon.description}</p>

      <div className="flex items-center gap-2 text-sm text-blue-600 underline cursor-pointer">
        <FileText size={14} />
        <a href={salon.document} target="_blank" rel="noreferrer">
          View Document
        </a>
      </div>

      {salon.status === "rejected" && salon.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          <strong>Reason:</strong> {salon.rejectionReason}
        </div>
      )}

      {showActions && (
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => handleApprove(salon)}
            className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => setSelectedSalon(salon)}
            className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );

  const salonsToShow =
    view === "pending"
      ? pendingSalons
      : view === "approved"
      ? approvedSalons
      : rejectedSalons;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Salon Verification Center
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Review and approve salon applications to ensure quality standards.
        </p>

        <div className="flex justify-center gap-3 mb-8">
          <button
            className={`px-4 py-2 rounded-md ${
              view === "pending" ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("pending")}
          >
            Pending ({pendingSalons.length})
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              view === "approved" ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("approved")}
          >
            Approved ({approvedSalons.length})
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              view === "rejected" ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("rejected")}
          >
            Rejected ({rejectedSalons.length})
          </button>
        </div>

        <div className="space-y-4">
          {salonsToShow.length > 0 ? (
            salonsToShow.map((salon) => (
              <SalonCard
                key={salon.id}
                salon={salon}
                showActions={view === "pending"}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No salons found</p>
          )}
        </div>

        {/* Guidelines Section */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">
            Verification Guidelines
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Verify business license is valid and current.</li>
            <li>Confirm business address matches license.</li>
            <li>Check for any red flags or inconsistencies.</li>
            <li>Verify contact information is reachable.</li>
          </ul>
        </div>
      </div>

      {/* Rejection Modal */}
      {selectedSalon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg space-y-4">
            <h3 className="font-semibold text-lg">Reject Application</h3>
            <p className="text-sm text-gray-600">
              Provide a reason for rejecting{" "}
              <strong>{selectedSalon.name}</strong>
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows="4"
              placeholder="Enter reason..."
              className="w-full border rounded-md p-2 text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedSalon(null)}
                className="px-3 py-1 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedSalon)}
                disabled={!rejectionReason}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

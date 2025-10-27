import React, { useState } from "react";
import SalonApplicationForm from "../components/admin/SalonApplicationForm";
import DocumentUpload from "../components/admin/DocumentUpload";
import AdminDashboard from "../components/admin/AdminDashboard";
import RejectionNotice from "../components/admin/RejectionNotice";
import ResubmissionForm from "../components/admin/ResubmissionForm";
import SalonPortalActivation from "../components/admin/SalonPortalActivation";

export default function AdminPreview() {
  const [view, setView] = useState("form");

  const views = [
    { id: "form", name: "FRONT-08: Application Form", component: <SalonApplicationForm /> },
    { id: "upload", name: "FRONT-09: Document Upload", component: <DocumentUpload /> },
    { id: "dashboard", name: "FRONT-11/12: Admin Dashboard", component: <AdminDashboard /> },
    { id: "rejection", name: "FRONT-15: Rejection Notice", component: <RejectionNotice /> },
    { id: "resubmission", name: "FRONT-13: Resubmission Form", component: <ResubmissionForm /> },
    { id: "activation", name: "FRONT-14: Activation Confirmation", component: <SalonPortalActivation /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black text-white py-4 px-8 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-semibold">Admin Preview Dashboard</h1>
        <div className="flex gap-3">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`px-3 py-1 rounded-md text-sm transition ${
                view === v.id ? "bg-white text-black" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {v.id.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-grow bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">{views.find((v) => v.id === view)?.component}</div>
      </main>
    </div>
  );
}

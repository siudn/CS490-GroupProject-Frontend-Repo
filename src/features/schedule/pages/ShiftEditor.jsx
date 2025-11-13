import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AvailabilitySetup from "../../../components/Provider/AvailabilitySetup.jsx";

export default function ShiftEditor() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 text-gray-900 rounded-md hover:bg-gray-200 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Availability</h1>
          <p className="text-gray-600 mt-1">Set your weekly working hours</p>
        </div>
      </div>
      <AvailabilitySetup />
    </div>
  );
}

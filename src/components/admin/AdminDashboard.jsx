import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function AdminDashboard() {
  const [selectedSalon, setSelectedSalon] = useState(null);

  const applications = [
    {
      id: 1,
      salonName: "Elite Hair Studio",
      owner: "Sarah Johnson",
      status: "Pending Review",
      date: "2025-10-25",
    },
    {
      id: 2,
      salonName: "Style Hub",
      owner: "Mike Chen",
      status: "Under Verification",
      date: "2025-10-23",
    },
    {
      id: 3,
      salonName: "Glam Studio",
      owner: "Emma Davis",
      status: "Approved",
      date: "2025-10-20",
    },
    {
      id: 4,
      salonName: "Luxe Beauty Lounge",
      owner: "Olivia Martinez",
      status: "Rejected",
      date: "2025-10-18",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <Card className="max-w-6xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Salon Application Review Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="text-left py-3 px-4">Salon Name</th>
                <th className="text-left py-3 px-4">Owner</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Submission Date</th>
                <th className="text-right py-3 px-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{app.salonName}</td>
                  <td className="py-3 px-4">{app.owner}</td>
                  <td className="py-3 px-4">
                    {app.status === "Approved" && (
                      <Badge className="bg-green-100 text-green-700">
                        Approved
                      </Badge>
                    )}
                    {app.status === "Pending Review" && (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        Pending
                      </Badge>
                    )}
                    {app.status === "Under Verification" && (
                      <Badge className="bg-blue-100 text-blue-700">
                        Verifying
                      </Badge>
                    )}
                    {app.status === "Rejected" && (
                      <Badge className="bg-red-100 text-red-700">Rejected</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{app.date}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSalon(app)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {selectedSalon && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card className="w-[480px] bg-white">
            <CardHeader>
              <CardTitle>{selectedSalon.salonName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>Owner:</strong> {selectedSalon.owner}
              </p>
              <p>
                <strong>Status:</strong> {selectedSalon.status}
              </p>
              <p>
                <strong>Submission Date:</strong> {selectedSalon.date}
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSalon(null)}
                >
                  Close
                </Button>
                <Button>Open Review</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

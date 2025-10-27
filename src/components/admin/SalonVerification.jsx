import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle2, XCircle, AlertCircle, Search } from "lucide-react";

export default function SalonVerification() {
  const [salons, setSalons] = useState([
    {
      id: 1,
      name: "Glam Studio",
      owner: "Sarah Johnson",
      city: "New York, NY",
      license: "License_GlamStudio.pdf",
      status: "pending",
    },
    {
      id: 2,
      name: "Elite Cuts",
      owner: "Mike Chen",
      city: "Chicago, IL",
      license: "License_EliteCuts.pdf",
      status: "pending",
    },
    {
      id: 3,
      name: "Style Hub",
      owner: "Emma Davis",
      city: "Dallas, TX",
      license: "License_StyleHub.pdf",
      status: "approved",
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setSalons((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-10 lg:px-20 py-12 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Salon Verification Panel</h1>
          <p className="text-gray-500 mt-1">
            Review and approve pending salon applications.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search salons..."
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Verification List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {salons.map((salon) => (
          <Card key={salon.id} className="shadow-md border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {salon.name}
              </CardTitle>
              <CardDescription>
                Owner: {salon.owner}  •  {salon.city}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>
                  <strong>License:</strong> {salon.license}
                </p>
              </div>

              {salon.status === "approved" ? (
                <Badge className="bg-green-100 text-green-700">Approved</Badge>
              ) : salon.status === "rejected" ? (
                <Badge className="bg-red-100 text-red-700">Rejected</Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-700">Pending Review</Badge>
              )}

              <div className="flex justify-between mt-4">
                {salon.status === "pending" ? (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1"
                      onClick={() => handleStatusChange(salon.id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-300 text-sm px-3 py-1"
                      onClick={() => handleStatusChange(salon.id, "rejected")}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      className="text-yellow-600 border-yellow-300 text-sm px-3 py-1"
                      onClick={() => alert("Requested additional information.")}
                    >
                      Request Info
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="text-gray-600 text-sm"
                    onClick={() => handleStatusChange(salon.id, "pending")}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Message */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-purple-600" />
          <CardTitle>Verification Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Admins should review pending applications within 48 hours. Notifications are sent to owners automatically after approval or rejection.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-3 gap-4 text-center mt-4">
            <div>
              <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-sm text-gray-700 font-medium">Approved: 2</p>
            </div>
            <div>
              <XCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
              <p className="text-sm text-gray-700 font-medium">Rejected: 1</p>
            </div>
            <div>
              <AlertCircle className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
              <p className="text-sm text-gray-700 font-medium">Pending: 3</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

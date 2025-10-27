import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function SalonPortalActivation() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
      <Card className="max-w-lg text-center shadow-lg border border-gray-200 p-10">
        <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto mb-4" />
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Your Salon is Now Live!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-gray-600">
            Congratulations! Your salon <strong>Elite Hair Studio</strong> has
            been approved and activated. You can now manage bookings, update
            services, and monitor revenue from your Salon Portal.
          </p>

          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">
              Remember to set your operating hours, add staff profiles, and
              publish your service list to attract more clients.
            </AlertDescription>
          </Alert>

          <div className="flex justify-center gap-4">
            <Button className="bg-black text-white hover:bg-gray-900">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">View Listings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

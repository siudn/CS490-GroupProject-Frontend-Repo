import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle2, Settings, ArrowRight } from "lucide-react";

export default function SalonPortalActivation() {
  return (
    <div className="min-h-screen bg-gray-50 px-10 lg:px-20 py-16 flex flex-col items-center">
      <Card className="max-w-3xl w-full shadow-md border border-gray-200">
        <CardHeader className="text-center space-y-3">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <CardTitle className="text-2xl font-bold text-gray-800">
            Salon Approved — Welcome Aboard!
          </CardTitle>
          <CardDescription className="text-gray-500">
            Your salon has been successfully verified. Complete setup to activate your portal.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 py-4">
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-700 text-sm">
              Congratulations! Your salon is now part of the platform. Follow the steps below to
              configure your account, add staff, and publish your services.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-sm transition">
              <Settings className="h-8 w-8 text-purple-600 mb-2" />
              <p className="font-semibold text-gray-800">Set up your business profile</p>
              <p className="text-sm text-gray-500">
                Add contact details, hours, and service categories visible to customers.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-sm transition">
              <Settings className="h-8 w-8 text-purple-600 mb-2" />
              <p className="font-semibold text-gray-800">Upload service menu</p>
              <p className="text-sm text-gray-500">
                List your services, durations, and prices to start taking bookings.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-sm transition">
              <Settings className="h-8 w-8 text-purple-600 mb-2" />
              <p className="font-semibold text-gray-800">Add team members</p>
              <p className="text-sm text-gray-500">
                Invite stylists or employees and assign their service specialties.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-sm transition">
              <Settings className="h-8 w-8 text-purple-600 mb-2" />
              <p className="font-semibold text-gray-800">Connect payment details</p>
              <p className="text-sm text-gray-500">
                Securely link your bank account to receive client payments.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button className="bg-black hover:bg-gray-900 text-white px-8 py-2">
              Go to Salon Portal <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-10 text-gray-500 text-sm">
        Need help? Visit our{" "}
        <a href="#" className="text-purple-600 hover:underline">
          onboarding guide
        </a>{" "}
        or contact support.
      </div>
    </div>
  );
}

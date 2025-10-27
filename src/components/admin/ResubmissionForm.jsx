import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResubmissionForm() {
  const [salonName, setSalonName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [license, setLicense] = useState("");
  const [resubmitted, setResubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!salonName || !address || !phone || !license) {
      setError("Please fill in all required fields and upload your business license.");
      return;
    }
    setError("");
    setResubmitted(true);
  };

  if (resubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-2xl font-semibold">
            Application Resubmitted Successfully
          </CardTitle>
          <CardContent className="text-gray-600 mt-3">
            Your updated application has been sent to our admin team for review. You’ll receive an email once it’s reviewed.
          </CardContent>
          <Button className="mt-4" onClick={() => setResubmitted(false)}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-10 lg:px-20 py-16">
      <Card className="max-w-3xl mx-auto shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Update and Resubmit Application
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>
              Feedback from Admin: Missing or invalid business license verification. Please re-upload a valid document.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salon Name *
              </label>
              <Input
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                placeholder="Elite Hair Studio"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Address *
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, New York, NY 10001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Updated Business License *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 mb-2">
                  Upload your new business license document
                </p>
                <Input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setLicense(e.target.files?.[0]?.name || "")}
                  required
                />
                {license && (
                  <Badge className="mt-3 bg-green-100 text-green-700">
                    File Attached: {license}
                  </Badge>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white">
              Resubmit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

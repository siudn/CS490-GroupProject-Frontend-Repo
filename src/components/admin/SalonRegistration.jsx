import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { CheckCircle2, XCircle, Clock, Upload, AlertCircle } from "lucide-react";

export default function SalonRegistration() {
  const [status, setStatus] = useState("not_submitted");
  const [salonName, setSalonName] = useState("");
  const [owner, setOwner] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [license, setLicense] = useState("");
  const [rejectionReason] = useState("Business license verification failed. Please upload a valid license.");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("pending");
  };

  const handleResubmit = () => setStatus("pending");

  // ✅ Approved View
  if (status === "approved") {
    return (
      <Card className="max-w-3xl mx-auto text-center py-12">
        <CardContent className="space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-semibold">Salon Approved!</h2>
          <p className="text-gray-600">
            Your salon <strong>{salonName}</strong> has been verified and is now live.
          </p>
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-600">
              You can now manage your salon, accept bookings, and configure your services.
            </AlertDescription>
          </Alert>
          <Button onClick={() => setStatus("not_submitted")}>Go to Salon Portal</Button>
        </CardContent>
      </Card>
    );
  }

  // ❌ Rejected View
  if (status === "rejected") {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Application Rejected</h2>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{rejectionReason}</AlertDescription>
            </Alert>
            <div className="flex justify-center gap-4">
              <Button onClick={handleResubmit}>Update & Resubmit</Button>
              <Button variant="outline" onClick={() => setStatus("not_submitted")}>
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Rejection Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Invalid or expired license</li>
              <li>• Incomplete salon information</li>
              <li>• Missing documents</li>
              <li>• Business address could not be verified</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ⏳ Pending View
  if (status === "pending") {
    return (
      <Card className="max-w-3xl mx-auto text-center py-12">
        <CardContent className="space-y-4">
          <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
          <h2 className="text-xl font-semibold">Application Under Review</h2>
          <p className="text-gray-600">
            Your application is being reviewed. You’ll receive an update within 1–3 business days.
          </p>
          <Alert>
            <AlertDescription>We’ll email you once your application is reviewed.</AlertDescription>
          </Alert>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setStatus("approved")}>
              Simulate Approval
            </Button>
            <Button variant="outline" onClick={() => setStatus("rejected")}>
              Simulate Rejection
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 📝 Default Form View
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-600 text-2xl">Register Your Salon</CardTitle>
          <CardDescription>Complete the form to list your salon on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Salon Name</Label>
                <Input value={salonName} onChange={(e) => setSalonName(e.target.value)} required />
              </div>
              <div>
                <Label>Owner Name</Label>
                <Input value={owner} onChange={(e) => setOwner(e.target.value)} required />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div>
                <Label>Phone</Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your salon’s services"
                rows={4}
                required
              />
            </div>

            <div>
              <Label>Business License</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600 mb-2">Upload your license (PDF or Image)</p>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setLicense(e.target.files?.[0]?.name || "")}
                  required
                />
                {license && (
                  <Badge className="mt-3 bg-green-100 text-green-700">{license}</Badge>
                )}
              </div>
            </div>

            <Alert>
              <AlertDescription>
                Please ensure all information is accurate before submission.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

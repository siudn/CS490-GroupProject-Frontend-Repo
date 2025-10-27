import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { XCircle, AlertCircle, Upload, CheckCircle2 } from "lucide-react";

export default function RejectionNotice() {
  const [appealText, setAppealText] = useState("");
  const [attachment, setAttachment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!appealText.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md text-center p-8">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-2xl">Appeal Submitted Successfully</CardTitle>
          <CardContent className="text-gray-600 mt-3">
            Your appeal has been received. Our team will review it and respond within 3–5 business days.
          </CardContent>
          <Button className="mt-4" onClick={() => setSubmitted(false)}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-10 lg:px-20 py-16">
      <Card className="max-w-3xl mx-auto shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-2" />
          <CardTitle className="text-3xl font-semibold text-gray-800">
            Application Rejected
          </CardTitle>
          <CardDescription className="text-gray-600">
            Please review the feedback below and submit an appeal if applicable.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>
              Your salon application was rejected due to missing or invalid business license verification.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 border rounded-lg p-5 space-y-3">
            <p className="text-gray-700 font-medium">Admin Feedback:</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              The uploaded license document could not be verified. Please upload a valid and legible business license
              or additional documentation proving your registration.
            </p>
            <Badge className="bg-yellow-100 text-yellow-800 mt-2">
              Required Action: Resubmit verification documents
            </Badge>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appeal Explanation *
              </label>
              <Textarea
                value={appealText}
                onChange={(e) => setAppealText(e.target.value)}
                placeholder="Describe why you believe your application should be reconsidered..."
                rows={5}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attach Supporting Document (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 mb-2">Upload additional license or supporting document</p>
                <Input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setAttachment(e.target.files?.[0]?.name || "")}
                />
                {attachment && (
                  <Badge className="mt-3 bg-green-100 text-green-700">
                    File Attached: {attachment}
                  </Badge>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white">
              Submit Appeal
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-gray-500 text-sm pt-4">
          Need help? Contact our support team at <span className="text-purple-600 ml-1">support@salonica.com</span>
        </CardFooter>
      </Card>
    </div>
  );
}

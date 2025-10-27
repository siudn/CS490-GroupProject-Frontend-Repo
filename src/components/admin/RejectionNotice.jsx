import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Textarea } from "../ui/textarea";
import { XCircle, AlertCircle, Send } from "lucide-react";

export default function RejectionNotice() {
  const [appealMessage, setAppealMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const rejectionReason =
    "Your salon application was rejected due to missing or invalid business license documentation.";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!appealMessage.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md text-center p-8 shadow-lg">
          <AlertCircle className="h-14 w-14 text-green-600 mx-auto mb-3" />
          <CardTitle className="text-2xl font-semibold mb-2">
            Appeal Submitted
          </CardTitle>
          <CardContent className="text-gray-600">
            Your appeal has been submitted successfully. Our admin team will
            review your message and get back to you within 3–5 business days.
          </CardContent>
          <Button className="mt-4" onClick={() => setSubmitted(false)}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
      <Card className="max-w-lg w-full shadow-md border border-gray-200">
        <CardHeader className="text-center">
          <XCircle className="h-14 w-14 text-red-600 mx-auto mb-2" />
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Application Rejected
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>{rejectionReason}</AlertDescription>
          </Alert>

          <p className="text-gray-700 text-sm">
            You may appeal this decision by providing clarification or additional
            details below. Our team will review your appeal promptly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Appeal Message *
            </label>
            <Textarea
              rows={5}
              placeholder="Explain why you believe your application should be reconsidered..."
              value={appealMessage}
              onChange={(e) => setAppealMessage(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-900"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Appeal
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

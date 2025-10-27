import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";

export default function AdminDecisionModal({ salon, onClose }) {
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Decision submitted:", { salon, decision, reason, file });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[600px] bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Review Salon Application
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <p>
                <strong>Salon:</strong> {salon.salonName}
              </p>
              <p>
                <strong>Owner:</strong> {salon.owner}
              </p>
              <p>
                <strong>Submission Date:</strong> {salon.date}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge className="bg-yellow-100 text-yellow-700">
                  {salon.status}
                </Badge>
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-gray-700 font-medium">
                Select your decision:
              </p>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={decision === "approve" ? "default" : "outline"}
                  onClick={() => setDecision("approve")}
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  variant={decision === "reject" ? "destructive" : "outline"}
                  onClick={() => setDecision("reject")}
                >
                  Reject
                </Button>
                <Button
                  type="button"
                  variant={decision === "request_info" ? "default" : "outline"}
                  onClick={() => setDecision("request_info")}
                >
                  Request Info
                </Button>
              </div>
            </div>

            {(decision === "reject" || decision === "request_info") && (
              <div>
                <p className="text-gray-700 mb-2 font-medium">Feedback Message</p>
                <Textarea
                  placeholder={
                    decision === "reject"
                      ? "Explain why this application was rejected..."
                      : "Request additional information..."
                  }
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
            )}

            {decision === "request_info" && (
              <div>
                <p className="text-gray-700 mb-2 font-medium">
                  Optional Attachment
                </p>
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0]?.name || "")}
                />
                {file && (
                  <p className="text-sm text-gray-500 mt-1">
                    Attached: <strong>{file}</strong>
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!decision}>
                Submit Decision
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

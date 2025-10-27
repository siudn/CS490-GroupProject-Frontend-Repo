import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "../ui/badge";

export default function DocumentUpload() {
  const [fileName, setFileName] = useState("");
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setUploaded(true);
    }
  };

  const handleSubmit = () => {
    alert("Document submitted for verification!");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-purple-600 text-2xl font-semibold">
            Upload Business Verification
          </CardTitle>
          <CardDescription>
            Submit your salon’s license or verification document for admin review.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Upload Box */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-purple-400 transition">
            {!uploaded ? (
              <>
                <Upload className="h-10 w-10 mx-auto text-purple-500 mb-3" />
                <p className="text-gray-600">Drag & drop your file here</p>
                <p className="text-xs text-gray-400 mb-4">Accepted formats: PDF, JPG, PNG</p>
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer"
                >
                  Choose File
                </label>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
                <p className="text-gray-800">File uploaded successfully!</p>
                <Badge className="bg-green-100 text-green-700 px-3 py-1">
                  <FileText className="h-4 w-4 mr-1 inline" />
                  {fileName}
                </Badge>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-black hover:bg-gray-900 text-white px-6 py-2"
            >
              Submit Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

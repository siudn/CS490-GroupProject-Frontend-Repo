import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";

export default function SalonApplicationForm() {
  const [formData, setFormData] = useState({
    salonName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    description: "",
    licenseFile: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("Submitted Salon Application:", formData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-purple-600">Salon Application Form</CardTitle>
          <p className="text-gray-500 text-sm">
            Please fill out your business details to begin verification.
          </p>
        </CardHeader>
        <CardContent>
          {submitted && (
            <Alert className="mb-6" variant="default">
              <AlertDescription>
                ✅ Your application has been submitted successfully!
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="salonName">Salon Name</Label>
              <Input
                id="salonName"
                name="salonName"
                value={formData.salonName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Salon Description</Label>
              <Textarea
                id="description"
                name="description"
                rows="4"
                placeholder="Describe your salon’s services, style, or specialties"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="licenseFile">Upload Business License</Label>
              <Input
                type="file"
                id="licenseFile"
                name="licenseFile"
                accept=".pdf,.jpg,.png"
                onChange={handleChange}
              />
              {formData.licenseFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Uploaded: {formData.licenseFile.name}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="default">
                Submit Application
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

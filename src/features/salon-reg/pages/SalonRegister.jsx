import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';
import { Textarea } from '../../../shared/ui/textarea';
import { Alert, AlertDescription } from '../../../shared/ui/alert';
import { Badge } from '../../../shared/ui/badge';
import { CheckCircle2, XCircle, Clock, Upload, AlertCircle } from 'lucide-react';
import { useAuth } from '../../auth/auth-provider.jsx';
import { 
  submitSalonRegistration, 
  getSalonRegistrationStatus, 
  updateSalonRegistration 
} from '../api.js';

export default function SalonRegister() {
  const { user } = useAuth();
  const [status, setStatus] = useState('not_submitted');
  const [loading, setLoading] = useState(false);
  const [salonName, setSalonName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [businessLicense, setBusinessLicense] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [applicationId, setApplicationId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadRegistrationStatus();
    }
  }, [user?.id]);

  const loadRegistrationStatus = async () => {
    try {
      const statusData = await getSalonRegistrationStatus(user.id);
      setStatus(statusData.status);
      setApplicationId(statusData.applicationId);
      setRejectionReason(statusData.rejectionReason || '');
    } catch (error) {
      console.error('Failed to load registration status:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        salonName,
        address,
        phone,
        description,
        businessLicense: businessLicense?.name || '',
        ownerId: user.id,
        ownerName: user.name,
        ownerEmail: user.email
      };

      const result = await submitSalonRegistration(formData);
      
      if (result.success) {
        setStatus('pending');
        setApplicationId(result.applicationId);
      }
    } catch (error) {
      console.error('Failed to submit registration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = async () => {
    setLoading(true);
    
    try {
      const formData = {
        salonName,
        address,
        phone,
        description,
        businessLicense: businessLicense?.name || '',
        ownerId: user.id,
        ownerName: user.name,
        ownerEmail: user.email
      };

      const result = await updateSalonRegistration(applicationId, formData);
      
      if (result.success) {
        setStatus('pending');
      }
    } catch (error) {
      console.error('Failed to resubmit registration:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'approved') {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <h2>Salon Approved!</h2>
          <p className="text-gray-600">
            Your salon <strong>{salonName}</strong> has been verified and is now live on the
            platform.
          </p>
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-600">
              You can now manage your salon, accept bookings, and configure your services.
            </AlertDescription>
          </Alert>
          <Button onClick={() => setStatus('not_submitted')}>View Salon Portal</Button>
        </CardContent>
      </Card>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2>Application Rejected</h2>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{rejectionReason}</AlertDescription>
            </Alert>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleResubmit}>Update & Resubmit</Button>
              <Button variant="outline" onClick={() => setStatus('not_submitted')}>
                Start New Application
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
              <li>• Invalid or expired business license</li>
              <li>• Incomplete salon information</li>
              <li>• Unable to verify business address</li>
              <li>• Missing required documentation</li>
              <li>• Previous policy violations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
          <h2>Application Under Review</h2>
          <p className="text-gray-600">
            Your salon registration is being reviewed by our admin team. This typically takes 1-3
            business days.
          </p>
          <Alert>
            <AlertDescription>
              We'll send you an email once your application has been reviewed.
            </AlertDescription>
          </Alert>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setStatus('approved')} variant="outline">
              Simulate Approval
            </Button>
            <Button onClick={() => setStatus('rejected')} variant="outline">
              Simulate Rejection
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Register Your Salon</CardTitle>
          <CardDescription>
            Complete this form to list your salon on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="salon-name">Salon Name *</Label>
                <Input
                  id="salon-name"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  placeholder="Elite Hair Studio"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Business Address *</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, New York, NY 10001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell customers about your salon..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="license">Business License *</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 mb-2">Upload your business license</p>
                  <p className="text-xs text-gray-500 mb-3">PDF or Image up to 10MB</p>
                  <div className="relative">
                    <Input
                      id="license"
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => setBusinessLicense(e.target.files?.[0] || null)}
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer transition-colors">
                      Choose File
                    </div>
                  </div>
                  {businessLicense && (
                    <Badge className="mt-2">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {businessLicense.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                All information will be verified by our admin team before approval. Make sure all
                details are accurate.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                1
              </Badge>
              <div>
                <p>Submit your application</p>
                <p className="text-xs text-gray-500">
                  Complete the form with accurate information
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                2
              </Badge>
              <div>
                <p>Admin review (1-3 business days)</p>
                <p className="text-xs text-gray-500">
                  Our team verifies your business details
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                3
              </Badge>
              <div>
                <p>Approval notification</p>
                <p className="text-xs text-gray-500">You'll receive an email confirmation</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                4
              </Badge>
              <div>
                <p>Go live!</p>
                <p className="text-xs text-gray-500">
                  Start accepting bookings and managing your salon
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

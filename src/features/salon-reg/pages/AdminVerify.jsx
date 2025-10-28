import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Button } from '../../../shared/ui/button';
import { Badge } from '../../../shared/ui/badge';
import { Textarea } from '../../../shared/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../shared/ui/dialog';
import { Alert, AlertDescription } from '../../../shared/ui/alert';
import { CheckCircle, XCircle, Clock, FileText, MapPin, Phone } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/ui/ImageWithFallback';
import { 
  getSalonApplications, 
  approveSalonApplication, 
  rejectSalonApplication 
} from '../api.js';

export default function AdminVerify() {
  const [pendingSalons, setPendingSalons] = useState([]);
  const [approvedSalons, setApprovedSalons] = useState([]);
  const [rejectedSalons, setRejectedSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSalonApplications();
  }, []);

  const loadSalonApplications = async () => {
    try {
      const applications = await getSalonApplications('all');
      
      setPendingSalons(applications.filter(app => app.status === 'pending'));
      setApprovedSalons(applications.filter(app => app.status === 'approved'));
      setRejectedSalons(applications.filter(app => app.status === 'rejected'));
    } catch (error) {
      console.error('Failed to load salon applications:', error);
    }
  };

  const handleApprove = async () => {
    if (!selectedSalon) return;
    
    setLoading(true);
    try {
      const result = await approveSalonApplication(selectedSalon.id);
      
      if (result.success) {
        setPendingSalons(pendingSalons.filter((s) => s.id !== selectedSalon.id));
        setApprovedSalons([...approvedSalons, { ...selectedSalon, status: 'approved' }]);
        setShowApproveDialog(false);
        setSelectedSalon(null);
        setActionSuccess(`${selectedSalon.name} has been approved and notified via email.`);
        setTimeout(() => setActionSuccess(''), 5000);
      }
    } catch (error) {
      console.error('Failed to approve salon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSalon || !rejectionReason) return;
    
    setLoading(true);
    try {
      const result = await rejectSalonApplication(selectedSalon.id, rejectionReason);
      
      if (result.success) {
        setPendingSalons(pendingSalons.filter((s) => s.id !== selectedSalon.id));
        setRejectedSalons([
          ...rejectedSalons,
          { ...selectedSalon, status: 'rejected', rejectionReason },
        ]);
        setShowRejectDialog(false);
        setSelectedSalon(null);
        setRejectionReason('');
        setActionSuccess(`${selectedSalon.name} has been rejected and notified via email.`);
        setTimeout(() => setActionSuccess(''), 5000);
      }
    } catch (error) {
      console.error('Failed to reject salon:', error);
    } finally {
      setLoading(false);
    }
  };

  const SalonCard = ({ salon, showActions }) => (
    <Card>
      <CardHeader>
        <div className="flex gap-4">
          <ImageWithFallback
            src={salon.image}
            alt={salon.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <CardTitle>{salon.name}</CardTitle>
              {salon.status === 'pending' && (
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              )}
              {salon.status === 'approved' && (
                <Badge>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </Badge>
              )}
              {salon.status === 'rejected' && (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Rejected
                </Badge>
              )}
            </div>
            <CardDescription className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>{salon.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>{salon.phone}</span>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-700">{salon.description}</p>

        {salon.status === 'rejected' && salon.rejectionReason && (
          <Alert variant="destructive">
            <AlertDescription>
              <strong>Rejection reason:</strong> {salon.rejectionReason}
            </AlertDescription>
          </Alert>
        )}

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-gray-600" />
            <span className="text-sm">Business License</span>
          </div>
          <Button variant="outline" size="sm">
            View Document
          </Button>
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={() => {
                setSelectedSalon(salon);
                setShowApproveDialog(true);
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                setSelectedSalon(salon);
                setShowRejectDialog(true);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {actionSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">{actionSuccess}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Salon Verification Center</CardTitle>
          <CardDescription>
            Review and approve salon applications to ensure quality standards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending Review ({pendingSalons.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedSalons.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedSalons.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-4">
              {pendingSalons.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No pending applications</p>
                </div>
              ) : (
                pendingSalons.map((salon) => (
                  <SalonCard key={salon.id} salon={salon} showActions={true} />
                ))
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4 mt-4">
              {approvedSalons.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No approved salons</p>
                </div>
              ) : (
                approvedSalons.map((salon) => (
                  <SalonCard key={salon.id} salon={salon} showActions={false} />
                ))
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4 mt-4">
              {rejectedSalons.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <XCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No rejected salons</p>
                </div>
              ) : (
                rejectedSalons.map((salon) => (
                  <SalonCard key={salon.id} salon={salon} showActions={false} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p>Verify business license is valid and current</p>
                <p className="text-xs text-gray-500">Check expiration date and jurisdiction</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p>Confirm business address matches license</p>
                <p className="text-xs text-gray-500">
                  Use Google Maps to verify location exists
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p>Check for any red flags or inconsistencies</p>
                <p className="text-xs text-gray-500">
                  Look for professional presentation and completeness
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p>Verify contact information is reachable</p>
                <p className="text-xs text-gray-500">Phone number should be valid format</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Salon Application</DialogTitle>
            <DialogDescription>
              Confirm that you want to approve <strong>{selectedSalon?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertDescription>
              The salon owner will be notified via email and can immediately start accepting
              bookings on the platform.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={loading}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {loading ? 'Approving...' : 'Approve Salon'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Salon Application</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting <strong>{selectedSalon?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm mb-2 block">Rejection Reason *</label>
              <Textarea
                placeholder="Explain why this application is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <Alert>
              <AlertDescription>
                The salon owner will receive this message and can resubmit their application after
                addressing the issues.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason || loading}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {loading ? 'Rejecting...' : 'Reject Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

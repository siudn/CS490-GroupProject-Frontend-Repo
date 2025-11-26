import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/auth-provider.jsx";
import { getCurrentUserProfile, updateUserProfile, getAvailableServices } from "../api.js";
import { listUserAppointments } from "../../booking/api.js";
import { getCustomerPoints } from "../../loyalty/api.js";
import { Card } from "../../../shared/ui/card.jsx";
import { Button } from "../../../shared/ui/button.jsx";
import { Input } from "../../../shared/ui/input.jsx";
import { Label } from "../../../shared/ui/label.jsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../shared/ui/tabs.jsx";
import { Badge } from "../../../shared/ui/badge.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui/select.jsx";
import { ImageWithFallback } from "../../../shared/ui/ImageWithFallback.jsx";

const AGE_BRACKETS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const GENDERS = ["male", "female", "non-binary", "prefer-not-to-say", "other"];

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Data states
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  const [loyaltyData, setLoyaltyData] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  // Form states
  const [profileForm, setProfileForm] = useState({});

  const userRole = user?.role;
  const isCustomer = userRole === "customer";
  const isOwner = userRole === "salon_owner" || userRole === "owner";
  const isBarber = userRole === "barber";
  const isAdmin = userRole === "admin";

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    setError(null);
    try {
      const profileData = await getCurrentUserProfile();
      setProfile(profileData);
      
      // Initialize form with profile data (snake_case from backend)
      setProfileForm({
        first_name: profileData?.first_name || "",
        last_name: profileData?.last_name || "",
        email: profileData?.email || "",
        phone: profileData?.phone || "",
        profile_image_url: profileData?.profile_image_url || "",
        date_of_birth: profileData?.date_of_birth || "",
        city: profileData?.city || "",
        state: profileData?.state || "",
        age_bracket: profileData?.age_bracket || null,
        gender: profileData?.gender || null,
        preferred_services: profileData?.preferred_services || [],
      });

      // Load available services for preferred_services dropdown
      try {
        const services = await getAvailableServices();
        setAvailableServices(services || []);
      } catch (err) {
        console.error("Failed to load services:", err);
        setAvailableServices([]);
      }

      // Load customer-specific data only for customers
      if (isCustomer) {
        try {
          const [appointmentsData, loyaltyDataRes] = await Promise.all([
            listUserAppointments(),
            getCustomerPoints(),
          ]);
          setAppointments(appointmentsData || { upcoming: [], past: [] });
          setLoyaltyData(loyaltyDataRes || []);
        } catch (err) {
          console.error("Failed to load customer data:", err);
        }
      }
    } catch (err) {
      setError("Failed to load profile data: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    // Frontend validation
    if (profileForm.first_name && profileForm.first_name.length > 100) {
      setError("First name must be 100 characters or less");
      setSaving(false);
      return;
    }
    if (profileForm.last_name && profileForm.last_name.length > 100) {
      setError("Last name must be 100 characters or less");
      setSaving(false);
      return;
    }
    if (profileForm.phone && profileForm.phone.length > 20) {
      setError("Phone number must be 20 characters or less");
      setSaving(false);
      return;
    }
    if (profileForm.city && profileForm.city.length > 100) {
      setError("City must be 100 characters or less");
      setSaving(false);
      return;
    }
    if (profileForm.state && profileForm.state.length > 50) {
      setError("State must be 50 characters or less");
      setSaving(false);
      return;
    }

    try {
      // Only send fields that have values (partial update)
      const updateData = {};
      if (profileForm.first_name !== undefined) updateData.first_name = profileForm.first_name || null;
      if (profileForm.last_name !== undefined) updateData.last_name = profileForm.last_name || null;
      if (profileForm.phone !== undefined) updateData.phone = profileForm.phone || null;
      if (profileForm.profile_image_url !== undefined) updateData.profile_image_url = profileForm.profile_image_url || null;
      if (profileForm.date_of_birth !== undefined) updateData.date_of_birth = profileForm.date_of_birth || null;
      if (profileForm.city !== undefined) updateData.city = profileForm.city || null;
      if (profileForm.state !== undefined) updateData.state = profileForm.state || null;
      if (profileForm.age_bracket !== undefined) updateData.age_bracket = profileForm.age_bracket || null;
      if (profileForm.gender !== undefined) updateData.gender = profileForm.gender || null;
      if (profileForm.preferred_services !== undefined) {
        updateData.preferred_services = Array.isArray(profileForm.preferred_services) 
          ? profileForm.preferred_services 
          : [];
      }

      const result = await updateUserProfile(updateData);
      setProfile({ ...profile, ...result });
      setIsEditingProfile(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err.message || "Unknown error";
      
      // Try to parse error details if available
      let parsedError = null;
      try {
        parsedError = JSON.parse(errorMessage);
      } catch {
        // Not JSON, use as-is
      }

      if (parsedError) {
        if (parsedError.details && Array.isArray(parsedError.details)) {
          const detailMessages = parsedError.details.map(d => d.msg || d.message || JSON.stringify(d)).join(", ");
          setError(`Validation failed: ${detailMessages}`);
        } else if (parsedError.error) {
          setError(parsedError.error);
        } else {
          setError(errorMessage);
        }
      } else {
        setError("Failed to update profile: " + errorMessage);
      }
    } finally {
      setSaving(false);
    }
  }

  function handleCancelProfile() {
    // Reset form to original profile data
    setProfileForm({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      profile_image_url: profile?.profile_image_url || "",
      date_of_birth: profile?.date_of_birth || "",
      city: profile?.city || "",
      state: profile?.state || "",
      age_bracket: profile?.age_bracket || null,
      gender: profile?.gender || null,
      preferred_services: profile?.preferred_services || [],
    });
    setIsEditingProfile(false);
    setError(null);
  }

  function togglePreferredService(serviceName) {
    const current = profileForm.preferred_services || [];
    const updated = current.includes(serviceName)
      ? current.filter(s => s !== serviceName)
      : [...current, serviceName];
    setProfileForm({ ...profileForm, preferred_services: updated });
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine tabs based on role
  const tabs = ["profile"];
  if (isCustomer) {
    tabs.push("history", "loyalty");
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your profile information and preferences.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {successMessage}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full mb-8 ${tabs.length === 1 ? "grid-cols-1" : tabs.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          <TabsTrigger value="profile">Profile Info</TabsTrigger>
          {isCustomer && (
            <>
              <TabsTrigger value="history">Visit History</TabsTrigger>
              <TabsTrigger value="loyalty">Loyalty Points</TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Profile Info Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Personal Information</h2>
              {!isEditingProfile ? (
                <Button onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
              ) : (
                <div className="space-x-2">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={handleCancelProfile}>Cancel</Button>
                </div>
              )}
            </div>

            {/* Profile Image */}
            <div className="mb-6">
              <Label>Profile Image URL</Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {profileForm.profile_image_url ? (
                    <ImageWithFallback
                      src={profileForm.profile_image_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-2xl">?</span>
                  )}
                </div>
                {isEditingProfile && (
                  <div className="flex-1">
                    <Input
                      id="profile_image_url"
                      type="url"
                      value={profileForm.profile_image_url || ""}
                      onChange={(e) => setProfileForm({ ...profileForm, profile_image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="max-w-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter a URL to your profile image</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={profileForm.first_name || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  disabled={!isEditingProfile}
                  maxLength={100}
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={profileForm.last_name || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  disabled={!isEditingProfile}
                  maxLength={100}
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email || ""}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileForm.phone || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  disabled={!isEditingProfile}
                  maxLength={20}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={profileForm.date_of_birth || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
                  disabled={!isEditingProfile}
                />
              </div>

              <div>
                <Label htmlFor="age_bracket">Age Bracket</Label>
                <Select
                  value={profileForm.age_bracket || undefined}
                  onValueChange={(value) => setProfileForm({ ...profileForm, age_bracket: value === "__none__" ? null : value })}
                  disabled={!isEditingProfile}
                >
                  <SelectTrigger id="age_bracket">
                    <SelectValue placeholder="Select age bracket" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {AGE_BRACKETS.map(bracket => (
                      <SelectItem key={bracket} value={bracket}>{bracket}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profileForm.gender || undefined}
                  onValueChange={(value) => setProfileForm({ ...profileForm, gender: value === "__none__" ? null : value })}
                  disabled={!isEditingProfile}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {GENDERS.map(gender => (
                      <SelectItem key={gender} value={gender}>
                        {gender.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profileForm.city || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  disabled={!isEditingProfile}
                  maxLength={100}
                  placeholder="Enter city"
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={profileForm.state || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  disabled={!isEditingProfile}
                  maxLength={50}
                  placeholder="Enter state"
                />
              </div>

              {/* Preferred Services - Multi-select */}
              {isCustomer && (
                <div className="md:col-span-2">
                  <Label htmlFor="preferred_services">Preferred Services</Label>
                  <div className="mt-2 p-4 border rounded-lg bg-gray-50 min-h-[100px]">
                    {availableServices.length === 0 ? (
                      <p className="text-sm text-gray-500">Loading services...</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {availableServices.map((service) => {
                          const isSelected = (profileForm.preferred_services || []).includes(service);
                          return (
                            <button
                              key={service}
                              type="button"
                              onClick={() => isEditingProfile && togglePreferredService(service)}
                              disabled={!isEditingProfile}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                              } ${!isEditingProfile ? "cursor-default" : "cursor-pointer"}`}
                            >
                              {service}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {isEditingProfile && (
                      <p className="text-xs text-gray-500 mt-2">Click services to select/deselect your preferences</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role-specific quick links */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
              <div className="flex flex-wrap gap-2">
                {isOwner && (
                  <Button variant="outline" onClick={() => navigate("/owner/dashboard")}>
                    Salon Dashboard
                  </Button>
                )}
                {isBarber && (
                  <Button variant="outline" onClick={() => navigate("/schedule")}>
                    My Schedule
                  </Button>
                )}
                {isAdmin && (
                  <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
                    Admin Dashboard
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Visit History Tab - Customer Only */}
        {isCustomer && (
          <TabsContent value="history" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Appointment History</h2>

              {appointments.past && appointments.past.length > 0 ? (
                <div className="space-y-4">
                  {appointments.past.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{appt.salon?.name}</h3>
                            <Badge variant={appt.status === "completed" ? "default" : "outline"}>
                              {appt.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-1">{appt.salon?.address}</p>
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Service:</span> {appt.service?.name}
                          </p>
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Provider:</span> {appt.employee?.name}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Date:</span>{" "}
                            {appt.whenISO ? new Date(appt.whenISO).toLocaleDateString() : "N/A"} at{" "}
                            {appt.whenISO ? new Date(appt.whenISO).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}
                          </p>
                          {appt.cancellation_reason && (
                            <p className="text-red-600 text-sm mt-2">
                              <span className="font-medium">Cancellation reason:</span> {appt.cancellation_reason}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">${appt.service?.price || "N/A"}</p>
                          <p className="text-sm text-gray-500">{appt.payment_status || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No appointment history yet.</p>
                  <p className="text-sm mt-2">Book your first appointment to see it here!</p>
                </div>
              )}
            </Card>

            {appointments.upcoming && appointments.upcoming.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Upcoming Appointments</h2>
                <div className="space-y-4">
                  {appointments.upcoming.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-4 border border-blue-200 bg-blue-50 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{appt.salon?.name}</h3>
                            <Badge variant="default">{appt.status}</Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-1">{appt.salon?.address}</p>
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Service:</span> {appt.service?.name}
                          </p>
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Provider:</span> {appt.employee?.name}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Date:</span>{" "}
                            {appt.whenISO ? new Date(appt.whenISO).toLocaleDateString() : "N/A"} at{" "}
                            {appt.whenISO ? new Date(appt.whenISO).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">${appt.service?.price || "N/A"}</p>
                          <p className="text-sm text-gray-500">{appt.payment_status || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>
        )}

        {/* Loyalty Points Tab - Customer Only */}
        {isCustomer && (
          <TabsContent value="loyalty" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Loyalty Points Summary</h2>

              {loyaltyData && loyaltyData.length > 0 ? (
                <div className="space-y-6">
                  {loyaltyData.map((salon) => (
                    <div key={salon.salon_id} className="border-b pb-6 last:border-b-0">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">{salon.salon_name}</h3>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-blue-600">{salon.balance}</p>
                          <p className="text-sm text-gray-500">Points Available</p>
                        </div>
                      </div>

                      {salon.activity && salon.activity.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3">Recent Activity</h4>
                          <div className="space-y-2">
                            {salon.activity.slice(0, 5).map((activity) => (
                              <div
                                key={activity.id}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded"
                              >
                                <div>
                                  <p className="text-sm font-medium">{activity.description}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(activity.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div
                                  className={`font-semibold ${
                                    activity.type === "earned" ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {activity.type === "earned" ? "+" : "-"}
                                  {activity.points}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No loyalty points yet.</p>
                  <p className="text-sm mt-2">Complete appointments to start earning points!</p>
                </div>
              )}
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../../features/auth/auth-provider.jsx";
import { getUserProfile, updateUserProfile, getUserPreferences, updateUserPreferences } from "../../features/customer/api.js";
import { listUserAppointments } from "../../features/booking/api.js";
import { getCustomerPoints } from "../../features/loyalty/api.js";
import { Card } from "../../shared/ui/card.jsx";
import { Button } from "../../shared/ui/button.jsx";
import { Input } from "../../shared/ui/input.jsx";
import { Label } from "../../shared/ui/label.jsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../shared/ui/tabs.jsx";
import { Badge } from "../../shared/ui/badge.jsx";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Data states
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [appointments, setAppointments] = useState({ active: [], history: [] });
  const [loyaltyData, setLoyaltyData] = useState([]);

  // Form states
  const [profileForm, setProfileForm] = useState({});
  const [preferencesForm, setPreferencesForm] = useState({});

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    setError(null);
    try {
      const [profileData, preferencesData, appointmentsData, loyaltyDataRes] = await Promise.all([
        getUserProfile(),
        getUserPreferences(),
        listUserAppointments(),
        getCustomerPoints(),
      ]);
      
      setProfile(profileData);
      setProfileForm(profileData);
      setPreferences(preferencesData);
      setPreferencesForm(preferencesData);
      setAppointments(appointmentsData);
      setLoyaltyData(loyaltyDataRes);
    } catch (err) {
      setError("Failed to load profile data: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const result = await updateUserProfile(profileForm);
      setProfile(result.profile || profileForm);
      setIsEditingProfile(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to update profile: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePreferences() {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const result = await updateUserPreferences(preferencesForm);
      setPreferences(result.preferences || preferencesForm);
      setIsEditingPreferences(false);
      setSuccessMessage("Preferences updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to update preferences: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleCancelProfile() {
    setProfileForm(profile);
    setIsEditingProfile(false);
    setError(null);
  }

  function handleCancelPreferences() {
    setPreferencesForm(preferences);
    setIsEditingPreferences(false);
    setError(null);
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <p className="text-gray-600">Manage your profile, preferences, and view your appointment history.</p>
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
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile Info</TabsTrigger>
          <TabsTrigger value="preferences">Notifications</TabsTrigger>
          <TabsTrigger value="history">Visit History</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Points</TabsTrigger>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileForm.firstName || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  disabled={!isEditingProfile}
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileForm.lastName || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  disabled={!isEditingProfile}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  disabled={!isEditingProfile}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileForm.phone || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  disabled={!isEditingProfile}
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileForm.dateOfBirth || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                  disabled={!isEditingProfile}
                />
              </div>

              <div>
                <Label>Member Since</Label>
                <Input
                  value={profile?.memberSince ? new Date(profile.memberSince).toLocaleDateString() : "N/A"}
                  disabled
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={profileForm.address?.street || ""}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      address: { ...profileForm.address, street: e.target.value }
                    })}
                    disabled={!isEditingProfile}
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileForm.address?.city || ""}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      address: { ...profileForm.address, city: e.target.value }
                    })}
                    disabled={!isEditingProfile}
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profileForm.address?.state || ""}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      address: { ...profileForm.address, state: e.target.value }
                    })}
                    disabled={!isEditingProfile}
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={profileForm.address?.zipCode || ""}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      address: { ...profileForm.address, zipCode: e.target.value }
                    })}
                    disabled={!isEditingProfile}
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profileForm.address?.country || ""}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      address: { ...profileForm.address, country: e.target.value }
                    })}
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Notification Settings</h2>
              {!isEditingPreferences ? (
                <Button onClick={() => setIsEditingPreferences(true)}>Edit Settings</Button>
              ) : (
                <div className="space-x-2">
                  <Button onClick={handleSavePreferences} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={handleCancelPreferences}>Cancel</Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Manage your in-app notification settings. All notifications will appear on this website.
                </p>
                
                <div className="space-y-4">
                  {/* Master Toggle */}
                  <label className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      checked={preferencesForm.notificationsEnabled ?? true}
                      onChange={(e) => setPreferencesForm({
                        ...preferencesForm,
                        notificationsEnabled: e.target.checked,
                      })}
                      disabled={!isEditingPreferences}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Enable Notifications</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Receive in-app notifications for appointments and promotions
                      </p>
                    </div>
                  </label>

                  {/* Show options only if notifications are enabled */}
                  {preferencesForm.notificationsEnabled && (
                    <div className="ml-8 space-y-4 pl-4 border-l-2 border-gray-200">
                      {/* Appointment Reminders */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Appointment Reminders</h4>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={preferencesForm.appointmentReminders?.dayBefore ?? true}
                              onChange={(e) => setPreferencesForm({
                                ...preferencesForm,
                                appointmentReminders: {
                                  ...preferencesForm.appointmentReminders,
                                  dayBefore: e.target.checked,
                                },
                              })}
                              disabled={!isEditingPreferences}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Remind me 1 day before appointment</span>
                          </label>

                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={preferencesForm.appointmentReminders?.hourBefore ?? true}
                              onChange={(e) => setPreferencesForm({
                                ...preferencesForm,
                                appointmentReminders: {
                                  ...preferencesForm.appointmentReminders,
                                  hourBefore: e.target.checked,
                                },
                              })}
                              disabled={!isEditingPreferences}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Remind me 1 hour before appointment</span>
                          </label>
                        </div>
                      </div>

                      {/* Promotional Notifications */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Promotions & Offers</h4>
                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={preferencesForm.promotionalNotifications ?? false}
                            onChange={(e) => setPreferencesForm({
                              ...preferencesForm,
                              promotionalNotifications: e.target.checked,
                            })}
                            disabled={!isEditingPreferences}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                          />
                          <div>
                            <span className="text-gray-700">Receive deals from salons</span>
                            <p className="text-xs text-gray-500 mt-1">
                              Get notified about discounts and special offers. Each offer is valid only at the salon that sent it.
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Visit History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Appointment History</h2>

            {appointments.history && appointments.history.length > 0 ? (
              <div className="space-y-4">
                {appointments.history.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{appt.salon?.name}</h3>
                          <Badge variant={appt.status === "completed" ? "success" : "default"}>
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
                          {new Date(appt.whenISO).toLocaleDateString()} at{" "}
                          {new Date(appt.whenISO).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        {appt.cancellationReason && (
                          <p className="text-red-600 text-sm mt-2">
                            <span className="font-medium">Cancellation reason:</span> {appt.cancellationReason}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">${appt.service?.price}</p>
                        <p className="text-sm text-gray-500">{appt.paymentStatus}</p>
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

          {appointments.active && appointments.active.length > 0 && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Upcoming Appointments</h2>
              <div className="space-y-4">
                {appointments.active.map((appt) => (
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
                          {new Date(appt.whenISO).toLocaleDateString()} at{" "}
                          {new Date(appt.whenISO).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">${appt.service?.price}</p>
                        <p className="text-sm text-gray-500">{appt.paymentStatus}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Loyalty Points Tab */}
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
      </Tabs>
    </div>
  );
}


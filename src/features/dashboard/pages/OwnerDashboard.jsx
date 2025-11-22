import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../shared/api/client.js";
import { checkSetupStatus, getSalonServices, getSalonEmployees, updateSalon, createService, updateService, deleteService, addBarberToSalon, removeEmployee, searchBarbers, addServiceToBarber, getBarberServices, respondToReview } from "../../salon-reg/api.js";
import { getSalon, getSalonReviews } from "../../booking/api.js";
import { AlertCircle, CheckCircle2, ArrowRight, Edit2, X, Plus, Save, Trash2, Loader2, MessageSquare, Search } from "lucide-react";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { Label } from "../../../shared/ui/label";
import { Textarea } from "../../../shared/ui/textarea";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [salonId, setSalonId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(null);
  const [checkingSetup, setCheckingSetup] = useState(false);
  
  // Editable state
  const [editingSalon, setEditingSalon] = useState(false);
  const [salonUpdates, setSalonUpdates] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [savingSalon, setSavingSalon] = useState(false);
  
  // Services state
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    duration_minutes: "",
    price: "",
    is_active: true,
  });
  const [savingService, setSavingService] = useState(false);
  
  // Employees state
  const [employees, setEmployees] = useState([]);
  const [showEmployeeSearch, setShowEmployeeSearch] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    user_id: "",
    bio: "",
    years_experience: "",
  });
  const [addingEmployee, setAddingEmployee] = useState(false);
  const [selectedBarberForService, setSelectedBarberForService] = useState(null);
  const [barberServices, setBarberServices] = useState({});
  const [pendingServiceSelections, setPendingServiceSelections] = useState({});
  const [savingServices, setSavingServices] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [respondingToReview, setRespondingToReview] = useState(null);
  const [reviewResponse, setReviewResponse] = useState("");

  useEffect(() => {
    loadSalonData();
  }, []);

  const loadSalonData = async () => {
    try {
      setLoading(true);
      setCheckingSetup(true);
      // Don't reset setupComplete immediately - keep previous value until we know the new one
      
      const res = await api("/salons/mine");
      const salonData = res.salon || null;
      
      if (!salonData) {
        setLoading(false);
        setCheckingSetup(false);
        setSalon(null);
        setSalonId(null);
        setSetupComplete(null);
        return;
      }
      
      setSalon(salonData);
      setSalonId(salonData.id);
      setSalonUpdates({
        name: salonData.name || "",
        description: salonData.description || "",
        address: salonData.address || "",
        city: salonData.city || "",
        state: salonData.state || "",
        zip_code: salonData.zip_code || "",
        phone: salonData.phone || "",
        email: salonData.email || "",
      });
      
      // Check setup status if salon is verified
      if (salonData.status === "verified" && salonData.id) {
        try {
          const setupStatus = await checkSetupStatus(salonData.id);
          setSetupComplete(setupStatus.isComplete);
        } catch (err) {
          console.error("Error checking setup status:", err);
          setSetupComplete(false);
        }
        
        // Load full salon details
        await loadFullSalonData(salonData.id);
      } else {
        setSetupComplete(null);
      }
    } catch (err) {
      console.error("Error loading salon:", err);
      // Don't set salon to null on error - keep previous state if available
      // Only set to null if this is the initial load
      if (!salon) {
        setSalon(null);
        setSalonId(null);
        setSetupComplete(null);
      }
    } finally {
      setLoading(false);
      setCheckingSetup(false);
    }
  };

  const loadFullSalonData = async (id) => {
    try {
      // Load salon details
      const salonDetail = await getSalon(id);
      setSalon(salonDetail);
      
      // Load services
      const servicesRes = await getSalonServices(id);
      let servicesList = [];
      if (servicesRes && Array.isArray(servicesRes.services)) {
        servicesList = servicesRes.services;
      } else if (Array.isArray(servicesRes)) {
        servicesList = servicesRes;
      }
      setServices(servicesList.filter(s => s && s.id));
      
      // Load employees
      const employeesRes = await getSalonEmployees(id);
      setEmployees(employeesRes.employees || []);
      
      // Load barber services
      if (employeesRes.employees && employeesRes.employees.length > 0) {
        const barberServicesMap = {};
        await Promise.all(
          employeesRes.employees.map(async (emp) => {
            try {
              const services = await getBarberServices(id, emp.id);
              barberServicesMap[emp.id] = services.services || [];
            } catch {
              barberServicesMap[emp.id] = [];
            }
          })
        );
        setBarberServices(barberServicesMap);
      }
      
      // Load reviews
      const reviewsRes = await getSalonReviews(id);
      // getSalonReviews already returns the array, but handle both formats
      const reviewsList = Array.isArray(reviewsRes) ? reviewsRes : (reviewsRes?.reviews || []);
      setReviews(reviewsList);
    } catch (err) {
      console.error("Error loading full salon data:", err);
      // Don't throw - allow component to render with partial data
    }
  };

  const handleSaveSalon = async () => {
    if (!salonId) return;
    setSavingSalon(true);
    try {
      await updateSalon(salonId, salonUpdates, logoFile);
      await loadSalonData();
      setEditingSalon(false);
      setLogoFile(null);
      alert("Salon updated successfully!");
    } catch (error) {
      alert("Failed to update salon: " + (error.message || "Unknown error"));
    } finally {
      setSavingSalon(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!salonId) return;
    
    const duration = parseInt(newService.duration_minutes);
    if (isNaN(duration) || duration < 15) {
      alert("Duration must be at least 15 minutes");
      return;
    }
    if (duration % 15 !== 0) {
      alert("Duration must be in 15-minute increments");
      return;
    }
    
    setSavingService(true);
    try {
      await createService({
        salon_id: salonId,
        name: newService.name,
        description: newService.description || "",
        duration_minutes: duration,
        price: String(newService.price),
        is_active: newService.is_active,
      });
      setNewService({
        name: "",
        description: "",
        duration_minutes: "",
        price: "",
        is_active: true,
      });
      setShowServiceForm(false);
      await loadFullSalonData(salonId);
    } catch (error) {
      alert("Failed to add service: " + (error.message || "Unknown error"));
    } finally {
      setSavingService(false);
    }
  };

  const handleUpdateService = async (serviceId) => {
    if (!salonId || !editingService) return;
    setSavingService(true);
    try {
      await updateService(serviceId, salonId, editingService);
      setEditingService(null);
      await loadFullSalonData(salonId);
      alert("Service updated successfully!");
    } catch (error) {
      alert("Failed to update service: " + (error.message || "Unknown error"));
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!salonId) return;
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    setSavingService(true);
    try {
      await deleteService(serviceId, salonId);
      await loadFullSalonData(salonId);
      alert("Service deleted successfully!");
    } catch (error) {
      alert("Failed to delete service: " + (error.message || "Unknown error"));
    } finally {
      setSavingService(false);
    }
  };

  const handleSearchBarbers = async (email = null) => {
    const searchTerm = email || searchEmail;
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await searchBarbers(searchTerm);
      setSearchResults(res.providers || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (!showEmployeeSearch) {
      setSearchResults([]);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      if (searchEmail.trim().length >= 2) {
        handleSearchBarbers(searchEmail);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchEmail, showEmployeeSearch]);

  const handleAddEmployee = async (user_id) => {
    if (!salonId) return;
    setAddingEmployee(true);
    try {
      await addBarberToSalon(salonId, {
        user_id,
        bio: newEmployee.bio,
        years_experience: parseInt(newEmployee.years_experience) || 0,
        is_active: true,
      });
      setNewEmployee({ user_id: "", bio: "", years_experience: "" });
      setShowEmployeeSearch(false);
      setSearchEmail("");
      setSearchResults([]);
      await loadFullSalonData(salonId);
    } catch (error) {
      alert("Failed to add employee: " + (error.message || "Unknown error"));
    } finally {
      setAddingEmployee(false);
    }
  };

  const handleRemoveEmployee = async (barberId) => {
    if (!salonId) return;
    if (!confirm("Are you sure you want to remove this employee?")) return;
    
    try {
      await removeEmployee(salonId, barberId);
      await loadFullSalonData(salonId);
      alert("Employee removed successfully!");
    } catch (error) {
      alert("Failed to remove employee: " + (error.message || "Unknown error"));
    }
  };

  const handleToggleServiceSelection = (barberId, serviceId) => {
    setPendingServiceSelections(prev => {
      const current = prev[barberId] || [];
      const isSelected = current.includes(serviceId);
      return {
        ...prev,
        [barberId]: isSelected
          ? current.filter(id => id !== serviceId)
          : [...current, serviceId]
      };
    });
  };

  const handleSaveBarberServices = async (barberId) => {
    if (!salonId) return;
    const selectedServices = pendingServiceSelections[barberId] || [];
    const currentServices = barberServices[barberId] || [];
    const currentServiceIds = currentServices.map(s => s.id);
    
    const toAdd = selectedServices.filter(id => !currentServiceIds.includes(id));
    const toRemove = currentServiceIds.filter(id => !selectedServices.includes(id));
    
    setSavingServices(true);
    try {
      await Promise.all(
        toAdd.map(serviceId => addServiceToBarber(salonId, barberId, serviceId))
      );
      
      if (toRemove.length > 0) {
        await Promise.all(
          toRemove.map(serviceId => 
            api(`/salons/${salonId}/barbers/${barberId}/services/${serviceId}`, {
              method: "DELETE"
            }).catch(err => console.error(`Failed to remove service ${serviceId}:`, err))
          )
        );
      }
      
      const updatedServices = await getBarberServices(salonId, barberId);
      setBarberServices(prev => ({
        ...prev,
        [barberId]: updatedServices.services || []
      }));
      
      setPendingServiceSelections(prev => {
        const updated = { ...prev };
        delete updated[barberId];
        return updated;
      });
      
      setSelectedBarberForService(null);
      await loadFullSalonData(salonId);
    } catch (error) {
      alert("Failed to save service assignments: " + (error.message || "Unknown error"));
    } finally {
      setSavingServices(false);
    }
  };

  const handleRespondToReview = async (reviewId) => {
    if (!reviewResponse.trim()) {
      alert("Please enter a response");
      return;
    }
    
    try {
      await respondToReview(reviewId, reviewResponse);
      setRespondingToReview(null);
      setReviewResponse("");
      // Reload reviews to show the new response immediately
      const reviewsRes = await getSalonReviews(salonId);
      const reviewsList = Array.isArray(reviewsRes) ? reviewsRes : (reviewsRes?.reviews || []);
      setReviews(reviewsList);
      // No alert needed - the response will appear immediately
    } catch (error) {
      alert("Failed to post response: " + (error.message || "Unknown error"));
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600 mb-4" />
          <p className="text-gray-600">Loading salon data...</p>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="p-6 bg-white border rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">No salon on file</h3>
            <p className="text-sm text-gray-600">Submit your first application to unlock the owner tools.</p>
          </div>
          <button
            onClick={() => navigate("/salon-registration")}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Register Salon
          </button>
        </div>
      </div>
    );
  }

  if (salon.status !== "verified") {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="p-6 bg-white border rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{salon.name || "Your salon"}</h3>
            <p className="text-sm text-gray-600">Status: {salon.status || "pending"}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/salon-registration")}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              View / Edit Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Only show setup required if we're not loading and setup is confirmed to be incomplete
  if (!loading && !checkingSetup && setupComplete === false) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-1">Setup Required</h4>
              <p className="text-sm text-amber-800 mb-3">
                Complete your salon setup to unlock the full owner portal.
              </p>
              <button
                onClick={() => navigate("/salon-setup")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Complete Setup
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const heroImage = salon.logo_url || "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80";
  const ratingValue = salon.rating ?? 0;
  const reviewsCount = salon.reviews_count ?? reviews.length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Salon Dashboard</h1>
        <Button onClick={() => navigate("/salon-settings")} variant="outline">
          <Edit2 className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Salon Header - Editable */}
      <div className="bg-white border rounded-2xl p-5">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-semibold">Salon Information</h2>
          {!editingSalon ? (
            <Button onClick={() => setEditingSalon(true)} variant="outline" size="sm">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSaveSalon} disabled={savingSalon} size="sm">
                {savingSalon ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
              <Button onClick={() => { setEditingSalon(false); setLogoFile(null); }} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <img src={heroImage} alt={salon.name} className="rounded-xl w-full h-56 object-cover" />
            {editingSalon && (
              <div className="mt-2">
                <Label>Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                />
              </div>
            )}
          </div>
          <div className="md:col-span-2 space-y-2">
            {editingSalon ? (
              <>
                <div>
                  <Label>Salon Name</Label>
                  <Input
                    value={salonUpdates.name}
                    onChange={(e) => setSalonUpdates({ ...salonUpdates, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={salonUpdates.description}
                    onChange={(e) => setSalonUpdates({ ...salonUpdates, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={salonUpdates.phone}
                      onChange={(e) => setSalonUpdates({ ...salonUpdates, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={salonUpdates.email}
                      onChange={(e) => setSalonUpdates({ ...salonUpdates, email: e.target.value })}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold">{salon.name}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <span>⭐ {ratingValue ? ratingValue.toFixed(1) : "New"}</span>
                  <span>({reviewsCount} reviews)</span>
                </div>
                <div className="text-sm text-gray-600">📍 {salon.address}</div>
                {salon.description && <p className="pt-2 text-gray-700">{salon.description}</p>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Services Section - Editable */}
      <div className="bg-white border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Available Services</h2>
          {!showServiceForm && !editingService && (
            <Button onClick={() => setShowServiceForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          )}
        </div>

        {showServiceForm && (
          <form onSubmit={handleAddService} className="mb-4 p-4 border rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Service Name *</Label>
                <Input
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration (minutes) *</Label>
                <Input
                  type="number"
                  min="15"
                  step="15"
                  value={newService.duration_minutes}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setNewService({ ...newService, duration_minutes: "" });
                    } else {
                      const num = parseInt(val);
                      if (!isNaN(num) && num >= 0) {
                        setNewService({ ...newService, duration_minutes: num });
                      }
                    }
                  }}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={savingService}>
                {savingService ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Service
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                setShowServiceForm(false);
                setNewService({ name: "", description: "", duration_minutes: "", price: "", is_active: true });
              }}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.length === 0 && !showServiceForm && (
            <div className="col-span-2 rounded-xl border bg-gray-50 text-gray-600 p-4 text-sm">
              No services yet. Add your first service above.
            </div>
          )}
          {services.map((svc) => (
            <div key={svc.id} className="flex items-center justify-between rounded-xl border px-4 py-3 bg-white">
              {editingService?.id === svc.id ? (
                <div className="flex-1 space-y-2">
                  <Input
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    placeholder="Service name"
                  />
                  <Textarea
                    value={editingService.description || ""}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    placeholder="Description"
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={editingService.price}
                      onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                      placeholder="Price"
                    />
                    <Input
                      type="number"
                      min="15"
                      step="15"
                      value={editingService.duration_minutes}
                      onChange={(e) => setEditingService({ ...editingService, duration_minutes: parseInt(e.target.value) || 0 })}
                      placeholder="Duration (min)"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdateService(svc.id)} size="sm" disabled={savingService}>
                      Save
                    </Button>
                    <Button onClick={() => setEditingService(null)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="font-medium">{svc.name}</div>
                    {svc.description && <div className="text-sm text-gray-500">{svc.description}</div>}
                    <div className="text-sm text-gray-500">
                      {svc.duration_minutes ? `${svc.duration_minutes} min` : "Duration varies"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-gray-800 font-semibold">
                      {svc.price != null ? `$${Number(svc.price).toFixed(2)}` : "See salon"}
                    </div>
                    <Button
                      onClick={() => setEditingService({ ...svc })}
                      variant="ghost"
                      size="sm"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteService(svc.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Employees Section - Editable */}
      <div className="bg-white border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Meet the Team</h2>
          {!showEmployeeSearch && (
            <Button onClick={() => setShowEmployeeSearch(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          )}
        </div>

        {showEmployeeSearch && (
          <div className="mb-4 p-4 border rounded-lg space-y-4">
            <div>
              <Label>Search by Email</Label>
              <div className="flex gap-2">
                <Input
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Enter barber email..."
                />
                <Button type="button" onClick={() => handleSearchBarbers()} disabled={searching}>
                  {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                <Label>Select a barber:</Label>
                {searchResults.map((barber) => (
                  <div key={barber.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{barber.first_name} {barber.last_name}</div>
                      <div className="text-sm text-gray-500">{barber.email}</div>
                    </div>
                    <Button
                      onClick={() => handleAddEmployee(barber.id)}
                      disabled={addingEmployee}
                      size="sm"
                    >
                      {addingEmployee ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {newEmployee.user_id && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={newEmployee.bio}
                    onChange={(e) => setNewEmployee({ ...newEmployee, bio: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    min="0"
                    value={newEmployee.years_experience}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || (!isNaN(val) && parseInt(val) >= 0)) {
                        setNewEmployee({ ...newEmployee, years_experience: val });
                      }
                    }}
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddEmployee(newEmployee.user_id)}
                    disabled={addingEmployee}
                  >
                    {addingEmployee ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Add Employee
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEmployeeSearch(false);
                      setSearchEmail("");
                      setSearchResults([]);
                      setNewEmployee({ user_id: "", bio: "", years_experience: "" });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEmployeeSearch(false);
                setSearchEmail("");
                setSearchResults([]);
                setNewEmployee({ user_id: "", bio: "", years_experience: "" });
              }}
            >
              Close
            </Button>
          </div>
        )}

        {employees.length === 0 && !showEmployeeSearch ? (
          <p className="text-sm text-gray-600">No employees yet. Add your first employee above.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {employees.map((emp) => (
              <div key={emp.id} className="flex items-center gap-4 rounded-xl border p-4 bg-white">
                <img
                  src={emp.avatar || "https://placehold.co/96x96?text=Staff"}
                  alt={emp.name}
                  className="h-16 w-16 rounded-full object-cover border"
                />
                <div className="flex-1 space-y-1 text-sm text-gray-700">
                  <div className="text-base font-medium text-gray-900">{emp.name}</div>
                  {emp.bio && <div className="text-sm text-gray-500">{emp.bio}</div>}
                  {emp.years_experience != null && (
                    <div>{emp.years_experience} yrs experience</div>
                  )}
                  <div className="capitalize">
                    Status: {emp.is_active ? "Available" : "Inactive"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Services: {barberServices[emp.id]?.length || 0} assigned
                  </div>
                  {selectedBarberForService === emp.id ? (
                    <div className="mt-2 space-y-2">
                      <Label>Assign Services:</Label>
                      {services.filter(s => s && s.id).map((service) => {
                        const currentServices = barberServices[emp.id] || [];
                        const currentServiceIds = currentServices.map(s => s.id);
                        const pendingSelections = pendingServiceSelections[emp.id] || [];
                        const isChecked = pendingSelections.length > 0 
                          ? pendingSelections.includes(service.id)
                          : currentServiceIds.includes(service.id);
                        return (
                          <div key={service.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleServiceSelection(emp.id, service.id)}
                              disabled={savingServices}
                            />
                            <Label>{service.name || "Unnamed Service"}</Label>
                          </div>
                        );
                      })}
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleSaveBarberServices(emp.id)}
                          disabled={savingServices}
                        >
                          {savingServices ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Save Services
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBarberForService(null);
                            setPendingServiceSelections(prev => {
                              const updated = { ...prev };
                              delete updated[emp.id];
                              return updated;
                            });
                          }}
                          disabled={savingServices}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          setSelectedBarberForService(emp.id);
                          try {
                            const currentServicesRes = await getBarberServices(salonId, emp.id);
                            const currentServices = currentServicesRes.services || [];
                            const currentServiceIds = currentServices.map(s => s.id);
                            setBarberServices(prev => ({
                              ...prev,
                              [emp.id]: currentServices
                            }));
                            setPendingServiceSelections(prev => ({
                              ...prev,
                              [emp.id]: [...currentServiceIds]
                            }));
                          } catch (err) {
                            console.error("Error loading barber services:", err);
                            const currentServices = barberServices[emp.id] || [];
                            const currentServiceIds = currentServices.map(s => s.id);
                            setPendingServiceSelections(prev => ({
                              ...prev,
                              [emp.id]: [...currentServiceIds]
                            }));
                          }
                        }}
                      >
                        Assign Services
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveEmployee(emp.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section - With Response */}
      <div className="bg-white border rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4">Guest Reviews</h2>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>No reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{review.user?.name || "Guest"}</div>
                  <div className="text-yellow-500">
                    {"★".repeat(review.stars)}
                    <span className="text-gray-300">{"★".repeat(5 - review.stars)}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-2">{review.text || "No written feedback."}</p>
                {review.response && (
                  <div className="mt-2 p-3 bg-gray-50 rounded border-l-4 border-indigo-500">
                    <div className="text-sm font-medium text-gray-900 mb-1">Owner Response:</div>
                    <div className="text-sm text-gray-700">{review.response.response_text}</div>
                  </div>
                )}
                {!review.response && (
                  <div className="mt-2">
                    {respondingToReview === review.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={reviewResponse}
                          onChange={(e) => setReviewResponse(e.target.value)}
                          placeholder="Write a response..."
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleRespondToReview(review.id)} size="sm">
                            Post Response
                          </Button>
                          <Button
                            onClick={() => {
                              setRespondingToReview(null);
                              setReviewResponse("");
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setRespondingToReview(review.id)}
                        variant="outline"
                        size="sm"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Respond
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

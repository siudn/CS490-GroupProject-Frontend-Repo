import { api } from "../../shared/api/client.js";

export async function submitSalonRegistration(formData) {
  if (import.meta.env.VITE_MOCK === "1") {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { 
      success: true, 
      applicationId: `APP-${Date.now()}`,
      status: 'pending',
      message: 'Application submitted successfully'
    };
  }
  
  return api("/salon/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export async function getSalonRegistrationStatus(ownerId) {
  if (import.meta.env.VITE_MOCK === "1") {
    return MOCK_SALON_REGISTRATIONS[ownerId] || {
      status: 'not_submitted',
      applicationId: null,
      submittedAt: null,
      reviewedAt: null,
      rejectionReason: null
    };
  }
  
  return api(`/salon/registration/status/${ownerId}`);
}

export async function updateSalonRegistration(applicationId, formData) {
  if (import.meta.env.VITE_MOCK === "1") {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { 
      success: true, 
      status: 'pending',
      message: 'Application updated successfully'
    };
  }
  
  return api(`/salon/registration/${applicationId}`, {
    method: "PUT",
    body: JSON.stringify(formData),
  });
}


export async function getSalonApplications(status = 'all') {
  if (import.meta.env.VITE_MOCK === "1") {
    let applications = [...MOCK_SALON_APPLICATIONS];
    if (status !== 'all') {
      applications = applications.filter(app => app.status === status);
    }
    return applications;
  }
  
  const params = status !== 'all' ? `?status=${status}` : '';
  return api(`/admin/salon-applications${params}`);
}

export async function approveSalonApplication(applicationId, adminNotes = '') {
  if (import.meta.env.VITE_MOCK === "1") {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { 
      success: true, 
      message: 'Salon application approved successfully',
      salonId: `salon-${applicationId}`
    };
  }
  
  return api(`/admin/salon-applications/${applicationId}/approve`, {
    method: "POST",
    body: JSON.stringify({ adminNotes }),
  });
}

export async function rejectSalonApplication(applicationId, rejectionReason) {
  if (import.meta.env.VITE_MOCK === "1") {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { 
      success: true, 
      message: 'Salon application rejected successfully'
    };
  }
  
  return api(`/admin/salon-applications/${applicationId}/reject`, {
    method: "POST",
    body: JSON.stringify({ rejectionReason }),
  });
}

export async function getSalonApplicationDetails(applicationId) {
  if (import.meta.env.VITE_MOCK === "1") {
    return MOCK_SALON_APPLICATIONS.find(app => app.id === applicationId) || null;
  }
  
  return api(`/admin/salon-applications/${applicationId}`);
}


export async function getCustomerInsights(salonId, timeRange = '30d') {
  if (import.meta.env.VITE_MOCK === "1") {
    return MOCK_CUSTOMER_INSIGHTS;
  }
  
  return api(`/salon/${salonId}/customer-insights?range=${timeRange}`);
}

export async function getSalonReviews(salonId, limit = 10) {
  if (import.meta.env.VITE_MOCK === "1") {
    return MOCK_SALON_REVIEWS.slice(0, limit);
  }
  
  return api(`/salon/${salonId}/reviews?limit=${limit}`);
}

export async function respondToReview(reviewId, response) {
  if (import.meta.env.VITE_MOCK === "1") {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Response posted successfully' };
  }
  
  return api(`/reviews/${reviewId}/respond`, {
    method: "POST",
    body: JSON.stringify({ response }),
  });
}

export async function sendCustomerOffer(customerId, offer) {
  if (import.meta.env.VITE_MOCK === "1") {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Offer sent successfully' };
  }
  
  return api(`/customers/${customerId}/offers`, {
    method: "POST",
    body: JSON.stringify(offer),
  });
}


export async function getSystemHealth() {
  if (import.meta.env.VITE_MOCK === "1") {
    return MOCK_SYSTEM_HEALTH;
  }
  
  return api("/admin/system/health");
}

export async function getPlatformMetrics(timeRange = '24h') {
  if (import.meta.env.VITE_MOCK === "1") {
    return MOCK_PLATFORM_METRICS;
  }
  
  return api(`/admin/platform/metrics?range=${timeRange}`);
}

export async function getSystemAlerts() {
  if (import.meta.env.VITE_MOCK === "1") {
    return MOCK_SYSTEM_ALERTS;
  }
  
  return api("/admin/system/alerts");
}

export async function getRecentErrors(limit = 10) {
  if (import.meta.env.VITE_MOCK === "1") {
    return MOCK_RECENT_ERRORS;
  }
  
  return api(`/admin/system/errors?limit=${limit}`);
}


export async function getPlatformAnalytics(timeRange = '30d', category = 'all') {
  if (import.meta.env.VITE_MOCK === "1") {
    return MOCK_PLATFORM_ANALYTICS[category] || MOCK_PLATFORM_ANALYTICS.all;
  }
  
  const params = new URLSearchParams({ range: timeRange });
  if (category !== 'all') params.set('category', category);
  
  return api(`/admin/analytics?${params.toString()}`);
}

export async function exportAnalyticsReport(timeRange = '30d', format = 'pdf') {
  if (import.meta.env.VITE_MOCK === "1") {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { 
      success: true, 
      downloadUrl: `/reports/analytics-${timeRange}.${format}`,
      message: 'Report generated successfully'
    };
  }
  
  return api(`/admin/analytics/export?range=${timeRange}&format=${format}`, {
    method: "POST",
  });
}


const MOCK_SALON_REGISTRATIONS = {
  'owner-1': {
    status: 'approved',
    applicationId: 'APP-001',
    submittedAt: '2025-10-01T10:00:00Z',
    reviewedAt: '2025-10-02T14:30:00Z',
    rejectionReason: null
  },
  'owner-2': {
    status: 'pending',
    applicationId: 'APP-002',
    submittedAt: '2025-10-10T09:15:00Z',
    reviewedAt: null,
    rejectionReason: null
  },
  'owner-3': {
    status: 'rejected',
    applicationId: 'APP-003',
    submittedAt: '2025-10-05T16:20:00Z',
    reviewedAt: '2025-10-06T11:45:00Z',
    rejectionReason: 'Invalid business license. Please upload a valid license document.'
  }
};

const MOCK_SALON_APPLICATIONS = [
  {
    id: 'APP-001',
    salonName: 'Luxe Hair Studio',
    ownerId: 'owner-1',
    ownerName: 'Sarah Johnson',
    ownerEmail: 'sarah@luxehair.com',
    address: '456 Oak St, New York, NY 10002',
    phone: '(555) 234-5678',
    description: 'Premium hair salon offering cutting-edge styles',
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400',
    businessLicense: 'license-doc-001.pdf',
    submittedAt: '2025-10-01T10:00:00Z',
    status: 'pending',
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 'APP-002',
    salonName: 'Urban Cuts',
    ownerId: 'owner-2',
    ownerName: 'Mike Chen',
    ownerEmail: 'mike@urbancuts.com',
    address: '789 Elm St, Brooklyn, NY 11201',
    phone: '(555) 345-6789',
    description: 'Modern barbershop for the urban professional',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
    businessLicense: 'license-doc-002.pdf',
    submittedAt: '2025-10-10T09:15:00Z',
    status: 'pending',
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 'APP-003',
    salonName: 'Style & Grace',
    ownerId: 'owner-3',
    ownerName: 'Emma Davis',
    ownerEmail: 'emma@stylegrace.com',
    address: '321 Pine Ave, Queens, NY 11354',
    phone: '(555) 456-7890',
    description: 'Full-service salon specializing in hair and beauty',
    image: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=400',
    businessLicense: 'license-doc-003.pdf',
    submittedAt: '2025-10-05T16:20:00Z',
    status: 'pending',
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 'APP-004',
    salonName: 'Elite Hair Studio',
    ownerId: 'owner-4',
    ownerName: 'John Smith',
    ownerEmail: 'john@elitehair.com',
    address: '123 Main St, New York, NY',
    phone: '(555) 123-4567',
    description: 'Premium hair styling and grooming services',
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400',
    businessLicense: 'license-doc-004.pdf',
    submittedAt: '2025-09-15T14:30:00Z',
    status: 'approved',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: 'APP-005',
    salonName: 'Quick Cuts',
    ownerId: 'owner-5',
    ownerName: 'Lisa Wong',
    ownerEmail: 'lisa@quickcuts.com',
    address: '999 Test St, New York, NY',
    phone: '(555) 999-9999',
    description: 'Fast and affordable haircuts',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
    businessLicense: 'license-doc-005.pdf',
    submittedAt: '2025-10-08T11:00:00Z',
    status: 'rejected',
    rating: 0,
    reviewCount: 0,
    rejectionReason: 'Invalid business license. Please upload a valid license document.',
  },
];

const MOCK_CUSTOMER_INSIGHTS = {
  customers: [
    {
      id: '1',
      name: 'Sarah Johnson',
      visits: 8,
      lastVisit: '2025-10-08',
      totalSpent: 640,
      favoriteService: 'Hair Coloring',
      beforeAfter: [
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200',
        'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=200',
      ],
    },
    {
      id: '2',
      name: 'Mike Chen',
      visits: 12,
      lastVisit: '2025-10-10',
      totalSpent: 540,
      favoriteService: 'Haircut',
      beforeAfter: null,
    },
    {
      id: '3',
      name: 'Emma Davis',
      visits: 5,
      lastVisit: '2025-09-25',
      totalSpent: 375,
      favoriteService: 'Highlights',
      beforeAfter: null,
    },
  ],
  totalCustomers: 1247,
  averageVisits: 3.2,
  averageSpent: 156.50,
  retentionRate: 78
};

const MOCK_SALON_REVIEWS = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing service! The hair coloring turned out exactly as I wanted.',
    date: '2025-10-09',
    responded: true,
    response: 'Thank you Sarah! We\'re so glad you love your new color!',
    responseDate: '2025-10-09T16:30:00Z'
  },
  {
    id: '2',
    customerName: 'Mike Chen',
    rating: 5,
    comment: 'Best haircut in the city. Very professional and friendly staff.',
    date: '2025-10-11',
    responded: false,
  },
  {
    id: '3',
    customerName: 'Lisa Wong',
    rating: 4,
    comment: 'Great experience overall. Would recommend to friends.',
    date: '2025-10-05',
    responded: true,
    response: 'Thank you Lisa! We appreciate your recommendation.',
    responseDate: '2025-10-05T18:15:00Z'
  },
];

const MOCK_SYSTEM_HEALTH = {
  apiResponseTime: '142ms',
  databaseQueries: '98.7%',
  errorRate: '0.3%',
  serverUptime: '99.97%',
  status: 'healthy'
};

const MOCK_PLATFORM_METRICS = {
  requestsPerMinute: 1247,
  successRate: '99.7%',
  peakLoadTime: '2:00 PM - 4:00 PM',
  cpuUsage: 42,
  memoryUsage: 58,
  storageUsage: 67,
  bandwidthUsage: 35
};

const MOCK_SYSTEM_ALERTS = [
  {
    id: '1',
    title: 'High traffic detected',
    message: 'Traffic is 2.5x above normal. Scaling resources automatically.',
    severity: 'info',
    timestamp: '2025-10-11T15:30:00Z'
  }
];

const MOCK_RECENT_ERRORS = [
  {
    id: '1',
    type: 'Payment Gateway',
    message: 'Stripe API timeout - retry successful',
    timestamp: '2025-10-11T10:23:15',
    severity: 'warning',
  },
  {
    id: '2',
    type: 'Database',
    message: 'Slow query detected on appointments table',
    timestamp: '2025-10-11T09:45:32',
    severity: 'info',
  },
  {
    id: '3',
    type: 'Authentication',
    message: 'Multiple failed login attempts from IP 192.168.1.100',
    timestamp: '2025-10-11T08:12:44',
    severity: 'warning',
  },
];

const MOCK_PLATFORM_ANALYTICS = {
  all: {
    totalUsers: 12453,
    dailyActiveUsers: 3247,
    newSignups: 847,
    averageSessionDuration: '8m 42s',
    totalAppointments: 45678,
    completionRate: '94.2%',
    cancellationRate: '5.8%',
    totalRevenue: 1200000,
    averageTransactionValue: 67.50,
    platformFeeRevenue: 84500,
    activeMembers: 8234,
    pointsEarned: 1200000,
    pointsRedeemed: 847000,
    overallRetentionRate: '82%',
    churnRate: '18%',
    averageCustomerLifetime: '8.2 months',
    customerLTV: 542
  },
  engagement: {
    totalUsers: 12453,
    dailyActiveUsers: 3247,
    newSignups: 847,
    averageSessionDuration: '8m 42s',
    topFeatures: [
      { feature: 'Booking', usage: 87 },
      { feature: 'Reviews', usage: 65 },
      { feature: 'Loyalty Program', usage: 54 },
      { feature: 'Shop', usage: 42 },
      { feature: 'Scheduling', usage: 38 },
    ],
    userSegments: {
      customers: 9847,
      salonOwners: 2156,
      barbers: 450
    }
  },
  appointments: {
    totalAppointments: 45678,
    completionRate: '94.2%',
    cancellationRate: '5.8%',
    averageBookingLeadTime: '3.2 days',
    popularServices: [
      { service: 'Haircut', bookings: 18453 },
      { service: 'Hair Coloring', bookings: 12847 },
      { service: 'Beard Trim', bookings: 8932 },
      { service: 'Styling', bookings: 5446 },
    ],
    weekdayWeekendSplit: { weekday: 72, weekend: 28 },
    bookingMethodSplit: { online: 89, walkin: 11 }
  },
  revenue: {
    totalRevenue: 1200000,
    averageTransactionValue: 67.50,
    platformFeeRevenue: 84500,
    topEarningSalon: 'Elite Studio',
    topEarningSalonRevenue: 38450,
    performanceTiers: {
      topPerformers: { percentage: 15, revenue: 540000, revenueShare: 45 },
      midTier: { percentage: 45, revenue: 480000, revenueShare: 40 },
      growing: { percentage: 40, revenue: 180000, revenueShare: 15 }
    }
  },
  loyalty: {
    activeMembers: 8234,
    pointsEarned: 1200000,
    pointsRedeemed: 847000,
    averagePointsPerUser: 146,
    repeatVisitRate: 78,
    averageVisitsPerMember: 4.2,
    revenueFromMembers: 892000,
    popularRewards: [
      { reward: '$5 discount', redeemed: 3245 },
      { reward: '$10 discount', redeemed: 1876 },
      { reward: 'Free product', redeemed: 892 },
      { reward: 'VIP membership', redeemed: 234 },
    ]
  },
  demographics: {
    ageDistribution: [
      { range: '18-24', percent: 22 },
      { range: '25-34', percent: 38 },
      { range: '35-44', percent: 25 },
      { range: '45-54', percent: 12 },
      { range: '55+', percent: 3 },
    ],
    genderSplit: { female: 54, male: 44, other: 2 },
    topLocations: [
      { city: 'New York', users: 3245 },
      { city: 'Los Angeles', users: 2876 },
      { city: 'Chicago', users: 1892 },
      { city: 'Houston', users: 1234 },
      { city: 'Phoenix', users: 987 },
    ]
  },
  retention: {
    overallRetentionRate: '82%',
    churnRate: '18%',
    averageCustomerLifetime: '8.2 months',
    customerLTV: 542,
    cohortAnalysis: [
      { month: 'Jan 2025', m1: 100, m3: 78, m6: 65, m12: 54 },
      { month: 'Dec 2024', m1: 100, m3: 82, m6: 71, m12: 62 },
      { month: 'Nov 2024', m1: 100, m3: 85, m6: 75, m12: 68 },
      { month: 'Oct 2024', m1: 100, m3: 79, m6: 68, m12: 58 },
    ],
    satisfactionMetrics: {
      averageRating: 4.7,
      npsScore: 68,
      recommendationRate: 89
    }
  }
};

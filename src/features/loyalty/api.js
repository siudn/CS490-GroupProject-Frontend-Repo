import { api } from "../../shared/api/client.js";

// Get customer's current points balance and activity
export async function getCustomerPoints() {
  if (import.meta.env.VITE_MOCK === "1") {
    return MOCK_CUSTOMER_POINTS;
  }
  return api("/me/points");
}

// Get available loyalty rewards
export async function getLoyaltyRewards() {
  if (import.meta.env.VITE_MOCK === "1") {
    return MOCK_REWARDS;
  }
  return api("/loyalty/rewards");
}

// Redeem points for a reward
export async function redeemPoints(rewardId) {
  if (import.meta.env.VITE_MOCK === "1") {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: "Reward redeemed successfully",
      newBalance: MOCK_CUSTOMER_POINTS.balance - (MOCK_REWARDS.find((r) => r.id === rewardId)?.pointsRequired || 0),
    };
  }
  return api("/loyalty/redeem", {
    method: "POST",
    body: JSON.stringify({ rewardId }),
  });
}

// Get owner's loyalty program configuration
export async function getLoyaltyConfig() {
  if (import.meta.env.VITE_MOCK === "1") {
    return MOCK_LOYALTY_CONFIG;
  }
  return api("/owner/loyalty/config");
}

// Update owner's loyalty program configuration
export async function updateLoyaltyConfig(config) {
  if (import.meta.env.VITE_MOCK === "1") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      message: "Loyalty program settings updated successfully",
      config: { ...MOCK_LOYALTY_CONFIG, ...config },
    };
  }
  return api("/owner/loyalty/config", {
    method: "POST",
    body: JSON.stringify(config),
  });
}

// Get owner's payment history
export async function getPaymentHistory(startDate = null, endDate = null) {
  if (import.meta.env.VITE_MOCK === "1") {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let payments = [...MOCK_PAYMENTS];
    
    // Filter by date if provided
    if (startDate) {
      payments = payments.filter((p) => p.date >= startDate);
    }
    if (endDate) {
      payments = payments.filter((p) => p.date <= endDate);
    }
    
    return payments;
  }
  
  const params = new URLSearchParams();
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  
  const queryString = params.toString();
  return api(`/owner/payments${queryString ? `?${queryString}` : ""}`);
}

// Mock data
const MOCK_CUSTOMER_POINTS = {
  balance: 250,
  totalEarned: 500,
  totalRedeemed: 250,
  activity: [
    {
      id: 1,
      type: "earned",
      points: 50,
      description: "Appointment completed",
      date: "2025-01-15",
      appointmentId: "A-2001",
    },
    {
      id: 2,
      type: "redeemed",
      points: -100,
      description: "Redeemed $5 discount",
      date: "2025-01-10",
      rewardId: 1,
    },
    {
      id: 3,
      type: "earned",
      points: 75,
      description: "Appointment completed",
      date: "2025-01-05",
      appointmentId: "A-1999",
    },
    {
      id: 4,
      type: "earned",
      points: 45,
      description: "Appointment completed",
      date: "2024-12-28",
      appointmentId: "A-1998",
    },
  ],
};

const MOCK_REWARDS = [
  { id: 1, pointsRequired: 100, discountAmount: 5, discountType: "dollar" },
  { id: 2, pointsRequired: 200, discountAmount: 10, discountType: "dollar" },
  { id: 3, pointsRequired: 300, discountAmount: 15, discountType: "dollar" },
];

const MOCK_LOYALTY_CONFIG = {
  pointsPerDollar: 1,
  rewards: [
    { id: 1, pointsRequired: 100, discountAmount: 5, discountType: "dollar" },
    { id: 2, pointsRequired: 200, discountAmount: 10, discountType: "dollar" },
    { id: 3, pointsRequired: 300, discountAmount: 15, discountType: "dollar" },
  ],
};

const MOCK_PAYMENTS = [
  {
    id: 1,
    date: "2025-01-15",
    customer: "John Smith",
    service: "Haircut",
    amount: 45,
    status: "paid",
    paymentMethod: "card",
  },
  {
    id: 2,
    date: "2025-01-14",
    customer: "Sarah Johnson",
    service: "Hair Coloring",
    amount: 120,
    status: "paid",
    paymentMethod: "card",
  },
  {
    id: 3,
    date: "2025-01-13",
    customer: "Mike Chen",
    service: "Haircut",
    amount: 50,
    status: "paid",
    paymentMethod: "card",
  },
  {
    id: 4,
    date: "2025-01-12",
    customer: "Emma Davis",
    service: "Beard Trim",
    amount: 25,
    status: "paid",
    paymentMethod: "cash",
  },
  {
    id: 5,
    date: "2025-01-11",
    customer: "Alex Rivera",
    service: "Haircut",
    amount: 45,
    status: "unpaid",
    paymentMethod: null,
  },
];


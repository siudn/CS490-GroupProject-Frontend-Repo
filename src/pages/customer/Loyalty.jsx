import { useState } from "react";
import { Button } from "../../shared/ui/button";

export default function Loyalty() {
  // Mock data - will be replaced with API calls in Phase 4
  const [pointsBalance] = useState(250);
  const [rewards] = useState([
    { id: 1, pointsRequired: 100, discountAmount: 5, discountType: "dollar" },
    { id: 2, pointsRequired: 200, discountAmount: 10, discountType: "dollar" },
    { id: 3, pointsRequired: 300, discountAmount: 15, discountType: "dollar" },
  ]);
  const [activity] = useState([
    { id: 1, type: "earned", points: 50, description: "Appointment completed", date: "2025-01-15" },
    { id: 2, type: "redeemed", points: -100, description: "Redeemed $5 discount", date: "2025-01-10" },
    { id: 3, type: "earned", points: 75, description: "Appointment completed", date: "2025-01-05" },
    { id: 4, type: "earned", points: 45, description: "Appointment completed", date: "2024-12-28" },
  ]);

  const handleRedeem = (rewardId) => {
    // Will be implemented in Phase 4
    console.log("Redeem reward:", rewardId);
    alert("Redeem functionality will be available after API integration");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Loyalty Rewards</h1>
        <p className="text-gray-600">Track your loyalty points and redeem rewards</p>
      </div>

      {/* Points Balance Card */}
      <div className="bg-white border rounded-2xl p-5">
        <div className="text-center py-8">
          <div className="text-5xl font-bold text-gray-900 mb-2">{pointsBalance}</div>
          <div className="text-lg text-gray-600">Loyalty Points</div>
          <p className="text-sm text-gray-500 mt-2">Earn points with every visit and redeem for discounts</p>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="bg-white border rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {rewards.map((reward) => {
            const canRedeem = pointsBalance >= reward.pointsRequired;
            return (
              <div
                key={reward.id}
                className={`rounded-xl border p-4 ${
                  canRedeem ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl font-semibold text-gray-900">
                    ${reward.discountAmount} off
                  </div>
                  <div className="text-sm text-gray-600">
                    {reward.pointsRequired} pts
                  </div>
                </div>
                <Button
                  onClick={() => handleRedeem(reward.id)}
                  disabled={!canRedeem}
                  className="w-full rounded-xl"
                  variant={canRedeem ? "default" : "secondary"}
                >
                  {canRedeem ? "Redeem Now" : "Not Enough Points"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {activity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No activity yet</p>
              <p className="text-sm mt-1">Your points history will appear here</p>
            </div>
          ) : (
            activity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border px-4 py-3 bg-white"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.description}</div>
                  <div className="text-sm text-gray-500">{item.date}</div>
                </div>
                <div
                  className={`text-lg font-semibold ${
                    item.type === "earned" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.type === "earned" ? "+" : ""}
                  {item.points} pts
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


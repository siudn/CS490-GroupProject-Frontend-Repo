import { useState, useEffect } from "react";
import { Button } from "../../shared/ui/button";
import { getCustomerPoints, getLoyaltyRewards, redeemPoints } from "../../features/loyalty/api.js";

export default function Loyalty() {
  const [pointsData, setPointsData] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [redeeming, setRedeeming] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [points, rewardsData] = await Promise.all([
          getCustomerPoints(),
          getLoyaltyRewards(),
        ]);
        if (!alive) return;
        setPointsData(points);
        setRewards(rewardsData);
      } catch (err) {
        if (!alive) return;
        setError(err.message || "Failed to load loyalty data");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleRedeem = async (rewardId) => {
    if (redeeming) return;
    
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return;

    if (pointsData.balance < reward.pointsRequired) {
      alert("Not enough points to redeem this reward");
      return;
    }

    if (!confirm(`Redeem ${reward.pointsRequired} points for $${reward.discountAmount} discount?`)) {
      return;
    }

    setRedeeming(rewardId);
    try {
      const result = await redeemPoints(rewardId);
      if (result.success) {
        // Update points balance
        setPointsData((prev) => ({
          ...prev,
          balance: result.newBalance || prev.balance - reward.pointsRequired,
          activity: [
            {
              id: Date.now(),
              type: "redeemed",
              points: -reward.pointsRequired,
              description: `Redeemed $${reward.discountAmount} discount`,
              date: new Date().toISOString().split("T")[0],
              rewardId,
            },
            ...prev.activity,
          ],
        }));
        alert(`Success! You've redeemed ${reward.pointsRequired} points for a $${reward.discountAmount} discount.`);
      }
    } catch (err) {
      alert(err.message || "Failed to redeem reward");
    } finally {
      setRedeeming(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white border rounded-2xl p-8 text-center">
          <div className="text-gray-600">Loading loyalty data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white border rounded-2xl p-8 text-center">
          <div className="text-red-600 mb-2">Error loading loyalty data</div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!pointsData) {
    return null;
  }

  const { balance, activity } = pointsData;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Loyalty Rewards</h1>
        <p className="text-gray-600">Track your loyalty points and redeem rewards</p>
      </div>

      {/* Points Balance Card */}
      <div className="bg-white border rounded-2xl p-5">
        <div className="text-center py-8">
          <div className="text-5xl font-bold text-gray-900 mb-2">{balance}</div>
          <div className="text-lg text-gray-600">Loyalty Points</div>
          <p className="text-sm text-gray-500 mt-2">Earn points with every visit and redeem for discounts</p>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="bg-white border rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {rewards.map((reward) => {
            const canRedeem = balance >= reward.pointsRequired;
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
                  disabled={!canRedeem || redeeming === reward.id}
                  className="w-full rounded-xl"
                  variant={canRedeem ? "default" : "secondary"}
                >
                  {redeeming === reward.id
                    ? "Redeeming..."
                    : canRedeem
                    ? "Redeem Now"
                    : "Not Enough Points"}
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


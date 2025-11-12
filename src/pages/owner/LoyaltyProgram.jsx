import { useState, useEffect } from "react";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { getLoyaltyConfig, updateLoyaltyConfig } from "../../features/loyalty/api.js";

export default function LoyaltyProgram() {
  const [pointsPerDollar, setPointsPerDollar] = useState(1);
  const [rewards, setRewards] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePointsPerDollarChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setPointsPerDollar(value);
    }
  };

  const handleRewardChange = (id, field, value) => {
    setRewards(
      rewards.map((reward) =>
        reward.id === id
          ? { ...reward, [field]: field === "pointsRequired" || field === "discountAmount" ? parseInt(value) || 0 : value }
          : reward
      )
    );
  };

  const handleAddReward = () => {
    const newId = Math.max(...rewards.map((r) => r.id), 0) + 1;
    setRewards([
      ...rewards,
      { id: newId, pointsRequired: 100, discountAmount: 5, discountType: "dollar" },
    ]);
  };

  const handleRemoveReward = (id) => {
    if (rewards.length > 1) {
      setRewards(rewards.filter((reward) => reward.id !== id));
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const config = await getLoyaltyConfig();
        if (!alive) return;
        setPointsPerDollar(config.pointsPerDollar || 1);
        setRewards(config.rewards || []);
      } catch (err) {
        if (!alive) return;
        setError(err.message || "Failed to load loyalty configuration");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleSave = async () => {
    if (rewards.length === 0) {
      alert("Please add at least one reward tier");
      return;
    }

    // Validate rewards
    for (const reward of rewards) {
      if (reward.pointsRequired <= 0 || reward.discountAmount <= 0) {
        alert("All reward tiers must have valid points and discount amounts");
        return;
      }
    }

    setIsSaving(true);
    setError("");
    setSuccessMessage("");
    try {
      const result = await updateLoyaltyConfig({
        pointsPerDollar,
        rewards,
      });
      if (result.success) {
        setSuccessMessage(result.message || "Settings saved successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      setError(err.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white border rounded-2xl p-8 text-center">
          <div className="text-gray-600">Loading loyalty configuration...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Loyalty Program Settings</h1>
        <p className="text-gray-600">Configure how customers earn and redeem loyalty points</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-sm">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Points Earning Configuration */}
      <div className="bg-white border rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Points Earning Rate</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points per dollar spent
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="0"
                value={pointsPerDollar}
                onChange={handlePointsPerDollarChange}
                className="w-32"
              />
              <span className="text-gray-600">point{pointsPerDollar !== 1 ? "s" : ""} per $1</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Customers will earn {pointsPerDollar} point{pointsPerDollar !== 1 ? "s" : ""} for every dollar spent
            </p>
          </div>
        </div>
      </div>

      {/* Reward Tiers Configuration */}
      <div className="bg-white border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Reward Tiers</h2>
          <Button onClick={handleAddReward} variant="outline" size="sm">
            + Add Reward
          </Button>
        </div>
        <div className="space-y-4">
          {rewards.map((reward, index) => (
            <div
              key={reward.id}
              className="rounded-xl border p-4 bg-white"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">Reward {index + 1}</span>
                {rewards.length > 1 && (
                  <Button
                    onClick={() => handleRemoveReward(reward.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points Required
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={reward.pointsRequired}
                    onChange={(e) => handleRewardChange(reward.id, "pointsRequired", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Amount ($)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={reward.discountAmount}
                    onChange={(e) => handleRewardChange(reward.id, "discountAmount", e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{reward.pointsRequired} points</span> ={" "}
                  <span className="font-medium">${reward.discountAmount} discount</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl px-8"
          size="lg"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}


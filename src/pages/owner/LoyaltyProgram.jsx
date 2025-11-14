import { useState, useEffect } from "react";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { getLoyaltyConfig, updateLoyaltyConfig } from "../../features/loyalty/api.js";

export default function LoyaltyProgram() {
  const [pointsPerDollar, setPointsPerDollar] = useState(1);
  const [pointThreshold, setPointThreshold] = useState(100);
  const [rewardDiscount, setRewardDiscount] = useState(10);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePointsPerDollarChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value >= 0) {
      setPointsPerDollar(value);
    }
  };

  const handlePointThresholdChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setPointThreshold(value);
    }
  };

  const handleRewardDiscountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= 100) {
      setRewardDiscount(value);
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
        setPointThreshold(config.pointThreshold || config.minPointsForRedemption || 100);
        setRewardDiscount(config.rewardDiscount || 10);
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
    // Validate inputs
    if (pointsPerDollar < 0) {
      alert("Points per dollar must be 0 or greater");
      return;
    }
    if (pointThreshold <= 0) {
      alert("Point threshold must be greater than 0");
      return;
    }
    if (rewardDiscount < 0 || rewardDiscount > 100) {
      alert("Reward discount must be between 0 and 100");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccessMessage("");
    try {
      const result = await updateLoyaltyConfig({
        pointsPerDollar,
        pointThreshold,
        rewardDiscount,
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
                step="0.1"
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

      {/* Reward Configuration */}
      <div className="bg-white border rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reward Settings</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Point Threshold
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="1"
                value={pointThreshold}
                onChange={handlePointThresholdChange}
                className="w-32"
              />
              <span className="text-gray-600">points required to redeem</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Customers need {pointThreshold} points to redeem a reward
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reward Discount (%)
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="0"
                max="100"
                value={rewardDiscount}
                onChange={handleRewardDiscountChange}
                className="w-32"
              />
              <span className="text-gray-600">% discount</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Customers will receive a {rewardDiscount}% discount when they redeem {pointThreshold} points
            </p>
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <p className="text-sm font-medium text-indigo-900 mb-2">Reward Preview:</p>
            <p className="text-sm text-indigo-700">
              When customers reach <span className="font-semibold">{pointThreshold} points</span>, they can redeem for a{" "}
              <span className="font-semibold">{rewardDiscount}% discount</span> on their next purchase.
            </p>
          </div>
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


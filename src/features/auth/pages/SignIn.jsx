import { useEffect, useState } from "react";
import { useAuth } from "../auth-provider.jsx";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    const roleRedirects = {
      customer: "/browse",
      owner: "/salon-dashboard",
      salon_owner: "/salon-dashboard",
      barber: "/schedule",
      admin: "/admin/dashboard",
    };
    const destination = roleRedirects[user.role] || "/browse";
    navigate(destination, { replace: true });
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const userData = await login(formData.email, formData.password);
      setSuccessMessage("Login successful! Redirecting...");

      // Role-based redirect
      const redirectPaths = {
        customer: "/browse",
        owner: "/salon-dashboard",
        salon_owner: "/salon-dashboard",
        barber: "/schedule",
        admin: "/admin/dashboard",
      };

      setTimeout(() => {
        navigate(redirectPaths[userData.role] || "/browse", { replace: true });
      }, 500);
    } catch (error) {
      setErrors({ submit: error.message || "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const demo = async (role) => {
    setIsLoading(true);
    try {
      const userData = await login("demo@x.com", "", role);
      setSuccessMessage(`Logged in as ${role}! Redirecting...`);
      
      // Role-based redirect
      const redirectPaths = {
        customer: "/browse",
        owner: "/salon-dashboard",
        salon_owner: "/salon-dashboard",
        barber: "/schedule",
        admin: "/admin/dashboard",
      };

      setTimeout(() => {
        navigate(redirectPaths[userData.role] || "/browse");
      }, 1000);
    } catch (error) {
      setErrors({ submit: "Demo login failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Salonica</h1>
            <p className="text-sm text-gray-600">Manage your salon appointments and loyalty rewards</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
            <button
              className="flex-1 py-2 px-4 text-sm font-medium text-white bg-gray-600 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth/sign-up")}
              className="flex-1 py-2 px-4 text-sm font-medium text-gray-600 rounded-lg transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/auth/forgot-password")}
              className="flex-1 py-2 px-4 text-sm font-medium text-gray-600 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="rounded-xl bg-green-50 p-4 border border-green-200">
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/auth/forgot-password")}
                className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          </form>

          {/* Demo Login Section */}
          {import.meta.env.VITE_AUTH_MODE === "stub" && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Login</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => demo("customer")}
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Demo Customer
                </button>
                <button
                  onClick={() => demo("owner")}
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Demo Owner
                </button>
                <button
                  onClick={() => demo("barber")}
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Demo Barber
                </button>
                <button
                  onClick={() => demo("admin")}
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Demo Admin
                </button>
              </div>
              
              <p className="mt-2 text-center text-xs text-gray-500">
                Or add <code>?demo=customer</code> to the URL for quick access.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

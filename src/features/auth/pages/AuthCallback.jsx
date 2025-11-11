import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth-provider";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing your request...");

  useEffect(() => {
    const handleCallback = async () => {
      // Get the token and type from URL
      const token = searchParams.get("token");
      const type = searchParams.get("type");
      const accessToken = searchParams.get("access_token");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      // Handle errors from Supabase
      if (error) {
        setStatus("error");
        setMessage(errorDescription || "An error occurred. Please try again.");
        setTimeout(() => navigate("/auth/sign-in"), 3000);
        return;
      }

      // Handle email confirmation
      if (type === "signup" || type === "email" || accessToken) {
        setStatus("success");
        setMessage("Email confirmed! Redirecting to sign in...");
        
        // Wait a moment then redirect to sign in
        setTimeout(() => {
          navigate("/auth/sign-in", { 
            state: { message: "Email confirmed! You can now sign in." }
          });
        }, 2000);
        return;
      }

      // Handle password recovery
      if (type === "recovery" && token) {
        setStatus("success");
        setMessage("Redirecting to reset password...");
        
        // Redirect to reset password page with token
        setTimeout(() => {
          navigate(`/auth/reset-password?token=${token}`);
        }, 1500);
        return;
      }

      // If user is already logged in, redirect to their dashboard
      if (user) {
        const roleRedirects = {
          customer: "/customer/browse",
          owner: "/owner/dashboard",
          salon_owner: "/owner/dashboard",
          barber: "/barber/schedule",
          admin: "/admin/dashboard",
        };
        navigate(roleRedirects[user.role] || "/");
        return;
      }

      // Default: redirect to sign in
      setStatus("success");
      setMessage("Redirecting...");
      setTimeout(() => navigate("/auth/sign-in"), 2000);
    };

    handleCallback();
  }, [searchParams, navigate, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-pink-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          {/* Logo/Brand */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Salonica</h1>

          {/* Status Icon */}
          <div className="mb-6">
            {status === "processing" && (
              <div className="w-16 h-16 mx-auto">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
              </div>
            )}
            
            {status === "success" && (
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {status === "error" && (
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Message */}
          <h2 className={`text-xl font-semibold mb-2 ${
            status === "error" ? "text-red-600" : "text-gray-900"
          }`}>
            {status === "processing" && "Processing..."}
            {status === "success" && "Success!"}
            {status === "error" && "Oops!"}
          </h2>
          
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}


import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "../../features/auth/auth-provider.jsx";

export default function RootLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const onAuth = pathname.startsWith("/auth/");
  return (
    <div className="min-h-screen flex flex-col">
      {!onAuth && user ? <Header /> : null}
      <main className="flex-1 p-6">
        <Suspense fallback={<div className="text-gray-500">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

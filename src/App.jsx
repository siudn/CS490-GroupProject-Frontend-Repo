import React from "react";
import SalonVerification from "./components/admin/SalonVerification";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-purple-600 text-white py-5 shadow-md">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Salon Registration Portal</h1>
          <nav className="space-x-6 text-sm font-medium">
            <a href="#" className="hover:underline">
              Dashboard
            </a>
            <a href="#" className="hover:underline">
              Verification
            </a>
            <a href="#" className="hover:underline">
              Reports
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <SalonVerification />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-4 text-sm">
        © 2025 Salonica. All rights reserved.
      </footer>
    </div>
  );
}

export default App;

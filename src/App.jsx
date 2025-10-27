import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Browse from "./pages/Browse.jsx";
import Booking from "./pages/Booking.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useEffect, useState } from "react";
import { consumeFlash } from "./lib/flash.js";
import FlashBanner from "./components/FlashBanner.jsx";

export default function App() {
  const [flash, setFlash] = useState({ message: "", type: "success" });
  useEffect(() => setFlash(consumeFlash()), []);
  return (
    <>
      <Header />
      <main className="main">
        {flash.message && <FlashBanner message={flash.message} type={flash.type} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </>
  );
}

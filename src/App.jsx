import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Browse from "./pages/Browse.jsx";
import Booking from "./pages/Booking.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </main>
    </>
  );
}

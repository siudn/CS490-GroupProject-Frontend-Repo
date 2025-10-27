import { useEffect, useState } from "react";
import { getSession } from "../lib/session.js";

export default function Dashboard() {
  const [session, setSession] = useState({ token: null, user: null });
  useEffect(() => setSession(getSession()), []);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back{session?.user?.email ? `, ${session.user.email}` : ''}.</p>
    </div>
  );
}



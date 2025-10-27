import { useAuth } from "../auth-provider.jsx";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const { login } = useAuth();
  const nav = useNavigate();

  const demo = async (role) => {
    await login("demo@x.com", "", role);
    nav("/booking");
  };

  return (
    <section className="space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <p className="text-gray-600">
        Stub page. Use demo buttons to simulate auth.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          className="px-3 py-2 rounded bg-indigo-600 text-white"
          onClick={() => demo("customer")}
        >
          Demo Customer
        </button>
        <button
          className="px-3 py-2 rounded bg-gray-800 text-white"
          onClick={() => demo("owner")}
        >
          Demo Owner
        </button>
        <button
          className="px-3 py-2 rounded bg-gray-700 text-white"
          onClick={() => demo("barber")}
        >
          Demo Barber
        </button>
        <button
          className="px-3 py-2 rounded bg-gray-900 text-white"
          onClick={() => demo("admin")}
        >
          Demo Admin
        </button>
      </div>
      <p className="text-sm text-gray-500">
        Or add <code>?demo=customer</code> to the URL.
      </p>
    </section>
  );
}

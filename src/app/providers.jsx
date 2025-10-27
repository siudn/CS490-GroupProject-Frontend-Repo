import { AuthProvider } from "../features/auth/auth-provider.jsx";
export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

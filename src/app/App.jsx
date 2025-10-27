import { BrowserRouter, useRoutes } from "react-router-dom";
import routes from "./routes";
import RootLayout from "./layout/RootLayout";
import Providers from "./providers";

function AppRoutes() { return useRoutes([{ element: <RootLayout />, children: routes }]); }
export default function App() {
  return (
    <Providers>
      <BrowserRouter><AppRoutes /></BrowserRouter>
    </Providers>
  );
}

import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="min-w-svw bg-background min-h-svh">
      <Outlet />

      <Toaster richColors theme="light" />
    </div>
  );
}

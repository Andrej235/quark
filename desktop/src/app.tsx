import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import sendApiRequest from "./api-dsl/send-api-request";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const isWaiting = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isWaiting.current) return;
    isWaiting.current = true;

    sendApiRequest("/user/check", {
      method: "get",
    }).then(({ isOk }) => {
      setIsLoading(false);

      if (!isOk) {
        navigate("/login");
        return;
      }

      // isWaiting.current = false;
    });
  }, [navigate]);

  return (
    <div className="min-w-svw bg-background min-h-svh">
      {!isLoading && <Outlet />}

      {isLoading && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      )}

      <Toaster richColors theme="light" />
    </div>
  );
}

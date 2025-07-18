import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import sendApiRequest from "./api-dsl/send-api-request";
import { Toaster } from "./components/ui/sonner";
import { useUserStore } from "./stores/user-store";
import { toast } from "sonner";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isWaiting = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isWaiting.current) return;
    isWaiting.current = true;

    sendApiRequest("/user/check", {
      method: "get",
    }).then(({ isOk }) => {
      setIsLoading(false);
      setIsLoggedIn(isOk);

      if (!isOk) {
        navigate("/login");
        return;
      }

      // isWaiting.current = false;
    });
  }, [navigate]);

  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => sendApiRequest("/user/me", { method: "get" }),
    enabled: !isLoading && isLoggedIn,
  });

  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    if (!user.data) return;

    if (user.isError || !user.data.isOk) {
      toast.error(user.data.error?.message ?? "Something went wrong");
      return;
    }

    setUser(user.data.response);
  }, [user, navigate, setUser]);

  return (
    <div className="min-w-svw bg-background min-h-svh">
      {!isLoading && (!isLoggedIn || !user.isLoading) && <Outlet />}

      {(isLoading || user.isLoading) && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      )}

      <Toaster richColors theme="light" />
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import sendApiRequest from "./api-dsl/send-api-request";
import { Toaster } from "./components/ui/sonner";
import { useUserStore } from "./stores/user-store";

export default function App() {
  const navigate = useNavigate();

  const isLoggedIn = useQuery({
    queryKey: ["isLoggedIn"],
    queryFn: () => sendApiRequest("/user/check", { method: "get" }),
  });

  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => sendApiRequest("/user/me", { method: "get" }),
    enabled: !isLoggedIn.isLoading && isLoggedIn.data?.isOk,
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
      {!isLoggedIn.isLoading && (!isLoggedIn.data?.isOk || !user.isLoading) && (
        <Outlet />
      )}

      {(isLoggedIn.isLoading || user.isLoading) && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      )}

      <Toaster richColors theme="light" />
    </div>
  );
}

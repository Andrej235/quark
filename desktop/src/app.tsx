import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useQuery from "./api-dsl/use-query";
import { useQuery as useTanQuery } from "@tanstack/react-query";
import LoadingIndicator from "./components/loading-indicator";
import { Toaster } from "./components/ui/sonner";
import { useUserStore } from "./stores/user-store";
import useAuthStore from "./stores/auth-store";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const getIsLoggedIn = useAuthStore((x) => x.getIsLoggedIn);

  const isLoggedIn = useTanQuery({
    queryKey: ["isLoggedIn"],
    queryFn: getIsLoggedIn,
    retry: false,
  });

  const user = useQuery("/user/me", {
    queryKey: ["user"],
    enabled: !!isLoggedIn.data,
    retry: false,
  });

  useEffect(() => {
    if (isLoggedIn.isLoading) return;

    if (location !== "/login" && location !== "/signup" && !isLoggedIn.data)
      navigate("/login");
  }, [isLoggedIn.data, isLoggedIn.isLoading, navigate, location]);

  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    if (!user.data || !isLoggedIn.data) return;

    if (user.error) {
      toast.error(user.error.message ?? "Something went wrong < app");
      return;
    }

    setUser(user.data);

    if (!user.data.isEmailVerified) {
      navigate("/verify-email");
      return;
    }

    if (
      !user.data?.teamsInfo?.length &&
      location !== "/first-team" &&
      location !== "/payment" &&
      location !== "/new-team"
    ) {
      navigate("/first-team");
    }
  }, [isLoggedIn.data, user.data, user.error, navigate, setUser, location]);

  return (
    <div className="min-w-svw bg-background max-w-svw max-h-svh min-h-svh overflow-x-clip">
      {!isLoggedIn.isLoading && (!isLoggedIn.data || !user.isLoading) && (
        <Outlet />
      )}

      {(isLoggedIn.isLoading || user.isLoading) && (
        <div className="bg-background fixed inset-0 z-50 grid place-items-center">
          <LoadingIndicator className="size-8" />
        </div>
      )}

      <Toaster richColors theme="light" />
    </div>
  );
}
Math.random();

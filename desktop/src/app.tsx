import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useQuery from "./api-dsl/use-query";
import LoadingIndicator from "./components/loading-indicator";
import { Toaster } from "./components/ui/sonner";
import { useUserStore } from "./stores/user-store";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const isLoggedIn = useQuery("/user/check", {
    queryKey: ["isLoggedIn"],
    retry: false,
  });

  const user = useQuery("/user/me", {
    queryKey: ["user"],
    enabled: isLoggedIn.isSuccess,
    retry: false,
  });

  useEffect(() => {
    if (isLoggedIn.isLoading) return;

    if (
      location !== "/login" &&
      location !== "/signup" &&
      !isLoggedIn.isSuccess
    )
      navigate("/login");
  }, [isLoggedIn.isSuccess, isLoggedIn.isLoading, navigate, location]);

  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    if (!user.data || !isLoggedIn.isSuccess) return;

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
      !user.data?.teamsName?.length &&
      location !== "/first-team" &&
      location !== "/payment" &&
      location !== "/new-team"
    ) {
      navigate("/first-team");
    }
  }, [
    isLoggedIn.isSuccess,
    user.data,
    user.error,
    navigate,
    setUser,
    location,
  ]);

  return (
    <div className="min-w-svw bg-background max-w-svw max-h-svh min-h-svh">
      {!isLoggedIn.isLoading && (!isLoggedIn.isSuccess || !user.isLoading) && (
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

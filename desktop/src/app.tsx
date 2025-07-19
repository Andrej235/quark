import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useQuery from "./api-dsl/use-query";
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
    enabled: !isLoggedIn.isLoading && isLoggedIn.isSuccess,
  });

  useEffect(() => {
    if (isLoggedIn.isLoading) return;

    if (
      (location === "/login" || location === "/signup") &&
      isLoggedIn.isSuccess
    )
      navigate("/");

    if (
      location !== "/login" &&
      location !== "/signup" &&
      !isLoggedIn.isSuccess
    )
      navigate("/login");
  }, [isLoggedIn.isSuccess, isLoggedIn.isLoading, navigate, location]);

  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    if (!user.data) return;

    if (user.error) {
      toast.error((user.error as Error).message ?? "Something went wrong");
      return;
    }

    setUser(user.data);

    if (!user.data.isEmailVerified) {
      navigate("/verify-email");
      return;
    }

    if (!user.data?.teamsName?.length) {
      navigate("/first-team");
    }
  }, [user.data, user.error, navigate, setUser]);

  return (
    <div className="min-w-svw bg-background min-h-svh">
      {!isLoggedIn.isLoading && (!isLoggedIn.isSuccess || !user.isLoading) && (
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

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
  const locationState = useLocation().state;
  const getIsLoggedIn = useAuthStore((x) => x.getIsLoggedIn);

  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((x) => x.user);

  const isLoggedIn = useTanQuery({
    queryKey: ["isLoggedIn"],
    queryFn: getIsLoggedIn,
    retry: false,
  });

  const userQuery = useQuery("/user/me", {
    queryKey: ["user"],
    enabled: !!isLoggedIn.data,
    retry: false,
  });

  useEffect(() => {
    if (isLoggedIn.isLoading) return;

    if (location !== "/login" && location !== "/signup" && !isLoggedIn.data)
      navigate("/login");
  }, [isLoggedIn.data, isLoggedIn.isLoading, navigate, location]);

  useEffect(() => {
    if (!userQuery.data || !isLoggedIn.data) return;

    if (userQuery.error) {
      toast.error(userQuery.error.message ?? "Something went wrong");
      return;
    }

    const sameUser = user?.username === userQuery.data.username;

    const cameFromVerifyPage =
      locationState &&
      "isEmailVerified" in locationState &&
      locationState.isEmailVerified;

    const verifiedEmail =
      (sameUser && user?.isEmailVerified) ||
      userQuery.data.isEmailVerified ||
      cameFromVerifyPage;

    const hasTeams =
      (user && sameUser && user.teamsInfo.length > 0) ||
      (!sameUser && userQuery.data.teamsInfo.length > 0);

    if (cameFromVerifyPage && user && sameUser && !user.isEmailVerified) {
      setUser({ ...user, isEmailVerified: true });
    }

    if (!user || !sameUser) {
      setUser(userQuery.data);
    }

    if (!verifiedEmail) {
      navigate("/verify-email");
      return;
    }

    if (verifiedEmail && location === "/verify-email") {
      navigate(hasTeams ? "/" : "/first-team");
      return;
    }

    if (
      !hasTeams &&
      !["/first-team", "/new-team", "/payment"].includes(location)
    ) {
      navigate("/first-team");
      return;
    }

    if (hasTeams && location === "/first-team") {
      navigate("/");
      return;
    }
  }, [
    isLoggedIn.data,
    userQuery.data,
    userQuery.error,
    navigate,
    user,
    setUser,
    location,
    locationState,
  ]);

  useEffect(() => {
    setUser(userQuery.data ?? null);
  }, [userQuery.data, setUser]);

  return (
    <div className="min-w-svw bg-background max-w-svw max-h-svh min-h-svh overflow-x-clip">
      {!isLoggedIn.isLoading && (!isLoggedIn.data || !userQuery.isLoading) && (
        <Outlet />
      )}

      {(isLoggedIn.isLoading || userQuery.isLoading) && (
        <div className="bg-background fixed inset-0 z-50 grid place-items-center">
          <LoadingIndicator className="size-8" />
        </div>
      )}

      <Toaster richColors theme="light" />
    </div>
  );
}
Math.random();

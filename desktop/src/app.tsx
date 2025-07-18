import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useQuery from "./api-dsl/use-query";
import { Toaster } from "./components/ui/sonner";
import { useUserStore } from "./stores/user-store";

export default function App() {
  const navigate = useNavigate();

  const isLoggedIn = useQuery("/user/check", {
    queryKey: ["isLoggedIn"],
  });

  const user = useQuery("/user/me", {
    queryKey: ["user"],
    enabled: !isLoggedIn.isLoading && isLoggedIn.isSuccess,
  });

  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    if (!user.data) return;

    if (user.isError || !user.isSuccess) {
      toast.error((user.error as Error).message ?? "Something went wrong");
      return;
    }

    setUser(user.data);
  }, [user, navigate, setUser]);

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

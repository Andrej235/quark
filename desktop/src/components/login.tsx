import sendApiRequest from "@/api-dsl/send-api-request";
import useAuthStore from "@/stores/auth-store";
import { CircleAlert } from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useQueryClient } from "@tanstack/react-query";

type Errors = {
  email?: string;
  password?: string;
};

type Touched = {
  email?: boolean;
  password?: boolean;
};

export default function Login() {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [isValid, setIsValid] = useState<boolean>(false);
  const navigate = useNavigate();
  const setJwt = useAuthStore((x) => x.setJwt);
  const setRefreshToken = useAuthStore((x) => x.setRefreshToken);

  const validateForm = useCallback(() => {
    const newErrors: Errors = {};

    if (!fields.email.trim()) newErrors.email = "Please enter an email address";
    else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(fields.email)
    )
      newErrors.email = "Please enter a valid email address";

    if (!fields.password.trim()) newErrors.password = "Please enter a password";

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [fields]);

  useEffect(() => {
    validateForm();
  }, [fields, validateForm]);

  const handleChange =
    (field: keyof typeof fields) => (e: ChangeEvent<HTMLInputElement>) => {
      setFields((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleBlur = (field: keyof typeof fields) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const queryClient = useQueryClient();

  const handleSubmit = async (e: MouseEvent | FormEvent) => {
    e.preventDefault();
    setTouched({
      email: true,
      password: true,
    });
    validateForm();

    if (Object.keys(errors).length > 0) return;

    const { error, response } = await sendApiRequest(
      "/user/login",
      {
        method: "post",
        payload: {
          email: fields.email.trim(),
          password: fields.password.trim(),
        },
      },
      {
        showToast: true,
        toastOptions: {
          success: "Successfully logged in. Welcome back!",
        },
      },
    );

    if (error || !response) return;

    await setJwt(response.jwtToken);
    await setRefreshToken(response.refreshTokenId);

    // Force revalidation, without this app.tsx would just redirect the user back here after logging in
    await queryClient.invalidateQueries({
      queryKey: ["isLoggedIn"],
      exact: true,
    });
    await queryClient.invalidateQueries({
      queryKey: ["user"],
      exact: true,
    });

    await navigate("/");
  };

  return (
    <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center">
      <div className="bg-background z-10 flex h-fit w-full flex-col items-center justify-center gap-20 p-10">
        <div className="bg-secondary h-xl w-md shadow-muted border-muted rounded-xl border-2 shadow-lg">
          <form
            className="p-15 flex h-full flex-col items-center justify-center gap-4"
            onSubmit={handleSubmit}
          >
            <h1 className="text-foreground mb-1 text-3xl">Welcome to Quark!</h1>
            <p className="mb-5">Ready for a new day?</p>

            <div className="flex w-full flex-col gap-2">
              <h6 className="text-sm">Email</h6>
              <Input
                type="text"
                className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                value={fields.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
              />
              {touched.email && errors.email && (
                <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                  <CircleAlert /> {errors.email}
                </p>
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <h6 className="text-sm">Password</h6>
              <Input
                type="password"
                className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                value={fields.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
              />
              {touched.password && errors.password && (
                <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                  <CircleAlert /> {errors.password}
                </p>
              )}
            </div>

            <Link
              to="/forgot-password"
              className="text-foreground ml-auto mt-2 text-xs"
            >
              Forgot password?
            </Link>
            <Button
              type="submit"
              className="bg-input hover:bg-primary-dark h-12 w-full cursor-pointer rounded-2xl p-2 text-white transition-colors"
              onClick={handleSubmit}
              disabled={!isValid}
              asChild
            >
              <Link to={"/home"}>Log in</Link>
            </Button>
            <Button
              type="submit"
              className="bg-input hover:bg-primary-dark h-12 w-full cursor-pointer rounded-2xl p-2 text-white transition-colors"
              asChild
            >
              <Link
                to={"/auth/google"}
                className="flex items-center justify-center gap-2"
              >
                <img
                  className="h-5 w-5"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google logo"
                />
                <span className="font-medium text-white">
                  Login with Google
                </span>
              </Link>
            </Button>

            <div className="ml-auto mt-5 flex w-full flex-row items-center justify-center gap-3">
              <p className="text-primary text-xs">
                Don&apos;t have an account?
              </p>
              <Link
                type="button"
                className="bg-secondary text-foreground text-xs"
                to="/signup"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

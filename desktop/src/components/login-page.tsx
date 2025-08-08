import sendApiRequest from "@/api-dsl/send-api-request";
import useAuthStore from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";
import {
  ChangeEvent,
  KeyboardEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Errors = {
  email?: string;
  password?: string;
};

type Touched = {
  email?: boolean;
  password?: boolean;
};

export default function LoginPage() {
  const queryClient = useQueryClient();

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

  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = useCallback(() => {
    const newErrors: Errors = {};

    if (!fields.email.trim()) newErrors.email = "Please enter an email address";
    else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(fields.email)
    )
      newErrors.email = "Please enter a valid email address";

    if (!fields.password.trim()) newErrors.password = "Please enter a password";
    else if (fields.password.trim().length < 8)
      newErrors.password = "Password must be at least 8 characters long";

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    const inputs = formRef.current?.querySelectorAll("input");
    if (!inputs) return;

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];

      if (input === e.target) {
        if (i < inputs.length - 1) inputs[i + 1].focus();
        else handleSubmit(e);

        break;
      }
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setTouched({
      email: true,
      password: true,
    });
    validateForm();

    if (Object.keys(errors).length > 0) return;

    const { error, response } = await sendApiRequest(
      "/users/login",
      {
        method: "post",
        payload: {
          usernameOrEmail: fields.email.trim(),
          password: fields.password.trim(),
          useCookies: false,
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

    setJwt(response.jwt);
    setRefreshToken(response.refreshToken);

    // Force revalidation, without this app.tsx would just redirect the user back here after logging in
    await queryClient.resetQueries({
      queryKey: ["isLoggedIn"],
      exact: true,
    });
    await queryClient.resetQueries({
      queryKey: ["user"],
      exact: true,
    });

    await navigate("/");
  };

  return (
    <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center">
      <div className="bg-background z-10 flex h-fit w-full flex-col items-center justify-center gap-20 p-10">
        <div className="bg-secondary w-lg shadow-muted border-muted rounded-xl border-2 shadow-lg">
          <form
            className="p-15 flex h-full flex-col items-center justify-center gap-4"
            onSubmit={handleSubmit}
            ref={formRef}
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
                onKeyDown={handleKeyDown}
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
                onKeyDown={handleKeyDown}
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
              className="bg-input hover:bg-input/80 mt-5 h-12 w-full p-2 disabled:opacity-50"
              onClick={handleSubmit}
              disabled={!isValid}
            >
              Log in
            </Button>

            <Button
              type="submit"
              className="bg-input hover:bg-input/80 h-12 w-full p-2"
            >
              <img
                className="h-5 w-5"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
              />

              <span className="font-medium text-white">Login with Google</span>
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

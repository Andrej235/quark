import sendApiRequest from "@/api-dsl/send-api-request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleAlert } from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";

type Errors = {
  username?: string;
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

type Touched = {
  username?: boolean;
  name?: boolean;
  lastName?: boolean;
  email?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
};

export default function SignUpPage() {
  const [fields, setFields] = useState({
    username: "",
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [isValid, setIsValid] = useState<boolean>(false);

  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = useCallback(() => {
    const newErrors: Errors = {};

    if (!fields.username.trim()) newErrors.username = "Please enter a username";
    else if (fields.username.trim().length < 3)
      newErrors.username = "Username must be at least 3 characters";
    else if (!/^[a-zA-Z0-9-]+$/.test(fields.username.trim()))
      newErrors.username =
        "Username can only contain letters, numbers, and dashes";

    if (!fields.name.trim()) newErrors.name = "Please enter a first name";

    if (!fields.lastName.trim())
      newErrors.lastName = "Please enter a last name";

    if (!fields.email.trim()) newErrors.email = "Please enter an email address";
    else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(fields.email)
    )
      newErrors.email = "Please enter a valid email address";

    if (!fields.password.trim()) newErrors.password = "Please enter a password";
    else if (fields.password.trim().length < 8)
      newErrors.password = "Password must be at least 8 characters long";

    if (fields.password !== fields.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

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

  const handleSubmit = async (e: MouseEvent | FormEvent) => {
    e.preventDefault();
    setTouched({
      username: true,
      name: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    validateForm();

    if (Object.keys(errors).length > 0) return;

    const { isOk } = await sendApiRequest(
      "/user/signup",
      {
        method: "post",
        payload: fields,
      },
      {
        showToast: true,
        toastOptions: {
          success: "Successfully signed up! Please log in.",
        },
      },
    );

    if (!isOk) return;

    navigate("/login");
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

  return (
    <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center">
      <div className="bg-background z-10 flex h-fit w-full flex-col items-center justify-center gap-20 p-10">
        <div className="bg-secondary w-lg shadow-muted border-muted rounded-md border-2 shadow-lg">
          <form
            onSubmit={handleSubmit}
            className="p-15 flex h-full flex-col items-center justify-center gap-2 transition-all duration-300"
            ref={formRef}
          >
            <h1 className="text-3xl">Welcome to Quark!</h1>
            <h3 className="text-muted-foreground mb-5 text-lg">
              Create your account to get started
            </h3>

            <div className="flex w-full flex-col gap-2">
              <h6 className="text-sm">Username</h6>
              <Input
                type="text"
                className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                value={fields.username}
                onChange={handleChange("username")}
                onBlur={handleBlur("username")}
                onKeyDown={handleKeyDown}
              />
              {touched.username && errors.username && (
                <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                  <CircleAlert /> {errors.username}
                </p>
              )}
            </div>

            <div className="flex w-full flex-row gap-5">
              <div className="flex w-1/2 flex-col gap-2">
                <h6 className="text-sm">First name</h6>
                <Input
                  type="text"
                  className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                  value={fields.name}
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  onKeyDown={handleKeyDown}
                />
                {touched.name && errors.name && (
                  <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                    <CircleAlert /> {errors.name}
                  </p>
                )}
              </div>
              <div className="flex w-1/2 flex-col gap-2">
                <h6 className="text-sm">Last name</h6>
                <Input
                  type="text"
                  className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                  value={fields.lastName}
                  onChange={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  onKeyDown={handleKeyDown}
                />
                {touched.lastName && errors.lastName && (
                  <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                    <CircleAlert /> {errors.lastName}
                  </p>
                )}
              </div>
            </div>

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

            <div className="flex w-full flex-col gap-2">
              <h6 className="text-sm">Confirm Password</h6>
              <Input
                type="password"
                className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                value={fields.confirmPassword}
                onChange={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                onKeyDown={handleKeyDown}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-destructive text-xs">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              onClick={handleSubmit}
              className="bg-input hover:bg-input/80 mt-5 h-12 w-full p-2 disabled:opacity-50"
            >
              Sign up
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

              <span className="font-medium">Login with Google</span>
            </Button>

            <div className="ml-auto mt-5 flex w-full flex-row items-center justify-center gap-3">
              <p className="text-primary text-xs">Already have an account?</p>
              <Link
                type="button"
                className="bg-secondary text-foreground text-xs"
                to="/login"
              >
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

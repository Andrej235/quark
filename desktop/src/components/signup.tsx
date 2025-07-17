import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleAlert } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [errorComparePassword, setErrorComparePassword] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorFirstName, setErrorFirstName] = useState<string>("");
  const [errorLastName, setErrorLastName] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const isFirstTimeRenderRef = useRef(true);

  const [isValid, setIsValid] = useState<boolean>(true);

  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;

    setErrorUsername("");
    setErrorPassword("");
    setErrorComparePassword("");
    setErrorFirstName("");
    setErrorLastName("");
    setErrorEmail("");

    if (username.trim() === "") {
      setErrorUsername("Please enter a username");
      valid = false;
    }

    if (firstName.trim() === "") {
      setErrorFirstName("Please enter a first name");
      valid = false;
    }

    if (lastName.trim() === "") {
      setErrorLastName("Please enter a last name");
      valid = false;
    }

    if (password.trim() === "") {
      setErrorPassword("Please enter a password");
      valid = false;
    }

    if (password !== confirmPassword) {
      setErrorComparePassword("Passwords do not match");
      valid = false;
    }

    if (email.trim() === "" || !email.includes("@")) {
      setErrorEmail("Please enter a valid email address");
      valid = false;
    }

    setIsValid(valid);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSignUpClick = () => {
    validateForm();

    if (isValid === false) return;

    navigate("/login");
  };

  useEffect(() => {
    if (isFirstTimeRenderRef.current) {
      isFirstTimeRenderRef.current = false;
      return;
    }
    validateForm();
  });

  return (
    <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center">
      <div className="bg-background z-10 flex h-fit w-full flex-col items-center justify-center gap-20 p-10">
        <div className="bg-secondary h-lg w-md shadow-muted border-muted rounded-xl border-2 shadow-lg">
          <form
            onSubmit={handleSubmit}
            className={`p-15 flex h-full flex-col items-center justify-center transition-all duration-300 ${
              isValid ? "gap-4" : "gap-2"
            }`}
          >
            <h1 className="text-foreground mb-1 text-3xl">Welcome to Quark!</h1>
            <h3 className="mb-5">Create your account</h3>

            <div className="flex w-full flex-col gap-2">
              <h6 className="text-sm">Username</h6>
              <Input
                type="text"
                className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                onChange={(e) => setUsername(e.target.value)}
              />
              {errorUsername && (
                <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                  <CircleAlert /> Required
                </p>
              )}
            </div>

            <div className="flex w-full flex-row gap-5">
              <div className="flex w-1/2 flex-col gap-2">
                <h6 className="text-sm">First name</h6>
                <Input
                  type="text"
                  className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errorFirstName && (
                  <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                    <CircleAlert /> Required
                  </p>
                )}
              </div>
              <div className="flex w-1/2 flex-col gap-2">
                <h6 className="text-sm">Last name</h6>
                <Input
                  type="text"
                  className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errorLastName && (
                  <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                    <CircleAlert /> Required
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2">
              <h6 className="text-sm">Email</h6>
              <Input
                type="text"
                className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorEmail && (
                <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                  <CircleAlert /> Required
                </p>
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <h6 className="text-sm">Password</h6>
              <Input
                type="password"
                className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorPassword && (
                <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                  <CircleAlert /> Required
                </p>
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <h6 className="text-sm">Comfirm Password</h6>
              <Input
                type="password"
                className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errorComparePassword && (
                <p className="text-destructive text-xs">
                  {errorComparePassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              onClick={handleSignUpClick}
              className={`bg-input hover:bg-primary-dark mt-5 h-12 w-full rounded-2xl p-2 text-white transition-colors ${
                !isValid ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              Sign up
            </Button>

            <Button
              type="submit"
              className="bg-input hover:bg-primary-dark h-12 w-full cursor-pointer rounded-2xl p-2 text-white transition-colors"
            >
              <img
                className="h-5 w-5"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
              />
              <span className="font-medium text-white">Login with Google</span>
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

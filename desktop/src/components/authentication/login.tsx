import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center">
      <div className="bg-background z-10 flex h-fit w-full flex-col items-center justify-center gap-20 p-10">
        <div className="bg-secondary h-xl w-md shadow-muted border-muted rounded-xl border-2 shadow-lg">
          <form className="p-15 flex h-full flex-col items-center justify-center gap-4">
            <h1 className="text-foreground mb-1 text-3xl">Welcome to Quark!</h1>
            <p className="mb-5">Ready for a new day?</p>
            <Input
              type="text"
              placeholder="Email"
              className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
            />
            <Link
              to="/forgot-password"
              className="text-foreground ml-auto mt-2 text-xs"
            >
              Forgot password?
            </Link>
            <Button
              type="submit"
              className="bg-input hover:bg-primary-dark h-12 w-full cursor-pointer rounded-2xl p-2 text-white transition-colors"
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

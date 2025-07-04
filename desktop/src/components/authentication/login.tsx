import { Link } from 'react-router-dom';
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Login() {
  return (
    <div className="bg-background z-10 flex h-screen w-full flex-col items-center justify-center gap-20">
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
          <a
            href="/forgot-password"
            className="text-foreground ml-auto mt-2 text-xs"
          >
            Forgot password?
          </a>
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
          >
            <img
              className="h-5 w-5"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
            />
            <span className="font-medium text-white">Login with Google</span>
          </Button>

          <div className="ml-auto mt-5 flex w-full flex-row items-center justify-center gap-3">
            <p className="text-primary text-xs">Don&apos;t have an account?</p>
            <a
              type="button"
              className="bg-secondary text-foreground text-xs"
              href="/signup"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

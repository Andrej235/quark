import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function Signup() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSumbit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if(password !== confirmPassword)
        {
            setError("Passwords do not match");
            return;
        }

        setError("");
        window.alert("Form submitted successfully!");
    }
    
  return (
    <div className="bg-background z-10 flex h-screen w-full flex-col items-center justify-center gap-20">
      <div className="bg-secondary h-xl w-md shadow-muted border-muted rounded-xl border-2 shadow-lg">
        <form className="p-15 flex h-full flex-col items-center justify-center gap-4" onSubmit={handleSumbit}>
          <h1 className="text-foreground mb-1 text-3xl">Welcome to Quark!</h1>
          <h3 className="mb-5">Sign up</h3>
          <Input
            type="text"
            placeholder="Username"
            className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
          />
          <Input
            type="text"
            placeholder="First Name"
            className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
          />
          <Input
            type="text"
            placeholder="Last Name"
            className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
          />
          <Input
            type="text"
            placeholder="Email"
            className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
          />
          <Input
            type="password"
            placeholder="Password"
            className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Comfirm password"
            className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-destructive text-xs">{error}</p>}
          <Button
            type="submit"
            className="bg-input hover:bg-primary-dark h-12 w-full cursor-pointer rounded-2xl p-2 text-white transition-colors mt-10"
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
            <a
              type="button"
              className="bg-secondary text-foreground text-xs"
              href="/login"
            >
              Log in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

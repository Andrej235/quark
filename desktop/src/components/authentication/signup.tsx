import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
export default function Signup() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errorComparePassword, setErrorComparePassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorFirstName, setErrorFirstName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  let isValid = true;

  setErrorUsername("");
  setErrorPassword("");
  setErrorComparePassword("");
  setErrorFirstName("");
  setErrorLastName("");
  setErrorEmail("");

  if (username.trim() === "") {
    setErrorUsername("Please enter a username");
    isValid = false;
  }

  if (firstName.trim() === "") {
    setErrorFirstName("Please enter a first name");
    isValid = false;
  }

  if (lastName.trim() === "") {
    setErrorLastName("Please enter a last name");
    isValid = false;
  }

  if (password.trim() === "") {
    setErrorPassword("Please enter a password");
    isValid = false;
  }

  if (password !== confirmPassword) {
    setErrorComparePassword("Passwords do not match");
    isValid = false;
  }

  if (email.trim() === "" || !email.includes("@")) {
    setErrorEmail("Please enter a valid email address");
    isValid = false;
  }

  if (!isValid) return;

  alert("Form submitted successfully!");
};

  return (
    <div className="bg-background z-10 flex h-screen w-full flex-col items-center justify-center gap-20">
      <div className="bg-secondary h-xl w-md shadow-muted border-muted rounded-xl border-2 shadow-lg">
        <form
          className="p-15 flex h-full flex-col items-center justify-center gap-4"
          onSubmit={handleSubmit}
        >
          <h1 className="text-foreground mb-1 text-3xl">Welcome to Quark!</h1>
          <h3 className="mb-5">Sign up</h3>
          <Input
            type="text"
            placeholder="Username"
            className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errorUsername && (
            <p className="text-destructive text-xs">{errorUsername}</p>
          )}
          <Input
            type="text"
            placeholder="First Name"
            className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errorFirstName && (
            <p className="text-destructive text-xs">{errorFirstName}</p>
          )}
          <Input
            type="text"
            placeholder="Last Name"
            className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {errorLastName && (
            <p className="text-destructive text-xs">{errorLastName}</p>
          )}
          <Input
            type="text"
            placeholder="Email"
            className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errorEmail && (
            <p className="text-destructive text-xs">{errorEmail}</p>
          )}
          <Input
            type="password"
            placeholder="Password"
            className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorPassword && (
            <p className="text-destructive text-xs">{errorPassword}</p>
          )}
          <Input
            type="password"
            placeholder="Comfirm password"
            className="bg-input text-foreground h-12 w-full rounded-md p-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errorComparePassword && (
            <p className="text-destructive text-xs">{errorComparePassword}</p>
          )}
          <Button
            type="submit"
            className="bg-input hover:bg-primary-dark mt-10 h-12 w-full cursor-pointer rounded-2xl p-2 text-white transition-colors"
            onClick={handleSubmit}
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
  );
}

import sendApiRequest from "@/api-dsl/send-api-request";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuthStore from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store";
import { useQueryClient } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Mail } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "./countdown-timer";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";

export default function ConfirmEmailInstructions() {
  const user = useUserStore((x) => x.user);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const logOut = useAuthStore((x) => x.logOut);
  const queryClient = useQueryClient();

  const [isCountdownActive, setIsCountdownActive] = useState(false);

  const sentVerification = useRef(false);
  async function handleResendEmail() {
    if (sentVerification.current) return;
    sentVerification.current = true;

    const response = await sendApiRequest(
      "/users/resend-confirmation-email",
      {
        method: "post",
        parameters: {
          email: user?.email,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Sending verification email, please wait...",
          success: "Verification email resent successfully!",
          error: (x) => x.message || "Failed to resend email",
        },
      },
    );

    // Timeout to prevent clicks before react rerenders the component with countdown set to true
    setTimeout(() => {
      sentVerification.current = false;
    }, 300);
    if (!response.isOk) return;

    setIsCountdownActive(true);
  }

  async function handleSubmitCode() {
    if (!user) return;
    setOtp("");

    const { isOk } = await sendApiRequest(
      "/users/confirm-email",
      {
        method: "post",
        payload: {
          email: user.email,
          token: otp,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Verifying email, please wait...",
          success: "Email verified successfully!",
          error: (x) => x.message || "Failed to verify email",
        },
      },
    );

    if (!isOk) return;
    navigate("/first-team", {
      state: {
        isEmailVerified: true,
      },
      flushSync: true,
    }) as Promise<void>;
  }

  return (
    <div className="grid h-screen w-screen place-items-center">
      <Card className="aspect-square w-full max-w-lg justify-center">
        <CardHeader className="text-center">
          <div className="bg-primary/25 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <Mail className="text-primary size-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>

          <CardDescription className="text-base">
            We&apos;ve sent a verification link to{" "}
            <span className="font-medium">{user?.email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Click the link sent to your email or enter the code to verify your
              account. If you can&apos;t find the email in your inbox, make sure
              to check your spam folder.
            </p>
          </div>

          <div className="mt-8 flex w-full justify-center">
            <InputOTP
              maxLength={6}
              onChange={(x) => setOtp(x.toUpperCase())}
              onKeyDown={(x) => {
                if (x.key === "Enter" && otp.length === 6) handleSubmitCode();
              }}
              value={otp}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>

              <InputOTPSeparator />

              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="grid w-full gap-x-2 lg:grid-cols-2">
            <Button
              className="w-full"
              disabled={otp.length !== 6}
              onClick={handleSubmitCode}
            >
              Verify
            </Button>

            <Button
              onClick={handleResendEmail}
              disabled={isCountdownActive}
              className="w-full"
            >
              {isCountdownActive ? (
                <span className="flex items-center">
                  Resend email in{" "}
                  <CountdownTimer
                    seconds={90}
                    onComplete={() => setIsCountdownActive(false)}
                  />
                </span>
              ) : (
                <span>Resend verification email</span>
              )}
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-0">
            <p className="text-muted-foreground text-center text-sm">
              Currently logged in as {user?.username}.
            </p>

            <Button
              variant="link"
              className="px-2 text-sm"
              onClick={async () => {
                await logOut();

                // Force revalidation, without this app.tsx would just redirect the user to the dashboard
                await queryClient.resetQueries({
                  queryKey: ["isLoggedIn"],
                  exact: true,
                });

                await navigate("/login");
              }}
            >
              Log out
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

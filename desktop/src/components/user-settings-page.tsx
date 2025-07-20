import { useUserStore } from "@/stores/user-store";
import { CircleAlert, Edit, Settings } from "lucide-react";
import { ChangeEvent, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

export default function UserSettingsPage() {
  const user = useUserStore((x) => x.user);
  const setUser = useUserStore((x) => x.setUser);

  const [passwordData, setPasswordData] = useState<{
    newPassword?: string;
    repeatPassword?: string;
    currentPassword?: string;
  }>({});
  const [passwordTouched, setPasswordTouched] = useState<{
    newPassword?: boolean;
    repeatPassword?: boolean;
    currentPassword?: boolean;
  }>({});
  const [passwordErrors, setPasswordErrors] = useState<{
    newPassword?: string;
    repeatPassword?: string;
    currentPassword?: string;
  }>({});

  function handleChange(
    e: ChangeEvent<HTMLInputElement>,
    field: keyof typeof passwordData,
  ) {
    const newPasswordData = { ...passwordData, [field]: e.target.value };
    setPasswordData(newPasswordData);

    const newErrors: typeof passwordErrors = {};
    if (!newPasswordData.newPassword || newPasswordData.newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters";
    else delete newErrors.newPassword;

    if (
      !newPasswordData.repeatPassword ||
      newPasswordData.repeatPassword !== newPasswordData.newPassword
    )
      newErrors.repeatPassword = "Passwords do not match";
    else delete newErrors.repeatPassword;

    if (
      !newPasswordData.currentPassword ||
      newPasswordData.currentPassword.length < 8
    )
      newErrors.currentPassword = "Password must be at least 8 characters";
    else newErrors.currentPassword = "";

    setPasswordErrors(newErrors);
  }

  function handleBlur(field: keyof typeof passwordTouched) {
    setPasswordTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleRemoveProfilePicture() {
    setUser({
      ...user!,
      profilePicture: null,
    });
  }

  function handleChangeProfilePicture(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const imageBase64 = reader.result as string;
      setUser({
        ...user!,
        profilePicture: imageBase64,
      });
    };
  }

  if (!user) return;

  return (
    <div className="bg-muted/50 flex h-full min-h-[100vh] flex-row rounded-xl md:min-h-min">
      <div className="w-md bg-secondary flex h-full flex-col items-center gap-2 rounded-xl p-12 shadow-[0_0_5px_rgba(59,130,246,0.5)]">
        <div className="bg-muted group relative flex items-center justify-center rounded-full">
          <img
            src={user.profilePicture || "/default-profile-picture.png"}
            className="size-40 rounded-full"
          />

          <div className="bg-primary/50 absolute -inset-1 flex rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100">
            <button
              className="inset-0 grid flex-1 place-items-center"
              onClick={(e) =>
                (
                  (e.target as HTMLButtonElement)
                    .nextElementSibling as HTMLInputElement
                )?.click()
              }
            >
              <Edit className="size-8" />
            </button>

            <Input
              type="file"
              className="hidden"
              onChange={handleChangeProfilePicture}
            />
          </div>
        </div>

        <h1 className="mt-2 text-2xl">
          {user.name} {user.lastName}
        </h1>

        <div className="mt-4 flex flex-col gap-2">
          <Input
            type="file"
            className="hidden"
            onChange={handleChangeProfilePicture}
          />

          <Button
            className="shadow-[0_0_5px_rgba(59,130,246,0.5)]"
            onClick={(e) =>
              (
                (e.target as HTMLButtonElement)
                  .previousElementSibling as HTMLInputElement
              )?.click()
            }
          >
            Change profile picture
          </Button>

          <Button
            variant={"destructive"}
            className="shadow-[0_0_5px_rgba(59,130,246,0.5)]"
            onClick={handleRemoveProfilePicture}
          >
            Remove profile picture
          </Button>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2">
          <h1 className="text-lg">Default team: Eko Koko Farm</h1>
          <h1 className="text-lg">Role: Programmer</h1>{" "}
          {/* TODO: get role from backend */}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 p-12">
        <div className="flex flex-col gap-2 px-24">
          <h1 className="flex items-center gap-2 text-4xl">
            <Settings className="size-8" />
            <span>Profile</span>
          </h1>

          <p className="text-muted-foreground text-lg">
            Change you account settings
          </p>
        </div>
        <div className="flex flex-col gap-6 px-24 py-12">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              name="username"
              autoComplete="off"
              className="bg-input w-md"
              value={user.username}
              onChange={(e) => {
                setUser({
                  ...user,
                  username: e.target.value.replace(/[^a-zA-Z0-9-]+/g, ""),
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="first-name">First name</Label>
            <Input
              name="first-name"
              autoComplete="off"
              className="bg-input w-md"
              value={user.name}
              onChange={(e) => {
                setUser({
                  ...user,
                  name: e.target.value.replace(/[^a-zA-Z ]+/g, ""),
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input
              name="last-name"
              autoComplete="off"
              className="bg-input w-md"
              value={user.lastName}
              onChange={(e) => {
                setUser({
                  ...user,
                  lastName: e.target.value.replace(/[^a-zA-Z ]+/g, ""),
                });
              }}
            />
          </div>

          <Button className="w-fit px-12 py-4 shadow-[0_0_5px_rgba(59,130,246,0.5)]">
            Update info
          </Button>
        </div>

        <div className="flex flex-col gap-6 px-24">
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              type="password"
              name="new-password"
              autoComplete="off"
              className="bg-input w-md"
              value={passwordData.newPassword}
              onChange={(e) => handleChange(e, "newPassword")}
              onBlur={() => handleBlur("newPassword")}
            />
            {passwordTouched.newPassword && passwordErrors.newPassword && (
              <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                <CircleAlert /> {passwordErrors.newPassword}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="repeat-password">Repeat password</Label>
            <Input
              type="password"
              name="repeat-password"
              autoComplete="off"
              className="bg-input w-md"
              value={passwordData.repeatPassword}
              onChange={(e) => handleChange(e, "repeatPassword")}
              onBlur={() => handleBlur("repeatPassword")}
            />
            {passwordTouched.repeatPassword &&
              passwordErrors.repeatPassword && (
                <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                  <CircleAlert /> {passwordErrors.repeatPassword}
                </p>
              )}
          </div>

          <AlertDialog
            onOpenChange={(isOpen) => {
              if (isOpen)
                setPasswordTouched((x) => ({
                  ...x,
                  currentPassword: false,
                }));
            }}
          >
            <AlertDialogTrigger asChild>
              <Button className="w-fit px-12 py-4 shadow-[0_0_5px_rgba(59,130,246,0.5)]">
                Update password
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to update your password?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  To complete the update you need to verify your identity by
                  entering your current password
                </AlertDialogDescription>

                <Separator />
              </AlertDialogHeader>

              <div>
                <Label htmlFor="current-password" className="mb-2">
                  Old password
                </Label>

                <Input
                  type="password"
                  name="current-password"
                  autoComplete="current-password"
                  className="bg-input w-md"
                  value={passwordData.currentPassword}
                  onChange={(e) => handleChange(e, "currentPassword")}
                  onBlur={() => handleBlur("currentPassword")}
                />

                {passwordTouched.currentPassword &&
                  passwordErrors.currentPassword && (
                    <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                      <CircleAlert /> {passwordErrors.currentPassword}
                    </p>
                  )}
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={
                    !passwordData.currentPassword ||
                    passwordData.currentPassword.length < 8 ||
                    !passwordData.newPassword ||
                    passwordData.newPassword.length < 8 ||
                    !passwordData.repeatPassword ||
                    passwordData.repeatPassword.length < 8
                  }
                >
                  Update password
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

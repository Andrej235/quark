import sendApiRequest from "@/api-dsl/send-api-request";
import { useUserStore } from "@/stores/user-store";
import { CircleAlert, Edit, Settings } from "lucide-react";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { useQueryClient } from "@tanstack/react-query";

export default function UserSettingsPage() {
  const user = useUserStore((x) => x.user);
  const setUser = useUserStore((x) => x.setUser);
  const queryClient = useQueryClient();

  const [userData, setUserData] = useState<typeof user>(null);
  useEffect(() => setUserData(user ? { ...user } : null), [user]);

  const [userDataTouched, setUserDataTouched] = useState<{
    username?: boolean;
    firstName?: boolean;
    lastName?: boolean;
  }>({});
  const [userDataErrors, setUserDataErrors] = useState<{
    username?: string;
    firstName?: string;
    lastName?: string;
  }>({});

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

  function handleUserChange(
    e: ChangeEvent<HTMLInputElement>,
    field: "username" | "firstName" | "lastName",
  ) {
    if (!userData) return;

    const newUserData = { ...userData, [field]: e.target.value };
    setUserData(newUserData);

    validateUserData(newUserData);
  }

  function validateUserData(newUserData: NonNullable<typeof userData>) {
    const newErrors: typeof userDataErrors = {};
    if (!newUserData.username || newUserData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";

    if (!newUserData.firstName || newUserData.firstName.length < 1)
      newErrors.firstName = "First name is required";

    if (!newUserData.lastName || newUserData.lastName.length < 1)
      newErrors.lastName = "Last name is required";

    setUserDataErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleUserBlur(field: keyof typeof userDataTouched) {
    setUserDataTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handlePasswordDataChange(
    e: ChangeEvent<HTMLInputElement>,
    field: keyof typeof passwordData,
  ) {
    const newPasswordData = { ...passwordData, [field]: e.target.value };
    setPasswordData(newPasswordData);

    validatePasswordData(newPasswordData);
  }

  function validatePasswordData(data: typeof passwordData) {
    const newErrors: typeof passwordErrors = {};
    if (!data.newPassword || data.newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters";

    if (!data.repeatPassword || data.repeatPassword !== data.newPassword)
      newErrors.repeatPassword = "Passwords do not match";

    if (!data.currentPassword || data.currentPassword.length < 8)
      newErrors.currentPassword = "Password must be at least 8 characters";

    setPasswordErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handlePasswordBlur(field: keyof typeof passwordTouched) {
    setPasswordTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleRemoveProfilePicture() {
    setUserData({
      ...userData!,
      profilePicture: null,
    });
  }

  function handleChangeProfilePicture(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isWaitingForRequest.current) isWaitingForRequest.current = true;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const imageBase64 = reader.result as string;
      setUserData({
        ...userData!,
        profilePicture: imageBase64,
      });

      const { isOk } = await sendApiRequest(
        "/users/profile-picture",
        {
          method: "patch",
          payload: {
            profilePicture: imageBase64,
          },
        },
        {
          showToast: true,
          toastOptions: {
            success: "Successfully updated profile picture!",
          },
        },
      );
      isWaitingForRequest.current = false;

      if (isOk)
        setUser({
          ...user!,
          profilePicture: imageBase64,
        });
    };
  }

  const isWaitingForRequest = useRef(false);
  async function handleUpdateInfo(e: MouseEvent) {
    if (isWaitingForRequest.current) return;
    if (!userData) return;

    setUserDataTouched({
      username: true,
      firstName: true,
      lastName: true,
    });

    const isValid = validateUserData(userData);
    if (!isValid) {
      e.preventDefault();
      return;
    }

    isWaitingForRequest.current = true;
    const { isOk } = await sendApiRequest(
      "/users",
      {
        method: "patch",
        payload: {
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
      },
      {
        showToast: true,
        toastOptions: {
          success: "Successfully updated user info!",
        },
      },
    );

    isWaitingForRequest.current = false;

    if (isOk) {
      setUser({ ...userData });
      // In case username has been changed app's query data also needs to reflect that because otherwise it would just reset local data from the zustand store thinking the user changed accounts
      queryClient.setQueryData(["user"], { ...userData });
    }
  }

  async function handleUpdatePassword(e: MouseEvent) {
    if (isWaitingForRequest.current) return;
    if (!userData) return;

    setPasswordTouched({
      currentPassword: true,
      repeatPassword: true,
      newPassword: true,
    });

    const isValid = validatePasswordData(passwordData);

    if (!isValid) {
      e.preventDefault();
      return;
    }

    isWaitingForRequest.current = true;
    await sendApiRequest(
      "/users/password",
      {
        method: "patch",
        payload: {
          oldPassword: passwordData.currentPassword!,
          newPassword: passwordData.newPassword!,
        },
      },
      {
        showToast: true,
        toastOptions: {
          success: "Successfully updated password!",
        },
      },
    );
    isWaitingForRequest.current = false;
  }

  async function handleDefaultTeamChange(id: string) {
    if (isWaitingForRequest.current || !userData) return;

    setUserData({
      ...userData,
      defaultTeamId: id,
    });

    isWaitingForRequest.current = true;
    const { isOk } = await sendApiRequest(
      "/users/set-default-team/{teamId}",
      {
        method: "patch",
        parameters: {
          teamId: id,
        },
      },
      {
        showToast: true,
        toastOptions: {
          success: "Successfully updated default team!",
        },
      },
    );
    isWaitingForRequest.current = false;

    if (isOk)
      setUser({
        ...user!,
        defaultTeamId: id,
      });
  }

  if (!userData) return;

  return (
    <div className="flex flex-col items-center gap-24 rounded-xl p-12 lg:flex-row lg:gap-0">
      <div className="flex h-full w-full flex-col gap-4 lg:w-64 xl:w-96">
        <Card>
          <CardHeader>
            <CardTitle>Profile picture</CardTitle>
            <CardDescription>
              Change or remove your profile picture
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="bg-muted group relative mx-auto flex size-max items-center justify-center rounded-full">
              <img
                src={userData.profilePicture || "/default-profile-picture.png"}
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

            <h1 className="mt-4 text-center text-2xl">
              {userData.firstName} {userData.lastName}
            </h1>

            <div className="mt-4 flex gap-2">
              <Input
                type="file"
                className="hidden"
                onChange={handleChangeProfilePicture}
              />

              <Button
                className="flex-1 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                onClick={(e) =>
                  (
                    (e.target as HTMLButtonElement)
                      .previousElementSibling as HTMLInputElement
                  )?.click()
                }
              >
                Change
              </Button>

              <Button
                variant="destructive"
                className="flex-1 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                onClick={handleRemoveProfilePicture}
                disabled={!userData.profilePicture}
              >
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default team</CardTitle>
            <CardDescription>
              This team will be active upon logging in or opening the app
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Select
              value={
                userData.teams.find(
                  (team) => team.id === userData.defaultTeamId,
                )?.id
              }
              onValueChange={handleDefaultTeamChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>

              <SelectContent>
                {userData.teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-128 flex w-full flex-1 flex-col gap-2 xl:max-w-2xl">
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
              className="bg-input"
              value={userData.username || ""}
              onChange={(e) => {
                handleUserChange(e, "username");
              }}
              onBlur={() => handleUserBlur("username")}
            />
            {userDataTouched.username && userDataErrors.username && (
              <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                <CircleAlert /> {userDataErrors.username}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="first-name">First name</Label>
            <Input
              name="first-name"
              autoComplete="off"
              className="bg-input"
              value={userData.firstName || ""}
              onChange={(e) => {
                handleUserChange(e, "firstName");
              }}
              onBlur={() => handleUserBlur("firstName")}
            />
            {userDataTouched.firstName && userDataErrors.firstName && (
              <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                <CircleAlert /> {userDataErrors.firstName}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input
              name="last-name"
              autoComplete="off"
              className="bg-input"
              value={userData.lastName || ""}
              onChange={(e) => {
                handleUserChange(e, "lastName");
              }}
              onBlur={() => handleUserBlur("lastName")}
            />
            {userDataTouched.lastName && userDataErrors.lastName && (
              <p className="text-destructive flex flex-row items-center gap-2 text-xs">
                <CircleAlert /> {userDataErrors.lastName}
              </p>
            )}
          </div>

          <Button
            className="w-fit px-12 py-4 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
            onClick={handleUpdateInfo}
          >
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
              className="bg-input"
              value={passwordData.newPassword || ""}
              onChange={(e) => handlePasswordDataChange(e, "newPassword")}
              onBlur={() => handlePasswordBlur("newPassword")}
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
              className="bg-input"
              value={passwordData.repeatPassword || ""}
              onChange={(e) => handlePasswordDataChange(e, "repeatPassword")}
              onBlur={() => handlePasswordBlur("repeatPassword")}
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
                  Are you sure you want to update Are you sure you want to
                  update your password?
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
                  className="bg-input"
                  value={passwordData.currentPassword || ""}
                  onChange={(e) =>
                    handlePasswordDataChange(e, "currentPassword")
                  }
                  onBlur={() => handlePasswordBlur("currentPassword")}
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
                <AlertDialogAction onClick={handleUpdatePassword}>
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

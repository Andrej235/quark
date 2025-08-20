import sendApiRequest from "@/api-dsl/send-api-request";
import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import useQuery from "@/api-dsl/use-query";
import { useUserStore } from "@/stores/user-store";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Loader2, Users2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle } from "./ui/card";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function TeamInvitationsDialogContent() {
  const invitations = useQuery("/team-invitations/pending", {
    queryKey: ["team-invitations"],
  });
  const queryClient = useQueryClient();

  const user = useUserStore((x) => x.user);
  const setUser = useUserStore((x) => x.setUser);

  const navigate = useNavigate();

  async function handleAcceptInvitation(
    invitation: Schema<"TeamInvitationResponseDto">,
  ) {
    if (!user) return;

    const { isOk, response } = await sendApiRequest(
      "/team-invitations/accept/{id}",
      {
        method: "post",
        parameters: {
          id: invitation.id,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Accepting invitation, please wait...",
          success: "Invitation accepted successfully!",
          error: (x) =>
            x.message || "Failed to accept invitation, please try again",
        },
      },
    );

    if (!isOk || !response) return;

    await queryClient.setQueryData(
      ["team-invitations"],
      invitations.data?.filter((x) => x.id !== invitation.id),
    );

    setUser({ ...user, teams: [...user.teams, response] });
    await navigate("/");
  }

  async function handleDeclineInvitation(
    invitation: Schema<"TeamInvitationResponseDto">,
  ) {
    const { isOk } = await sendApiRequest(
      "/team-invitations/decline/{id}",
      {
        method: "post",
        parameters: {
          id: invitation.id,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Declining invitation, please wait...",
          success: "Invitation declined successfully!",
          error: (x) =>
            x.message || "Failed to decline invitation, please try again",
        },
      },
    );

    if (!isOk) return;

    await queryClient.setQueryData(
      ["team-invitations"],
      invitations.data?.filter((x) => x.id !== invitation.id),
    );
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Team invitations</DialogTitle>

        <DialogDescription>
          Here you can manage all your team invitations, any new ones will
          appear automatically
        </DialogDescription>
      </DialogHeader>

      <Separator />

      <div className="mt-2 flex w-full flex-col items-center">
        {invitations.isLoading && <Loader2 className="animate-spin" />}

        {!invitations.isLoading && invitations.data?.length === 0 && (
          <p className="text-muted-foreground">
            You have no pending team invitations
          </p>
        )}

        {!invitations.isLoading &&
          invitations.data &&
          invitations.data.length > 0 &&
          invitations.data.map((x) => (
            <Card key={x.id} className="w-full p-4">
              <div className="flex items-center gap-2">
                {x.teamLogo && (
                  <img src={x.teamLogo} className="size-8" alt="team logo" />
                )}

                {!x.teamLogo && <Users2 className="size-8" />}

                <div>
                  <CardTitle className="font-medium">{x.teamName}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Invited by &quot;{x.invitedBy}&quot;
                  </CardDescription>
                </div>

                <div className="ml-auto flex gap-2">
                  <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                      <Button onClick={() => handleAcceptInvitation(x)}>
                        <CheckCircle />
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>Accept invitation</TooltipContent>
                  </Tooltip>

                  <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeclineInvitation(x)}
                      >
                        <X />
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>Decline invitation</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </DialogContent>
  );
}

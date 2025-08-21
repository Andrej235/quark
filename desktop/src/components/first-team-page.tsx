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
import { Users2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import UserTeamInvitationsDialogContent from "./user-team-invitations-dialog-content";

export default function FirstTeamPage() {
  const user = useUserStore((x) => x.user);

  const navigate = useNavigate();
  const logOut = useAuthStore((x) => x.logOut);
  const queryClient = useQueryClient();

  const [invitationsDialogOpen, setInvitationsDialogOpen] = useState(false);

  return (
    <div className="grid h-screen w-screen place-items-center">
      <Card className="aspect-square w-full max-w-xl justify-center">
        <CardHeader className="text-center">
          <div className="bg-primary/25 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <Users2 />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome to Quark!
          </CardTitle>

          <CardDescription className="text-base">
            Let&apos; get started by creating or joining a team
          </CardDescription>
        </CardHeader>

        <CardContent className="text-start">
          <div className="text-foreground space-y-4 text-sm font-light">
            <p>
              This app is based around{" "}
              <Tooltip delayDuration={300}>
                <TooltipTrigger>
                  <span className="cursor-help font-bold italic">teams</span>
                </TooltipTrigger>

                <TooltipContent className="max-w-md text-sm">
                  Teams are a way to group users together, let them collaborate,
                  and provide cetralized billing. A team can consist of a single
                  user looking for clients, a huge corporation with a well
                  established brand, or anything and anyone in between.
                </TooltipContent>
              </Tooltip>{" "}
              so to get started you will need to either create a new one or join
              an existing one.
            </p>

            <p>
              Creating a team is easy, just click the button below and provide
              us with some information, like what your team&apos;s name will be,
              and choose a pricing plan.
            </p>

            <p>
              If you want to join an existing one, well that is even easier,
              first ask someone from that team to invite you and then simply
              accept that invitation either through the email we will send you
              or by clicking the button bellow.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="grid w-full gap-x-2 lg:grid-cols-2">
            <Button className="w-full" asChild>
              <Link to="/new-team">Create a team</Link>
            </Button>

            <Dialog
              open={invitationsDialogOpen}
              onOpenChange={setInvitationsDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="w-full">Join an existing team</Button>
              </DialogTrigger>

              <UserTeamInvitationsDialogContent
                isOpen={invitationsDialogOpen}
              />
            </Dialog>
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

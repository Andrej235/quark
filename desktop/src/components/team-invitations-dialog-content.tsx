import { Loader2 } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function TeamInvitationsDialogContent() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Team invitations</DialogTitle>

        <DialogDescription>
          Here you can manage all your team invitations, any new ones will
          appear automatically
        </DialogDescription>
      </DialogHeader>

      <div className="mt-2 flex w-full flex-col items-center">
        <Loader2 className="animate-spin" />
      </div>
    </DialogContent>
  );
}

import sendApiRequest from "@/api-dsl/send-api-request";
import { useProspectLayout } from "@/lib/prospects/hooks/use-prospect-layout";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { useTeamStore } from "@/stores/team-store";
import { Save } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import RenderSlotTree from "./prospect-layout/render-slot-tree";
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

export default function ProspectsLayoutPage() {
  const [layout, revalidateLayout] = useProspectLayout();

  const teamId = useTeamStore((x) => x.activeTeam?.id);
  const treeRoot = useSlotTreeRootStore((x) => x.slotTreeRoot);
  const isWaitingForResponse = useRef(false);
  async function handleSave() {
    if (!treeRoot || !layout || !teamId) return;

    if (isWaitingForResponse.current) {
      toast.info("Please wait, layout is being saved", {
        duration: 3000,
      });
      return;
    }
    isWaitingForResponse.current = true;

    const { isOk } = await sendApiRequest(
      "/prospect-layouts",
      {
        method: "put",
        payload: {
          id: layout.id,
          teamId,
          newJsonStructure: JSON.stringify(treeRoot),
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Saving layout, please wait...",
          success: "Layout saved successfully!",
          error: (x) => x.message || "Failed to save layout, please try again",
        },
      },
    );

    if (isOk) revalidateLayout();

    setTimeout(() => {
      isWaitingForResponse.current = false;
    }, 300);
  }

  if (!layout) return null;

  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Prospect Layout</CardTitle>
            <CardDescription>
              Modify the layout for prospects to control what information is
              collected
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="bg-transparent">
        <RenderSlotTree slot={layout.root} editMode />
      </CardContent>

      <div className="fixed bottom-16 right-16">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary">
              <span>Save Layout</span>
              <Save />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="min-w-max">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to save all changes to the layout?
              </AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone and will be immediately applied to
                all prospects.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction onClick={handleSave}>
                Apply only to new prospects
              </AlertDialogAction>

              <AlertDialogAction onClick={handleSave}>
                Apply to all prospects
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}

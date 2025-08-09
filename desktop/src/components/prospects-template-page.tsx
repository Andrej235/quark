import { useProspectsStore } from "@/stores/prospects-store";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { Save } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import RenderSlotTree from "./prospect-template/render-slot-tree";
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
import useQuery from "@/api-dsl/use-query";
import { useTeamStore } from "@/stores/team-store";
import { Slot } from "@/lib/prospects/slot-types/slot";
import sendApiRequest from "@/api-dsl/send-api-request";

export default function ProspectsTemplatePage() {
  const teamId = useTeamStore((x) => x.activeTeam)?.id;

  const template = useQuery("/prospect-layouts/default/{teamId}", {
    queryKey: ["default-prospect-template", teamId],
    parameters: {
      teamId: teamId!,
    },
    enabled: !!teamId,
    refetchOnMount: false,
  });

  const localTemplate = useProspectsStore((x) => x.template);
  const setLocalTemplate = useProspectsStore((x) => x.setTemplate);
  const localTemplateCopy = useMemo(
    () => structuredClone(localTemplate),
    [localTemplate],
  );

  const treeRoot = useSlotTreeRootStore((x) => x.slotTreeRoot);
  const isWaitingForResponse = useRef(false);
  async function handleSave() {
    if (!treeRoot || !template.data) return;

    if (isWaitingForResponse.current) {
      toast.info("Please wait, template is being saved", {
        duration: 3000,
      });
      return;
    }
    isWaitingForResponse.current = true;

    setLocalTemplate({ ...treeRoot });
    await sendApiRequest(
      "/prospect-layouts",
      {
        method: "put",
        payload: {
          id: template.data.id,
          newJsonStructure: JSON.stringify(treeRoot),
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Saving template, please wait...",
          success: "Template saved successfully!",
          error: (x) =>
            x.message || "Failed to save template, please try again",
        },
      },
    );

    setTimeout(() => {
      isWaitingForResponse.current = false;
    }, 300);
  }

  useEffect(() => {
    if (template.isSuccess)
      setLocalTemplate(JSON.parse(template.data!.jsonStructure) as Slot);
  }, [template.data, template.isSuccess, setLocalTemplate]);

  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Prospect Template</CardTitle>
            <CardDescription>
              Modify the template for prospects to control what information is
              collected
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="bg-transparent">
        <RenderSlotTree slot={localTemplateCopy} editMode />
      </CardContent>

      <div className="fixed bottom-16 right-16">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary">
              <span>Save Template</span>
              <Save />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="min-w-max">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to save all changes to the template?
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

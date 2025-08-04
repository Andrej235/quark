import { useProspectsStore } from "@/stores/prospects-store";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { Save } from "lucide-react";
import { useMemo } from "react";
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

export default function ProspectsTemplatePage() {
  const template = useProspectsStore((x) => x.template);
  const setTemplate = useProspectsStore((x) => x.setTemplate);
  const templateCopy = useMemo(() => structuredClone(template), [template]);

  const treeRoot = useSlotTreeRootStore((x) => x.slotTreeRoot);
  function handleSave() {
    if (!treeRoot) return;

    setTemplate({ ...treeRoot });
    toast.success("Template saved successfully!");
  }

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
        <RenderSlotTree slot={templateCopy} editMode />
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

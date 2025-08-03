import { useProspectsStore } from "@/stores/prospects-store";
import RenderSlotTree from "./prospect-template/render-slot-tree";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function ProspectsTemplatePage() {
  const template = useProspectsStore((x) => x.template);

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
        <RenderSlotTree slot={template} editMode />
      </CardContent>
    </Card>
  );
}

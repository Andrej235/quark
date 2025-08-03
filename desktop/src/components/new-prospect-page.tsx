import RenderSlotTree from "@/components/prospect-template/render-slot-tree";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { exampleSlot } from "@/components/prospects-template-page";

export default function NewProspectsPage() {
  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">New Prospect</CardTitle>
            <CardDescription>
              Create a new prospect by filling out all fields defined in the
              template
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="bg-transparent">
        <RenderSlotTree slot={exampleSlot} />
      </CardContent>
    </Card>
  );
}

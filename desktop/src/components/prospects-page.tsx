import { Edit, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { useState } from "react";
import EditProspectListViewItemDialog from "./edit-prospect-list-view-item-dialog";
import { ProspectFieldDefinition } from "@/lib/prospects/prospect-data-definition";
import { slotToProspectDataType } from "@/lib/prospects/slot-to-prospect-data-type";
import { exampleSlot } from "./prospects-template-page";

const exampleProspectDataDefinition = slotToProspectDataType(exampleSlot);

export default function ProspectsPage() {
  const [isEditListViewOpen, setIsEditListViewOpen] = useState(false);
  const [listView, setListView] = useState<ProspectFieldDefinition[]>([]);

  return (
    <Card className="min-h-full">
      <CardHeader>
        <div className="flex w-full items-center justify-between">
          <div>
            <CardTitle>Prospects</CardTitle>
            <CardDescription>Manage your team&apos;s prospects</CardDescription>
          </div>

          <div className="space-x-2">
            <Button asChild>
              <Link to="new">
                <Plus />
                <span className="sr-only">Add Prospect</span>
              </Link>
            </Button>

            <Button
              variant="secondary"
              onClick={() => setIsEditListViewOpen(true)}
              disabled={isEditListViewOpen}
            >
              <Edit />
              <span className="sr-only">Edit Prospect List View</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent></CardContent>

      <EditProspectListViewItemDialog
        isOpen={isEditListViewOpen}
        requestClose={() => setIsEditListViewOpen(false)}
        listView={listView}
        setListView={setListView}
        fullPropsectDataDefinition={exampleProspectDataDefinition}
      />
    </Card>
  );
}

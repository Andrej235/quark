import EditProspectListViewItemDialog from "@/components/edit-prospect-list-view-item-dialog";
import ProspectsTable from "@/components/prospects-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit } from "lucide-react";
import { useState } from "react";

export default function ArchivedProspectsPage() {
  const [isEditListViewOpen, setIsEditListViewOpen] = useState(false);

  return (
    <Card className="min-h-full">
      <CardHeader>
        <div className="flex w-full items-center justify-between">
          <div>
            <CardTitle>Archived Prospects</CardTitle>
            <CardDescription>View your archived prospects</CardDescription>
          </div>

          <div className="space-x-2">
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

      <CardContent>
        <ProspectsTable />
      </CardContent>

      <EditProspectListViewItemDialog
        isOpen={isEditListViewOpen}
        requestClose={() => setIsEditListViewOpen(false)}
      />
    </Card>
  );
}

import { Edit, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import EditProspectListViewItemDialog from "./edit-prospect-list-view-item-dialog";
import ProspectsTable from "./prospects-table";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

export default function ProspectsPage() {
  const [isEditListViewOpen, setIsEditListViewOpen] = useState(false);

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

import { Slot } from "@/lib/prospect-template/slot";
import RenderSlotTree from "./prospect-template/render-slot-tree";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const exampleSlot: Slot = {
  id: "root",
  type: "column",
  content: [
    {
      id: "row-1",
      type: "row",
      content: [
        {
          flex: 2,
          slot: {
            id: "company-name-slot",
            type: "text-field",
            name: "Company Name",
            placeholder: "Enter company name",
          },
        },
        {
          flex: 1,
          slot: {
            id: "logo-slot",
            type: "image-field",
            name: "Logo",
          },
        },
      ],
    },
    {
      id: "description",
      type: "text-field",
      name: "Description",
      placeholder: "Enter a brief description",
    },
    {
      id: "contact-info",
      type: "card",
      header: {
        id: "contact-info-header",
        type: "card-header",
        title: "Contact Information",
        description: "Details about the contact person",
      },
      content: {
        id: "contact-info-content",
        type: "column",
        content: [
          {
            id: "contact-name",
            type: "text-field",
            name: "Contact Name",
            placeholder: "Enter contact name",
          },
          {
            id: "email",
            type: "text-field",
            name: "Email",
            placeholder: "Enter email address",
          },
        ],
      },
      footer: {
        id: "contact-info-footer",
        type: "card-footer",
        buttons: [
          {
            id: "save-button",
            type: "button",
            label: "Save",
          },
        ],
      },
    },
  ],
};

export default function ProspectsTemplatePage() {
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
        <RenderSlotTree slot={exampleSlot} editMode />
      </CardContent>
    </Card>
  );
}

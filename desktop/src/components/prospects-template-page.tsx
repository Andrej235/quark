import { Slot } from "@/lib/prospect-template/slot";
import RenderSlot from "./prospect-template/render-slot";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const exampleSlot: Slot = {
  type: "column",
  content: [
    {
      type: "row",
      content: [
        {
          flex: 2,
          slot: {
            type: "text-field",
            name: "Company Name",
            placeholder: "Enter company name",
          },
        },
        {
          flex: 1,
          slot: {
            type: "image-field",
            name: "Logo",
          },
        },
      ],
    },
    {
      type: "text-field",
      name: "Description",
      placeholder: "Enter a brief description",
    },
    {
      type: "card",
      header: {
        type: "card-header",
        title: "Contact Information",
        description: "Details about the contact person",
      },
      content: {
        type: "column",
        content: [
          {
            type: "text-field",
            name: "Contact Name",
            placeholder: "Enter contact name",
          },
          {
            type: "text-field",
            name: "Email",
            placeholder: "Enter email address",
          },
        ],
      },
      footer: {
        type: "card-footer",
        buttons: [
          {
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
        <RenderSlot slot={exampleSlot} />
      </CardContent>
    </Card>
  );
}

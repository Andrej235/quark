import { Slot } from "@/lib/prospect-template/slot";
import { cn } from "@/lib/utils";
import { useSlotSelectorStore } from "@/stores/slot-selector-store";
import {
  Columns3,
  CreditCard,
  Image,
  LucideIcon,
  Rows3,
  Text,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import RenderSlot from "./render-slot";

const slotOptions: Omit<SlotItemProps, "onSelect" | "selected">[] = [
  {
    name: "Text Field",
    icon: Text,
    slot: {
      id: "new-text-field",
      type: "text-field",
      name: "New Text Field",
      placeholder: "Enter text",
    },
  },
  {
    name: "Image Field",
    icon: Image,
    slot: {
      id: "new-image-field",
      type: "image-field",
      name: "New Image Field",
    },
  },
  {
    name: "Row",
    icon: Columns3,
    slot: {
      id: "new-row",
      type: "row",
      content: [],
    },
  },
  {
    name: "Column",
    icon: Rows3,
    slot: {
      id: "new-column",
      type: "column",
      content: [],
    },
  },
  {
    name: "Card",
    icon: CreditCard,
    slot: {
      id: "new-card",
      type: "card",
      header: {
        id: "new-card-header",
        type: "card-header",
        title: "New Card",
        description: "Description",
      },
      content: null,
    },
  },
];

export default function SlotSelectorDialog() {
  const isOpen = useSlotSelectorStore((state) => state.isOpen);
  const close = useSlotSelectorStore((state) => state.close);
  const submit = useSlotSelectorStore((state) => state.submit);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    if (isOpen) setSelectedSlot(null);
  }, [isOpen]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-h-[50vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Select a slot</DialogTitle>
          <DialogDescription>
            Please chose a slot you would like to add
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {slotOptions.map((option) => (
            <SlotItem
              key={option.slot.type}
              name={option.name}
              icon={option.icon}
              slot={option.slot}
              onSelect={setSelectedSlot}
              selected={selectedSlot?.type === option.slot.type}
            />
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>

          <Button
            onClick={() => submit(selectedSlot!)}
            disabled={!selectedSlot}
          >
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type SlotItemProps = {
  name: string;
  icon: LucideIcon;
  slot: Slot;
  onSelect: (slot: Slot) => void;
  selected: boolean;
};

function SlotItem({
  name,
  onSelect,
  slot,
  selected,
  icon: Icon,
}: SlotItemProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-48 w-full flex-col rounded-md p-2",
        selected && "ring-primary ring-2",
      )}
    >
      <div className="mb-8 flex items-center justify-center gap-2">
        <h2 className="font-bold">{name}</h2>
        <Icon />
      </div>

      <RenderSlot slot={slot} forceNoEditMode />

      <button
        className="-translate-1/2 absolute left-1/2 top-1/2 z-50 size-full"
        onClick={() => onSelect(slot)}
      >
        <span className="sr-only">Select {name}</span>
      </button>
    </div>
  );
}

import { cn } from "@/lib/cn";
import { defaultSlots } from "@/lib/prospects/slots/defaults/default-slots";
import { Slot } from "@/lib/prospects/types/generalized-slots/slot";
import { useSlotSelectorStore } from "@/stores/slot-selector-store";
import {
  ChevronDown,
  Columns3,
  CreditCard,
  Image,
  LucideIcon,
  Rows3,
  Text,
  Type,
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
    slot: defaultSlots["text-field"],
  },
  {
    name: "Rich Text Field",
    icon: Type,
    slot: defaultSlots["rich-text-field"],
  },
  {
    name: "Image Field",
    icon: Image,
    slot: defaultSlots["image-field"],
  },
  {
    name: "Dropdown",
    icon: ChevronDown,
    slot: defaultSlots["dropdown"],
  },
  {
    name: "Row",
    icon: Columns3,
    slot: defaultSlots["row"],
  },
  {
    name: "Column",
    icon: Rows3,
    slot: defaultSlots["column"],
  },
  {
    name: "Card",
    icon: CreditCard,
    slot: defaultSlots["card"],
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
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) close();
      }}
    >
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
              onSelect={(slot, doubleClick) =>
                doubleClick ? submit(slot) : setSelectedSlot(slot)
              }
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
  onSelect: (slot: Slot, doubleClick?: boolean) => void;
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
        onDoubleClick={() => onSelect(slot, true)}
      >
        <span className="sr-only">Select {name}</span>
      </button>
    </div>
  );
}

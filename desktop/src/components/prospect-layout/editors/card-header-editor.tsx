import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SlotEditorProps } from "@/lib/prospects/types/slots-utility/slot-editor-prop";
import { CardHeaderSlot } from "@/lib/prospects/types/slots/card-header-slot";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { ChangeEvent } from "react";

export default function CardHeaderEditor({
  slot,
  setLocalSlot,
}: SlotEditorProps<CardHeaderSlot>) {
  const update = useSlotTreeRootStore((x) => x.updateSlot<CardHeaderSlot>);

  function handleLocalChange(
    property: Exclude<keyof CardHeaderSlot, "type">,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const value = e.target.value;
    setLocalSlot({ ...slot, [property]: value });
  }

  function handleChange(
    property: Exclude<keyof CardHeaderSlot, "type">,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const value = e.target.value.trim();
    update(slot.id, (x) => {
      x[property] = value;
    });
  }

  return (
    <>
      <div className="space-y-2">
        <Label className="text-muted-foreground text-sm" htmlFor="title">
          Title
        </Label>

        <Input
          id="title"
          value={slot.title}
          onChange={(e) => handleLocalChange("title", e)}
          onBlur={(e) => handleChange("title", e)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground text-sm" htmlFor="description">
          Description
        </Label>

        <Textarea
          id="description"
          value={slot.description}
          onChange={(e) => handleLocalChange("description", e)}
          onBlur={(e) => handleChange("description", e)}
        />
      </div>
    </>
  );
}

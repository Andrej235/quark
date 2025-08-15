import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SlotEditorProps } from "@/lib/prospects/types/slots-utility/slot-editor-prop";
import { TextFieldSlot } from "@/lib/prospects/types/slots/text-field-slot";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { ChangeEvent } from "react";

export default function TextFieldEditor({
  slot,
  setLocalSlot,
}: SlotEditorProps<TextFieldSlot>) {
  const update = useSlotTreeRootStore((x) => x.updateSlot<TextFieldSlot>);

  function handleLocalChange(
    property: Exclude<keyof TextFieldSlot, "type">,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const value = e.target.value;
    setLocalSlot({ ...slot, [property]: value });
  }

  function handleChange(
    property: Exclude<keyof TextFieldSlot, "type">,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const value = e.target.value.trim();
    update(slot.id, (x) => {
      x[property] = value;
    });
  }

  return (
    <>
      <div className="space-y-2">
        <Label className="text-muted-foreground text-sm" htmlFor="label">
          Label
        </Label>

        <Input
          id="label"
          value={slot.name}
          onChange={(e) => handleLocalChange("name", e)}
          onBlur={(e) => handleChange("name", e)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground text-sm" htmlFor="placeholder">
          Placeholder
        </Label>

        <Input
          id="placeholder"
          value={slot.placeholder}
          onChange={(e) => handleLocalChange("placeholder", e)}
          onBlur={(e) => handleChange("placeholder", e)}
        />
      </div>
    </>
  );
}

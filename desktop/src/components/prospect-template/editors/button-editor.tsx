import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonSlot } from "@/lib/prospects/types/slots/button-slot";
import { SlotEditorProps } from "@/lib/prospects/types/slots-utility/slot-editor-prop";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { ChangeEvent } from "react";

export default function ButtonEditor({
  slot,
  setLocalSlot,
}: SlotEditorProps<ButtonSlot>) {
  const update = useSlotTreeRootStore((x) => x.updateSlot<ButtonSlot>);

  function handleLocalChange(
    property: Exclude<keyof ButtonSlot, "type">,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const value = e.target.value;
    setLocalSlot({ ...slot, [property]: value });
  }

  function handleChange(
    property: Exclude<keyof ButtonSlot, "type" | "inputTypes">,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const value = e.target.value.trim();
    update(slot.id, (x) => {
      x[property] = value as never;
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
          value={slot.label}
          onChange={(e) => handleLocalChange("label", e)}
          onBlur={(e) => handleChange("label", e)}
        />
      </div>

      <div className="flex gap-8">
        <div className="flex-1 space-y-2">
          <Label className="text-muted-foreground" htmlFor="variant">
            Variant:
          </Label>

          <Select
            value={slot.variant}
            onValueChange={(e) =>
              handleChange("variant", {
                target: { value: e },
              } as ChangeEvent<HTMLInputElement>)
            }
          >
            <SelectTrigger
              id="variant"
              className={buttonVariants({
                className: "w-full justify-between",
                variant: "outline",
              })}
            >
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="destructive">Destructive</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <Label className="text-muted-foreground" htmlFor="size">
            Size:
          </Label>

          <Select
            value={slot.size}
            onValueChange={(e) =>
              handleChange("size", {
                target: { value: e },
              } as ChangeEvent<HTMLInputElement>)
            }
          >
            <SelectTrigger
              id="size"
              className={buttonVariants({
                className: "w-full justify-between",
                variant: "outline",
              })}
            >
              <SelectValue placeholder="Select size" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  useIsSlotInEditMode,
  useIsSlotReadonly,
} from "@/contexts/slot-tree-context";
import { useSubscribeSlotToEventSystem } from "@/lib/prospects/slots/hooks/use-subscribe-slot-to-event-system";
import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import type { DropdownSlot as DropdownSlotType } from "@/lib/prospects/types/slots/dropdown-slot";
import { useEffect, useState } from "react";

export default function DropdownSlot({
  slot,
}: RenderSlotProps<DropdownSlotType>) {
  const { id, name, placeholder, defaultValue } = slot;
  const isEditing = useIsSlotInEditMode();
  const readonly = useIsSlotReadonly();
  const [selected, setSelected] = useState<string | null>(null);

  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selected) {
      if (slot.required) setError("This field is required");
      return;
    }

    setError(
      slot.options.some((x) => x.value === selected)
        ? ""
        : "Please select a valid option",
    );
  }, [selected, touched, slot]);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  useSubscribeSlotToEventSystem(slot, selected, setSelected);

  return (
    <div>
      <Label htmlFor={id} className="gap-1">
        <span>{name}</span>
        {slot.required && !readonly && <span>*</span>}
      </Label>

      <Select
        value={selected || ""}
        onValueChange={
          !readonly ? (x) => setSelected(x === "null" ? null : x) : undefined
        }
        onOpenChange={(x) => {
          if (!x) setTouched(true);
        }}
        disabled={isEditing}
      >
        <SelectTrigger className="cursor-auto! mt-2">
          {selected || placeholder}
        </SelectTrigger>

        <SelectContent>
          {!slot.required && <SelectItem value="null">None</SelectItem>}

          {slot.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {touched && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SlotEditorProps } from "@/lib/prospects/types/slots-utility/slot-editor-props";
import { DropdownSlot } from "@/lib/prospects/types/slots/dropdown-slot";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import ColorPicker, { Color } from "@rc-component/color-picker";
import "@rc-component/color-picker/assets/index.css";
import { Plus, Trash2 } from "lucide-react";
import { ChangeEvent } from "react";

export default function DropdownEditor({
  slot,
  setLocalSlot,
}: SlotEditorProps<"dropdown">) {
  const update = useSlotTreeRootStore((x) => x.updateSlot<DropdownSlot>);

  function handleLocalChange(
    property: Exclude<keyof DropdownSlot, "type">,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const value = e.target.value;

    setLocalSlot({ ...slot, [property]: value });
  }

  function handleChange(
    property: Exclude<keyof DropdownSlot, "type" | "required" | "options">,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const value = e.target.value;
    update(slot.id, (x) => {
      x[property] = value;
    });
  }

  function handleRequiredChange(required: boolean) {
    setLocalSlot({
      ...slot,
      required,
    });

    update(slot.id, (x) => {
      x.required = required;
    });
  }

  function handleLocalChangeOptionValue(
    option: string,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const value = e.target.value;
    setLocalSlot({
      ...slot,
      options: slot.options.map((x) => {
        if (x.value === option) {
          return {
            ...x,
            value,
          };
        }
        return x;
      }),
      defaultValue: slot.defaultValue === option ? value : slot.defaultValue,
    });
  }

  function handleChangeOptionValue() {
    update(slot.id, (x) => {
      x.options = [...slot.options];
      x.defaultValue = slot.defaultValue;
    });
  }

  function handleLocalChangeOptionColor(option: string, e: Color) {
    const color = e.toHexString();
    setLocalSlot({
      ...slot,
      options: slot.options.map((x) => {
        if (x.value === option) {
          return {
            ...x,
            color,
          };
        }
        return x;
      }),
    });
  }

  function handleChangeOptionColor(option: string, e: Color) {
    const color = e.toHexString();
    update(slot.id, (x) => {
      x.options = x.options.map((x) => {
        if (x.value === option) {
          return {
            ...x,
            color,
          };
        }
        return x;
      });
    });
  }

  function handleDeleteOption(option: string) {
    update(slot.id, (x) => {
      x.options = x.options.filter((x) => x.value !== option);
      x.defaultValue = slot.defaultValue === option ? null : slot.defaultValue;
    });

    setLocalSlot({
      ...slot,
      options: slot.options.filter((x) => x.value !== option),
      defaultValue: slot.defaultValue === option ? null : slot.defaultValue,
    });
  }

  function handleAddOption() {
    const newValue = getNewValue();

    setLocalSlot({
      ...slot,
      options: [...slot.options, { value: newValue, color: "#000000" }],
    });

    update(slot.id, (x) => {
      x.options = [...x.options, { value: newValue, color: "#000000" }];
    });

    function getNewValue(): string {
      const baseId = "New Option";
      const ids = slot.options.map((x) => x.value);
      if (!ids.includes(baseId)) return baseId;

      // Find all slot ids that start with baseId + " "
      const filteredIds = ids.filter((x) => x.startsWith(baseId + " "));

      // Extract numeric suffixes
      const suffixNumbers = filteredIds
        .map((x) => {
          const match = x.match(new RegExp(`^${baseId} (\\d+)$`));
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((n) => n > 0);

      // Find max suffix and increment
      const maxSuffix = suffixNumbers.length ? Math.max(...suffixNumbers) : 0;
      const newId = `${baseId} ${maxSuffix + 1}`;
      return newId;
    }
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

      <div>
        <Label className="text-muted-foreground text-sm" htmlFor="options">
          Options
        </Label>

        <ul className="mt-2 space-y-2 pl-4" id="options">
          {slot.options.map((option, index) => (
            <li key={index} className="flex items-center gap-2">
              <Input
                value={option.value}
                onChange={(e) => handleLocalChangeOptionValue(option.value, e)}
                onBlur={handleChangeOptionValue}
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    style={{
                      backgroundColor: option.color,
                    }}
                    variant="ghost"
                    className="w-24 hover:opacity-80"
                  >
                    {option.color}
                  </Button>
                </PopoverTrigger>

                <PopoverContent>
                  <ColorPicker
                    disabledAlpha
                    onChange={(x) =>
                      handleLocalChangeOptionColor(option.value, x)
                    }
                    onChangeComplete={(x) =>
                      handleChangeOptionColor(option.value, x)
                    }
                    value={option.color}
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteOption(option.value)}
              >
                <Trash2 />
              </Button>
            </li>
          ))}

          <li className="mt-2 flex justify-center">
            <Button variant="ghost" size="icon" onClick={handleAddOption}>
              <Plus />
            </Button>
          </li>
        </ul>
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground text-sm" htmlFor="defaultValue">
          Default Value
        </Label>

        <Select
          value={slot.defaultValue || ""}
          onValueChange={(value) => {
            const e = {
              target: { value: value === "null" ? null : value },
            } as ChangeEvent<HTMLInputElement>;

            handleLocalChange("defaultValue", e);
            handleChange("defaultValue", e);
          }}
        >
          <SelectTrigger className="cursor-auto! mt-2 min-w-48">
            {slot.defaultValue || "None"}
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="null">None</SelectItem>

            {slot.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Label htmlFor="required" className="text-muted-foreground text-sm">
          Required
        </Label>

        <Checkbox
          id="required"
          checked={slot.required}
          onCheckedChange={handleRequiredChange}
        />
      </div>
    </>
  );
}

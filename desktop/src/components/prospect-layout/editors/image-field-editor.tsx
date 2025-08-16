import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SlotEditorProps } from "@/lib/prospects/types/slots-utility/slot-editor-prop";
import { ImageFieldSlot } from "@/lib/prospects/types/slots/image-field-slot";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { ChangeEvent } from "react";

export default function ImageFieldEditor({
  slot,
  setLocalSlot,
}: SlotEditorProps<ImageFieldSlot>) {
  const update = useSlotTreeRootStore((x) => x.updateSlot<ImageFieldSlot>);

  function handleLocalChange(
    property: Exclude<keyof ImageFieldSlot, "type">,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const value = e.target.value;
    setLocalSlot({ ...slot, [property]: value });
  }

  function handleChange(
    property: Exclude<keyof ImageFieldSlot, "type" | "inputTypes">,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const value = e.target.value.trim();

    update(slot.id, (x) => {
      // As never is needed because x[property] can either be a string or a value and so it's looking for a (string & number) which turns into never
      x[property] = (
        property === "compressionQuality" ? +value || 0 : value
      ) as never;
    });
  }

  function handleChangeSavedAs(value: string) {
    const savedAs =
      value === "null" ? null : (value as ImageFieldSlot["savedAs"]);

    setLocalSlot({ ...slot, savedAs });
    update(slot.id, (x) => {
      x.savedAs = savedAs;
    });
  }

  function handleInputTypeChange(
    inputType: "png" | "jpg" | "webp" | "gif" | "svg",
    checked: boolean,
  ) {
    const newInputTypes = checked
      ? [...slot.inputTypes, inputType]
      : slot.inputTypes.filter((x) => x !== inputType);

    setLocalSlot({
      ...slot,
      inputTypes: newInputTypes,
    });

    update(slot.id, (x) => {
      x.inputTypes = [...slot.inputTypes, inputType];
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

      <div className="flex gap-8">
        <div className="flex-1 space-y-2">
          <Label className="text-muted-foreground" htmlFor="allowed-types">
            Allowed types:
          </Label>

          <DropdownMenu>
            <DropdownMenuTrigger id="allowed-types" className="w-full" asChild>
              <Button variant="outline" className="w-full justify-start">
                {slot.inputTypes.length > 0
                  ? slot.inputTypes.join(", ")
                  : "No types selected"}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={slot.inputTypes.includes("png")}
                onCheckedChange={(checked) =>
                  handleInputTypeChange("png", checked)
                }
              >
                .png
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={slot.inputTypes.includes("jpg")}
                onCheckedChange={(checked) =>
                  handleInputTypeChange("jpg", checked)
                }
              >
                .jpg
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={slot.inputTypes.includes("webp")}
                onCheckedChange={(checked) =>
                  handleInputTypeChange("webp", checked)
                }
              >
                .webp
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={slot.inputTypes.includes("gif")}
                onCheckedChange={(checked) =>
                  handleInputTypeChange("gif", checked)
                }
              >
                .gif
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={slot.inputTypes.includes("svg")}
                onCheckedChange={(checked) =>
                  handleInputTypeChange("svg", checked)
                }
              >
                .svg
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 space-y-2">
          <Label className="text-muted-foreground" htmlFor="allowed-types">
            Image saved as:
          </Label>

          <Select
            value={slot.savedAs ?? "Same as uploaded"}
            onValueChange={handleChangeSavedAs}
          >
            <SelectTrigger
              className={buttonVariants({
                className: "w-full justify-between",
                variant: "outline",
              })}
            >
              {slot.savedAs ?? "Same as uploaded"}
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="null">Same as uploaded</SelectItem>
              <SelectItem value="png">.png</SelectItem>
              <SelectItem value="jpg">.jpg</SelectItem>
              <SelectItem value="webp">.webp</SelectItem>
              <SelectItem value="gif">.gif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          className="text-muted-foreground text-sm"
          htmlFor="compression-quality-slider"
        >
          Compression Quality
        </Label>

        <div className="grid grid-cols-[1fr_4rem]">
          <Slider
            id="compression-quality-slider"
            value={[slot.compressionQuality * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => {
              handleLocalChange("compressionQuality", {
                target: { value: values[0] / 100 },
              } as unknown as ChangeEvent<HTMLInputElement>);
            }}
          />

          <p className="ml-auto select-none">
            {Math.floor(slot.compressionQuality * 100)}%
          </p>
        </div>
      </div>
    </>
  );
}

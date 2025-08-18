import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/cn";
import { DeserializeRegex, SerializeRegex } from "@/lib/format/serialize-regex";
import toTitleCase from "@/lib/format/title-case";
import { SlotEditorProps } from "@/lib/prospects/types/slots-utility/slot-editor-props";
import { TextFieldSlot } from "@/lib/prospects/types/slots/text-field-slot";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { ChangeEvent, useEffect, useState } from "react";
import { isSafe } from "redos-detector";
import { toast } from "sonner";

export default function TextFieldEditor({
  slot,
  setLocalSlot,
}: SlotEditorProps<"text-field">) {
  const update = useSlotTreeRootStore((x) => x.updateSlot<TextFieldSlot>);
  const [formatTestValue, setFormatTestValue] = useState("");
  const [customFormat, setCustomFormat] = useState("");
  const [isCustomFormatSafe, setIsCustomFormatSafe] = useState(true);

  useEffect(() => {
    setIsCustomFormatSafe(true);
    setCustomFormat(
      slot.validateFormat === "custom"
        ? DeserializeRegex(slot.formatRegex).source
        : "^",
    );
  }, [slot]);

  function handleLocalChange(
    property: Exclude<keyof TextFieldSlot, "type">,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const value =
      property === "formatRegex"
        ? SerializeRegex(new RegExp(e.target.value, ""))
        : e.target.value;

    setLocalSlot({ ...slot, [property]: value });
  }

  function handleChange(
    property: Exclude<
      keyof TextFieldSlot,
      "type" | "validateFormat" | "required"
    >,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const value =
      property === "formatRegex"
        ? SerializeRegex(new RegExp(e.target.value, ""))
        : e.target.value;

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

  function handleChangeFormat(value: TextFieldSlot["validateFormat"]) {
    const [format, error] = expandFormat(value);

    setLocalSlot({
      ...slot,
      validateFormat: value,
      validateFormatError: error,
      formatRegex: format,
    });

    update(slot.id, (x) => {
      x.validateFormat = value;
      x.validateFormatError = error;
      x.formatRegex = format;
    });
  }

  function expandFormat(
    format: TextFieldSlot["validateFormat"],
  ): [string, string] {
    switch (format) {
      case "email":
        return [
          SerializeRegex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
          "Invalid email address",
        ];
      case "phone":
        return [
          SerializeRegex(
            /^(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
          ),
          "Invalid phone number",
        ];
      case "url":
        return [
          SerializeRegex(
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/,
          ),
          "Invalid URL",
        ];
      case "letters":
        return [SerializeRegex(/^[a-zA-Z]*$/), "Must only contain letters"];
      case "numbers":
        return [SerializeRegex(/^[0-9]*$/), "Must only contain numbers"];
      case "alphanumeric":
        return [
          SerializeRegex(/^[a-zA-Z0-9]*$/),
          "Must only contain letters and numbers",
        ];

      default:
        return [SerializeRegex(/^/), ""];
    }
  }

  function handleCustomFormatChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const regex = new RegExp(value, "");
    const newFormat = SerializeRegex(regex);

    const safe = isSafe(regex).safe;
    setIsCustomFormatSafe(safe);
    if (!safe) {
      toast.error("Entered regex is subject to a ReDoS attack", {
        description: "It will be discarded upon closing this dialog",
        duration: 7_500,
        className: "min-w-max",
      });

      return;
    }

    setLocalSlot({
      ...slot,
      validateFormat: "custom",
      formatRegex: newFormat,
    });

    update(slot.id, (x) => {
      x.validateFormat = "custom";
      x.formatRegex = newFormat;
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

      <div className="space-y-2">
        <Label className="text-muted-foreground text-sm" htmlFor="validation">
          Validation Pattern
        </Label>

        <div className="grid grid-cols-[2fr_1fr] gap-4">
          <Select
            value={slot.validateFormat ?? "none"}
            onValueChange={handleChangeFormat}
          >
            <SelectTrigger
              className={buttonVariants({
                className: "w-full justify-between",
                variant: "outline",
              })}
            >
              {toTitleCase(slot.validateFormat ?? "none")}
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="url">Url</SelectItem>
              <SelectItem value="letters">Letters</SelectItem>
              <SelectItem value="numbers">Numbers</SelectItem>
              <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Test</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test selected validation format</DialogTitle>
                <DialogDescription>
                  Enter some text below and watch for when the error is visible
                </DialogDescription>
              </DialogHeader>

              <Input
                value={formatTestValue}
                onChange={(e) => setFormatTestValue(e.target.value)}
                placeholder="Enter text here"
              />

              <DialogFooter>
                <p
                  className={cn(
                    "text-muted-foreground hidden text-sm",
                    !DeserializeRegex(slot.formatRegex).test(formatTestValue) &&
                      "block",
                  )}
                >
                  {slot.validateFormatError}
                </p>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {slot.validateFormat === "custom" && (
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm" htmlFor="regex">
            Custom Pattern (Regex)
          </Label>

          <Input
            id="regex"
            value={customFormat}
            onChange={(e) => setCustomFormat(e.target.value)}
            onBlur={handleCustomFormatChange}
          />

          {!isCustomFormatSafe && (
            <p className="text-destructive text-sm">
              This regex is subject to a ReDoS attack, please change it.
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-muted-foreground text-sm" htmlFor="error">
          Validation Error
        </Label>

        <Input
          id="error"
          value={slot.validateFormatError}
          onChange={(e) => handleLocalChange("validateFormatError", e)}
          onBlur={(e) => handleChange("validateFormatError", e)}
        />
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

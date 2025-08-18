import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useIsSlotInEditMode,
  useIsSlotReadonly,
} from "@/contexts/slot-tree-context";
import { useSubscribeSlotToEventSystem } from "@/lib/prospects/slots/hooks/use-subscribe-slot-to-event-system";
import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import type { ImageFieldSlot as ImageFieldSlotType } from "@/lib/prospects/types/slots/image-field-slot";
import { Upload } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

export default function ImageFieldSlot({
  slot,
}: RenderSlotProps<ImageFieldSlotType>) {
  const isEditing = useIsSlotInEditMode();
  const readonly = useIsSlotReadonly();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!imagePreview) {
      setError(slot.required ? "This field is required" : "");
      return;
    }

    setError("");
  }, [imagePreview, touched, slot]);

  useSubscribeSlotToEventSystem({
    slot,
    valueState: imagePreview,
    setState: setImagePreview,
    onReadValue: () => setTouched(true),
  });

  const handleImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Label htmlFor={slot.id}>
        <span>{slot.name}</span>
        {slot.required && !readonly && <span>*</span>}
      </Label>

      <div className="mt-2 flex items-center gap-4">
        {imagePreview ? (
          <div className="border-border bg-muted h-16 w-16 overflow-hidden rounded-lg border-2">
            <img
              src={imagePreview}
              alt={`Preview of ${slot.name}`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="border-border bg-muted flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed">
            <Upload className="text-muted-foreground h-6 w-6" />
          </div>
        )}

        <div className="flex-1">
          <div className="flex">
            <Input
              id={slot.id}
              type="file"
              accept="image/*"
              onChange={handleImageInput}
              className="cursor-pointer"
              disabled={isEditing}
            />

            <Button
              variant="secondary"
              className="ml-2"
              onClick={() => setImagePreview(null)}
              disabled={!imagePreview || isEditing}
            >
              Clear
            </Button>
          </div>

          <p className="text-muted-foreground mt-1 text-sm">
            Upload an image of type: {slot.inputTypes.join(", ")}
          </p>

          {touched && <p className="text-destructive text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}

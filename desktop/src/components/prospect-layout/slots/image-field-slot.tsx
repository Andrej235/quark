import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsSlotInEditMode } from "@/contexts/slot-tree-context";
import { useSubscribeSlotToEventSystem } from "@/lib/prospects/slots/hooks/use-subscribe-slot-to-event-system";
import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import type { ImageFieldSlot as ImageFieldSlotType } from "@/lib/prospects/types/slots/image-field-slot";
import { Upload } from "lucide-react";
import { ChangeEvent, useState } from "react";

export default function ImageFieldSlot({
  slot,
}: RenderSlotProps<ImageFieldSlotType>) {
  const { name } = slot;
  const isEditing = useIsSlotInEditMode();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useSubscribeSlotToEventSystem({
    slot,
    valueState: imagePreview,
    setState: setImagePreview,
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
      <Label htmlFor={name}>{name}</Label>
      <div className="mt-2 flex items-center gap-4">
        {imagePreview ? (
          <div className="border-border bg-muted h-16 w-16 overflow-hidden rounded-lg border-2">
            <img
              src={imagePreview}
              alt={`Preview of ${name}`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="border-border bg-muted flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed">
            <Upload className="text-muted-foreground h-6 w-6" />
          </div>
        )}

        <div className="flex-1">
          <Input
            id={name}
            type="file"
            accept="image/*"
            onChange={handleImageInput}
            className="cursor-pointer"
            disabled={isEditing}
          />
          <p className="text-muted-foreground mt-1 text-sm">
            Upload a square image (PNG, JPG, or SVG)
          </p>
        </div>
      </div>
    </div>
  );
}

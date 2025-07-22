import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageFieldSlot as ImageFieldSlotType } from "@/lib/prospect-template/image-field-slot";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { Upload } from "lucide-react";
import { ChangeEvent, useState } from "react";

export default function ImageFieldSlot({
  slot,
}: RenderSlotProps<ImageFieldSlotType>) {
  const { name } = slot;
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    <>
      <Label htmlFor={name}>{name}</Label>
      <div className="flex items-center gap-4 mt-2">
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
          />
          <p className="text-muted-foreground mt-1 text-sm">
            Upload a square image (PNG, JPG, or SVG)
          </p>
        </div>
      </div>
    </>
  );
}

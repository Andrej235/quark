import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useIsSlotInEditMode,
  useIsSlotReadonly,
} from "@/contexts/slot-tree-context";
import { useSubscribeSlotToEventSystem } from "@/lib/prospects/slots/hooks/use-subscribe-slot-to-event-system";
import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import type { ImageFieldSlot as ImageFieldSlotType } from "@/lib/prospects/types/slots/image-field-slot";
import { Download, Image, Maximize2, Upload } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

export default function ImageFieldSlot({
  slot,
}: RenderSlotProps<ImageFieldSlotType>) {
  const isEditing = useIsSlotInEditMode();
  const readonly = useIsSlotReadonly();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [maximizeDialogOpen, setMaximizeDialogOpen] = useState(false);

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
      <Label htmlFor={slot.id} className="mb-2">
        <span>{slot.name}</span>
        {slot.required && !readonly && <span>*</span>}
      </Label>

      {!readonly && (
        <div className="flex items-center gap-4">
          {imagePreview ? (
            <div className="border-border bg-muted size-16 overflow-hidden rounded-lg border-2">
              <img
                src={imagePreview}
                alt={`Preview of ${slot.name}`}
                className="size-full object-cover"
              />
            </div>
          ) : (
            <div className="border-border bg-muted flex size-16 items-center justify-center rounded-lg border-2 border-dashed">
              <Upload className="text-muted-foreground" />
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
      )}

      {readonly && (
        <div className="flex items-center gap-4">
          <div className="border-border bg-muted size-16 overflow-hidden rounded-lg border-2">
            {imagePreview ? (
              <div className="group relative size-full">
                <img
                  src={imagePreview}
                  alt={`Preview of ${slot.name}`}
                  className="size-full object-cover"
                />

                <div
                  onClick={() => setMaximizeDialogOpen(true)}
                  className="bg-background/50 absolute top-0 grid size-full cursor-pointer place-items-center opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Maximize2 />
                </div>
              </div>
            ) : (
              <Image className="text-muted-foreground size-full p-4" />
            )}
          </div>

          {imagePreview && (
            <div className="flex gap-1">
              <Dialog
                open={maximizeDialogOpen}
                onOpenChange={setMaximizeDialogOpen}
              >
                <Tooltip delayDuration={500}>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Maximize2 />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Full Screen</p>
                  </TooltipContent>
                </Tooltip>

                <DialogContent>
                  <DialogHeader className="sr-only">
                    <DialogTitle>{slot.name}</DialogTitle>
                    <DialogDescription>
                      Full screen view of value for slot with an id of {slot.id}
                    </DialogDescription>
                  </DialogHeader>

                  <img
                    src={imagePreview}
                    alt={`Preview of ${slot.name}`}
                    className="size-full object-cover"
                  />
                </DialogContent>
              </Dialog>

              <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" asChild>
                    <a href={imagePreview} download={slot.id}>
                      <Download />
                    </a>
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Download Image</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

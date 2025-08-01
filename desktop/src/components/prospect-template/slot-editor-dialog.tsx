import { isSlotParent } from "@/lib/prospects/is-slot-parent";
import { RowSlot } from "@/lib/prospects/slot-types/row-slot";
import { Slot } from "@/lib/prospects/slot-types/slot";
import { SlotEditorProps } from "@/lib/prospects/slot-types/slot-editor-prop";
import { SlotFlexWrapper } from "@/lib/prospects/slot-types/slot-flex-wrapper";
import { useSlotEditorStore } from "@/stores/slot-editor-store";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { GripVertical } from "lucide-react";
import { motion, useDragControls } from "motion/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import TextFieldEditor from "./editors/text-field-editor";
import ImageFieldEditor from "./editors/image-field-editor";
import { ColumnSlot } from "@/lib/prospects/slot-types/column-slot";

export default function SlotEditorDialog() {
  const editingSlot = useSlotEditorStore((x) => x.editingSlot);
  const findSlot = useSlotTreeRootStore((x) => x.findSlot);
  const updateSlot = useSlotTreeRootStore((x) => x.updateSlot);

  const [slot, setSlot] = useState<Slot | null>(null);
  const [parentSlot, setParentSlot] = useState<Slot | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null!);
  const dragControls = useDragControls();

  const isInsideFlexLayout =
    parentSlot?.type === "column" || parentSlot?.type === "row";
  const flex = isInsideFlexLayout
    ? ((
        parentSlot.content.find(
          (x) => "slot" in x && x.slot.id === editingSlot?.id,
        ) as SlotFlexWrapper
      )?.flex ?? -1)
    : -1;

  useEffect(() => {
    setSlot(editingSlot);
    setParentSlot(
      editingSlot ? findSlot((x) => isSlotParent(x, editingSlot)) : null,
    );
  }, [editingSlot, findSlot]);

  const mousePosition = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEventListener("mousemove", (event) => {
    mousePosition.current = {
      x: event.clientX,
      y: event.clientY,
    };
  });

  useEffect(() => {
    setIsOpen(!!editingSlot);

    if (!editingSlot || !containerRef.current) return;

    const offset = 25;
    const x =
      mousePosition.current.x + containerRef.current.offsetWidth / 2 + offset;
    const y = mousePosition.current.y;

    containerRef.current.style.left = `${x}px`;
    containerRef.current.style.top = `${y}px`;
  }, [editingSlot]);

  function handleChange(property: string, e: ChangeEvent<HTMLInputElement>) {
    if (!slot) return;

    const value = e.target.value;
    setSlot((prev) => ({ ...prev, [property]: value }) as Slot);
  }

  function handleLocalChangeFlex(newValue: string | number) {
    if (
      !slot ||
      !parentSlot ||
      !(parentSlot.type === "row" || parentSlot.type === "column")
    )
      return;

    const flex = parseInt(newValue.toString()) || 0;

    for (let i = 0; i < parentSlot.content.length; i++) {
      const current = parentSlot.content[i];

      if (
        ("slot" in current && current.slot.id === slot.id) ||
        (current as Slot).id === slot.id
      ) {
        parentSlot.content[i] =
          flex < 0
            ? editingSlot!
            : {
                flex,
                slot: editingSlot!,
              };

        setParentSlot({ ...parentSlot });
        break;
      }
    }
  }

  function handleChangeFlex(newValue: string | number) {
    if (
      !slot ||
      !parentSlot ||
      !(parentSlot.type === "row" || parentSlot.type === "column")
    )
      return;

    const flex = parseInt(newValue.toString()) || -1;

    for (let i = 0; i < parentSlot.content.length; i++) {
      const current = parentSlot.content[i];

      if (
        ("slot" in current && current.slot.id === slot.id) ||
        (current as Slot).id === slot.id
      ) {
        parentSlot.content[i] =
          flex < 0
            ? editingSlot!
            : {
                flex,
                slot: editingSlot!,
              };

        setParentSlot({ ...parentSlot });
        updateSlot<RowSlot | ColumnSlot>(parentSlot.id, (x) => {
          x.content = parentSlot.content;
        });
        break;
      }
    }
  }

  if (!slot) return null;

  return (
    <motion.div
      ref={containerRef}
      className="-translate-1/2 fixed left-1/2 top-1/2"
      initial={{
        scale: 0.5,
        opacity: 0,
      }}
      animate={{
        scale: isOpen ? 1 : 0.5,
        opacity: isOpen ? 1 : 0,
      }}
      drag
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{
        scale: 0.95,
      }}
      transition={{
        duration: 0.1,
      }}
      dragTransition={{
        velocity: 0,
      }}
    >
      <Card className="w-xl">
        <CardHeader
          onPointerDown={(e) => dragControls.start(e)}
          className="select-none"
        >
          <CardTitle className="flex justify-between">
            <span>Editing {editingSlot?.id}</span>

            <GripVertical className="text-muted-foreground size-5" />
          </CardTitle>

          <CardDescription>
            Control basic information about this slot
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm" htmlFor="id">
              Slot&apos;s unique identifier
            </Label>
            <Input
              id="id"
              value={slot.id}
              onChange={(e) => handleChange("id", e)}
            />
          </div>

          {isInsideFlexLayout && (
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm" htmlFor="flex">
                Flex
              </Label>

              <div className="flex items-center gap-4">
                <Input
                  id="flex"
                  value={flex < 0 ? "Automatic" : flex}
                  disabled={flex < 0}
                  readOnly={flex < 0}
                  onChange={(e) => handleLocalChangeFlex(e.target.value)}
                  onBlur={(e) => handleChangeFlex(e.target.value)}
                />

                {flex < 0 && (
                  <Button
                    variant="outline"
                    className="w-48"
                    onClick={() => handleChangeFlex(1)}
                  >
                    Set Manually
                  </Button>
                )}
                {flex >= 0 && (
                  <Button
                    variant="outline"
                    className="w-48"
                    onClick={() => handleChangeFlex(-1)}
                  >
                    Set Automatically
                  </Button>
                )}
              </div>
            </div>
          )}

          <SpecificTypeEditor slot={slot} setLocalSlot={setSlot} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SpecificTypeEditor({ slot, setLocalSlot }: SlotEditorProps) {
  switch (slot.type) {
    case "text-field":
      return <TextFieldEditor slot={slot} setLocalSlot={setLocalSlot} />;

    case "image-field":
      return <ImageFieldEditor slot={slot} setLocalSlot={setLocalSlot} />;

    default:
      return null;
  }
}

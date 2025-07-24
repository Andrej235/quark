import { LayoutSlot } from "@/lib/prospect-template/layout-slot";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import toTitleCase from "@/lib/title-case";
import { cn } from "@/lib/utils";
import { useSlotHoverStackStore } from "@/stores/slot-hover-stack-store";
import { useSlotLayoutModeStore } from "@/stores/slot-layout-edit-store";
import {
  AlignEndHorizontal,
  AlignStartHorizontal,
  Edit3,
  Grip,
  LayoutTemplate,
  MousePointerClick,
  Sparkles,
  Text,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { ReactNode, useEffect } from "react";
import LayoutAlignmentMenu from "../layout-alignment-menu";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";

export default function SlotEditWrapper({
  slot,
  children,
}: RenderSlotProps & { children?: ReactNode }) {
  const typeName = toTitleCase(slot.type.replace("-", " "));

  const topSlot = useSlotHoverStackStore((x) => x.topSlot);
  const addToHoverStack = useSlotHoverStackStore((x) => x.addToHoverStack);
  const removeFromHoverStack = useSlotHoverStackStore(
    (x) => x.removeFromHoverStack,
  );
  const freezeHoverStack = useSlotHoverStackStore((x) => x.freezeHoverStack);

  const isLayoutSlot = "content" in slot && Array.isArray(slot.content);
  const isInputSlot = slot.type.endsWith("-field");
  const isInteractiveSlot = slot.type === "button";

  const editingLayoutRoot = useSlotLayoutModeStore((x) => x.layoutRoot);
  const enterLayoutMode = useSlotLayoutModeStore((x) => x.enterLayoutMode);
  const isMovableDueToLayoutMode = useSlotLayoutModeStore(
    (x) => x.isSlotChildOfLayoutRoot,
  )(slot);

  useEffect(() => {
    console.log(editingLayoutRoot);
  }, [editingLayoutRoot]);

  const isHovered = topSlot === slot;
  const isActive =
    editingLayoutRoot === slot || (isHovered && !editingLayoutRoot);

  return (
    <ContextMenu
      onOpenChange={(newOpen) => freezeHoverStack(newOpen ? slot : null)}
    >
      <ContextMenuTrigger
        disabled={!!editingLayoutRoot && editingLayoutRoot !== slot}
      >
        <div
          className={cn(
            "outline-border/0 **:disabled:opacity-100 relative rounded-md outline-dashed outline-2 outline-offset-8 transition-colors",
            isActive && "outline-border",
          )}
          onPointerEnter={() => {
            addToHoverStack(slot);
          }}
          onPointerLeave={() => {
            removeFromHoverStack(slot);
          }}
        >
          {children}

          <div
            className={cn(
              "text-muted-foreground absolute bottom-full right-0 flex -translate-y-4 items-center gap-1 opacity-0 transition-opacity",
              isActive && "opacity-100",
            )}
          >
            <p className="text-xs">{typeName}</p>

            {isLayoutSlot && <LayoutTemplate className="size-4" />}

            {isInputSlot && <Text className="size-4" />}

            {isInteractiveSlot && <MousePointerClick className="size-4" />}
          </div>

          {isMovableDueToLayoutMode && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: isHovered ? 1 : 0,
              }}
              transition={{
                ease: "easeOut",
                duration: 0.1,
              }}
              className="-translate-1/2 absolute left-1/2 top-1/2 z-50 size-full cursor-grab"
            >
              <motion.div
                initial={{
                  scale: 0.75,
                }}
                animate={{
                  scale: isHovered ? 1.1 : 0.9,
                }}
                transition={{
                  ease: "easeOut",
                  duration: 0.15,
                }}
                className="border-foreground/50 -translate-2.5 absolute left-0 top-0 size-12 rounded-2xl border-l-2 border-t-2"
                style={{
                  clipPath: "polygon(0 0, 50% 0, 50% 50%, 0 50%)",
                }}
              />

              <motion.div
                initial={{
                  scale: 0.75,
                }}
                animate={{
                  scale: isHovered ? 1.1 : 0.9,
                }}
                transition={{
                  ease: "easeOut",
                  duration: 0.15,
                }}
                className="border-foreground/50 absolute right-0 top-0 size-12 -translate-y-2.5 translate-x-2.5 rounded-2xl border-r-2 border-t-2"
                style={{
                  clipPath: "polygon(100% 0, 50% 0, 50% 50%, 100% 50%)",
                }}
              />

              <motion.div
                initial={{
                  scale: 0.75,
                }}
                animate={{
                  scale: isHovered ? 1.1 : 0.9,
                }}
                transition={{
                  ease: "easeOut",
                  duration: 0.15,
                }}
                className="border-foreground/50 translate-2.5 absolute bottom-0 right-0 size-12 rounded-2xl border-b-2 border-r-2"
                style={{
                  clipPath: "polygon(100% 100%, 50% 100%, 50% 50%, 100% 50%)",
                }}
              />

              <motion.div
                initial={{
                  scale: 0.75,
                }}
                animate={{
                  scale: isHovered ? 1.1 : 0.9,
                }}
                transition={{
                  ease: "easeOut",
                  duration: 0.15,
                }}
                className="border-foreground/50 absolute bottom-0 left-0 size-12 -translate-x-2.5 translate-y-2.5 rounded-2xl border-b-2 border-l-2"
                style={{
                  clipPath: "polygon(0 100%, 50% 100%, 50% 50%, 0 50%)",
                }}
              />

              <div className="absolute left-0 top-0 grid size-full place-items-center">
                <Grip className="size-8 opacity-50" />
              </div>
            </motion.div>
          )}

          {editingLayoutRoot === slot && <LayoutAlignmentMenu />}
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        <ContextMenuItem
          onClick={() => {
            console.log("edit", slot.type);
          }}
        >
          <span>Edit</span>
          <Edit3 className="ml-auto" />
        </ContextMenuItem>

        {isLayoutSlot && (
          <ContextMenuItem
            onClick={() => {
              console.log("layout", slot.type);
              enterLayoutMode(slot as LayoutSlot);
            }}
          >
            <span>Change Layout</span>
            <LayoutTemplate className="ml-auto" />
          </ContextMenuItem>
        )}

        {slot.type.includes("field") && (
          <ContextMenuItem
            onClick={() => {
              console.log("ai", slot.type);
            }}
          >
            <span>AI Settings</span>
            <Sparkles className="ml-auto" />
          </ContextMenuItem>
        )}

        {isInteractiveSlot && (
          <ContextMenuItem
            onClick={() => {
              console.log("interact", slot.type);
            }}
          >
            <span>Change Action</span>

            <MousePointerClick className="ml-auto" />
          </ContextMenuItem>
        )}

        {slot.type === "card" && (
          <>
            <ContextMenuSeparator />

            <ContextMenuLabel className="text-muted-foreground text-sm">
              Card Options
            </ContextMenuLabel>

            <ContextMenuCheckboxItem checked={!!slot.header}>
              <span>Header</span>

              <AlignStartHorizontal className="ml-auto" />
            </ContextMenuCheckboxItem>

            <ContextMenuCheckboxItem checked={!!slot.footer}>
              <span>Footer</span>

              <AlignEndHorizontal className="ml-auto" />
            </ContextMenuCheckboxItem>
          </>
        )}

        <ContextMenuSeparator />

        <ContextMenuItem variant="destructive">
          <span>Delete</span>
          <Trash2 className="ml-auto" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

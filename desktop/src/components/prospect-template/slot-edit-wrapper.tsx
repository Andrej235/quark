import { deleteSlot } from "@/lib/delete-slot";
import { canDuplicateSlot } from "@/lib/prospects/can-duplicate-slot";
import { cloneSlot } from "@/lib/prospects/clone-slot";
import { duplicateSlot } from "@/lib/prospects/duplicate-slot";
import { CardHeaderSlot } from "@/lib/prospects/slot-types/card-header-slot";
import { CardSlot } from "@/lib/prospects/slot-types/card-slot";
import { ColumnSlot } from "@/lib/prospects/slot-types/column-slot";
import { LayoutSlot } from "@/lib/prospects/slot-types/layout-slot";
import { RenderSlotProps } from "@/lib/prospects/slot-types/render-slot-props";
import { RowSlot } from "@/lib/prospects/slot-types/row-slot";
import { Slot } from "@/lib/prospects/slot-types/slot";
import { SlotFlexWrapper } from "@/lib/prospects/slot-types/slot-flex-wrapper";
import { TextFieldSlot } from "@/lib/prospects/slot-types/text-field-slot";
import { promptUserToSelectSlot } from "@/lib/select-slot";
import toTitleCase from "@/lib/title-case";
import { cn } from "@/lib/utils";
import { useSlotClipboardStore } from "@/stores/slot-clipboard-store";
import { useSlotHoverStackStore } from "@/stores/slot-hover-stack-store";
import { useSlotLayoutModeStore } from "@/stores/slot-layout-edit-store";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlignEndHorizontal,
  AlignStartHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardCopy,
  ClipboardPaste,
  Copy,
  Edit3,
  Grip,
  LayoutTemplate,
  MousePointerClick,
  Plus,
  Scissors,
  Sparkles,
  Text,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { ReactNode, useMemo, useState } from "react";
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
import RenderSlot from "./render-slot";
import { CardFooterSlot } from "@/lib/prospects/slot-types/card-footer-slot";

export default function SlotEditWrapper({
  slot,
  children,
}: RenderSlotProps & { children?: ReactNode }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const layoutRootId = useSlotLayoutModeStore((x) => x.layoutRootId);
  const isInLayoutMode = !!layoutRootId;
  const [draggingSlot, setDraggingSlot] = useState<Slot | null>(null);
  const updateSlot = useSlotTreeRootStore((x) => x.updateSlot);

  if (slot.type === "row" || slot.type === "column") {
    const layoutChildren = slot.content ?? [];

    function handleDragOver(event: DragEndEvent) {
      if (!isInLayoutMode) return;

      const { active, over } = event;
      if (active.id === over?.id) return;

      const oldIndex = layoutChildren.findIndex((x: Slot | SlotFlexWrapper) =>
        "slot" in x ? x.slot.id === active.id : x.id === active.id,
      );
      const newIndex = layoutChildren.findIndex(
        (x: Slot | SlotFlexWrapper) =>
          over && ("slot" in x ? x.slot.id === over.id : x.id === over.id),
      );

      const newChildren = arrayMove(layoutChildren, oldIndex, newIndex);

      updateSlot<RowSlot | ColumnSlot>(slot.id, (x) => {
        x.content = newChildren;
      });
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }) => {
          setDraggingSlot(active.data.current as Slot);
        }}
        onDragEnd={() => {
          setDraggingSlot(null);
        }}
        onDragOver={(e) => {
          handleDragOver(e);
        }}
      >
        <SortableContext
          items={layoutChildren.map((x) => ("slot" in x ? x.slot.id : x.id))}
          strategy={() => null}
        >
          <SlotWrapper slot={slot}>{children}</SlotWrapper>
        </SortableContext>

        <DragOverlay
          //This fixes the issue with the original item being invisible while overlay is being dropped (animated back to original position or new position)
          dropAnimation={{
            sideEffects: undefined,
          }}
        >
          {draggingSlot && <RenderSlot slot={draggingSlot} />}
        </DragOverlay>
      </DndContext>
    );
  }

  return <SlotWrapper slot={slot}>{children}</SlotWrapper>;
}

function SlotWrapper({
  slot,
  children,
}: RenderSlotProps & { children?: ReactNode }) {
  const typeName = toTitleCase(slot.type.replace("-", " "));
  const updateSlot = useSlotTreeRootStore((x) => x.updateSlot);

  const topSlotId = useSlotHoverStackStore((x) => x.topSlotId);
  const addToHoverStack = useSlotHoverStackStore((x) => x.addToHoverStack);
  const removeFromHoverStack = useSlotHoverStackStore(
    (x) => x.removeFromHoverStack,
  );
  const freezeHoverStack = useSlotHoverStackStore((x) => x.freezeHoverStack);

  const isLayoutSlot = "content" in slot && Array.isArray(slot.content);
  const isInputSlot = slot.type.endsWith("-field");
  const isInteractiveSlot = slot.type === "button";

  const editingLayoutRoot = useSlotLayoutModeStore((x) => x.layoutRootId);
  const editingLayoutRootType = useSlotLayoutModeStore((x) => x.layoutType);
  const enterLayoutMode = useSlotLayoutModeStore((x) => x.enterLayoutMode);
  const isMovableDueToLayoutMode = useSlotLayoutModeStore(
    (x) => x.isSlotChildOfLayoutRoot,
  )(slot);

  const isCutting = useSlotClipboardStore((x) => x.isCutting);
  const copiedSlot = useSlotClipboardStore((x) => x.copiedSlot);
  const copySlot = useSlotClipboardStore((x) => x.copy);
  const cutSlot = useSlotClipboardStore((x) => x.cut);
  const clearClipboard = useSlotClipboardStore((x) => x.clear);

  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: dragRef,
    transform: dragTransform,
    transition: dragTransition,
    isDragging,
  } = useSortable({
    id: slot.id,
    disabled: !isMovableDueToLayoutMode,
    data: slot,
    animateLayoutChanges: () => false,
  });

  const draggableStyle = useMemo(
    () => ({
      transform: CSS.Transform.toString(dragTransform),
      transition: dragTransition,
    }),
    [dragTransform, dragTransition],
  );

  const isHovered = topSlotId === slot.id;
  const canDuplicate = canDuplicateSlot(slot);
  const isActive =
    editingLayoutRoot === slot.id || (isHovered && !editingLayoutRoot);

  function handleMoveLeft() {
    if (!editingLayoutRoot) return;

    updateSlot<RowSlot | ColumnSlot>(editingLayoutRoot, (root) => {
      const idx = root.content
        .map((x) => ("slot" in x ? x.slot.id : x.id))
        .indexOf(slot.id);

      let newIdx = idx - 1;
      if (newIdx < 0) newIdx = root.content.length - 1;

      const newChildren = arrayMove(root.content, idx, newIdx);
      root.content = newChildren;
    });
  }

  function handleMoveRight() {
    if (!editingLayoutRoot) return;

    updateSlot<RowSlot | ColumnSlot>(editingLayoutRoot, (root) => {
      const idx = root.content
        .map((x) => ("slot" in x ? x.slot.id : x.id))
        .indexOf(slot.id);

      const newIdx = (idx + 1) % root.content.length;

      const newChildren = arrayMove(root.content, idx, newIdx);
      root.content = newChildren;
    });
  }

  async function handleAddChild() {
    if (isLayoutSlot) {
      const selectedSlot = await promptUserToSelectSlot();
      if (!selectedSlot) return;

      updateSlot<RowSlot | ColumnSlot>(slot.id, (x) =>
        x.content.push(cloneSlot(selectedSlot)),
      );
    }

    if (slot.type === "card") {
      const selectedSlot = await promptUserToSelectSlot();
      if (!selectedSlot) return;

      updateSlot<CardSlot>(
        slot.id,
        (x) => (x.content = cloneSlot(selectedSlot)),
      );
    }
  }

  function handlePaste() {
    if (!isLayoutSlot || !copiedSlot) return;

    if (!isCutting) {
      updateSlot<RowSlot | ColumnSlot>(slot.id, (x) =>
        x.content.push(cloneSlot(copiedSlot)),
      );
      return;
    }

    deleteSlot(copiedSlot);
    updateSlot<RowSlot | ColumnSlot>(slot.id, (x) =>
      x.content.push(copiedSlot),
    );
    clearClipboard();
  }

  function handleToggleCardHeader() {
    if (slot.type !== "card") return;

    if (slot.header) {
      deleteSlot(slot.header);
      return;
    }

    const newHeader: CardHeaderSlot = {
      id: "card-header",
      type: "card-header",
      title: "Card Header",
    };
    updateSlot<CardSlot>(slot.id, (x) => (x.header = newHeader));
  }

  function handleToggleCardFooter() {
    if (slot.type !== "card") return;

    if (slot.footer) {
      deleteSlot(slot.footer);
      return;
    }

    const newFooter: CardFooterSlot = {
      id: "card-footer",
      type: "card-footer",
      buttons: [],
    };
    updateSlot<CardSlot>(slot.id, (x) => (x.footer = newFooter));
  }

  return (
    <ContextMenu
      onOpenChange={(newOpen) => freezeHoverStack(newOpen ? slot.id : null)}
    >
      <ContextMenuTrigger
        disabled={!!editingLayoutRoot && editingLayoutRoot !== slot.id}
      >
        <div
          ref={dragRef}
          style={draggableStyle}
          {...dragAttributes}
          {...dragListeners}
          className={cn(
            "outline-border/0 **:disabled:opacity-100 relative rounded-md outline-dashed outline-2 outline-offset-8 transition-all",
            isActive && "outline-border",
            (isDragging || (isCutting && slot === copiedSlot)) && "opacity-50",
          )}
          onPointerEnter={() => {
            addToHoverStack(slot.id);
          }}
          onPointerLeave={() => {
            removeFromHoverStack(slot.id);
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

          {isMovableDueToLayoutMode && !isDragging && (
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

              <div
                className={cn(
                  "absolute left-0 top-0 flex size-full items-center justify-center",
                  editingLayoutRootType === "column" && "flex-col",
                )}
              >
                <button
                  className="cursor-pointer opacity-50 transition-opacity hover:opacity-100"
                  onClick={handleMoveLeft}
                >
                  {editingLayoutRootType === "row" && (
                    <ChevronLeft className="size-8" />
                  )}
                  {editingLayoutRootType === "column" && (
                    <ChevronUp className="size-8" />
                  )}
                </button>

                <div>
                  <Grip className="size-8 opacity-50" />
                </div>

                <button
                  className="cursor-pointer opacity-50 transition-opacity hover:opacity-100"
                  onClick={handleMoveRight}
                >
                  {editingLayoutRootType === "row" && (
                    <ChevronRight className="size-8" />
                  )}
                  {editingLayoutRootType === "column" && (
                    <ChevronDown className="size-8" />
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {editingLayoutRoot === slot.id && (
            <LayoutAlignmentMenu
              initialHorizontalMode={
                (slot as RowSlot).horizontalAlign ?? "stretch"
              }
              initialVerticalMode={(slot as RowSlot).verticalAlign ?? "stretch"}
            />
          )}
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        <ContextMenuItem
          onClick={() => {
            console.log("edit", slot.type);
            updateSlot<TextFieldSlot>(slot.id, (x) => {
              x.name = "New Name";
            });
          }}
        >
          <span>Edit</span>
          <Edit3 className="ml-auto" />
        </ContextMenuItem>

        {isLayoutSlot && (
          <ContextMenuItem
            onClick={() => enterLayoutMode(slot as LayoutSlot)}
            disabled={isCutting}
          >
            <span>Change Layout</span>
            <LayoutTemplate className="ml-auto" />
          </ContextMenuItem>
        )}

        {isLayoutSlot && (
          <ContextMenuItem onClick={handleAddChild} disabled={isCutting}>
            <span>Add Child</span>
            <Plus className="ml-auto" />
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

            <ContextMenuCheckboxItem
              onClick={handleToggleCardHeader}
              checked={!!slot.header}
            >
              <span>Header</span>
              <AlignStartHorizontal className="ml-auto" />
            </ContextMenuCheckboxItem>

            {!slot.content && (
              <ContextMenuItem onClick={handleAddChild} inset>
                <span>Add Content</span>
                <Plus className="ml-auto" />
              </ContextMenuItem>
            )}

            <ContextMenuCheckboxItem
              onClick={handleToggleCardFooter}
              checked={!!slot.footer}
            >
              <span>Footer</span>
              <AlignEndHorizontal className="ml-auto" />
            </ContextMenuCheckboxItem>
          </>
        )}

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => copySlot(slot)} disabled={isCutting}>
          <span>Copy</span>
          <ClipboardCopy className="ml-auto" />
        </ContextMenuItem>

        <ContextMenuItem onClick={() => cutSlot(slot)} disabled={isCutting}>
          <span>Cut</span>
          <Scissors className="ml-auto" />
        </ContextMenuItem>

        {canDuplicate && (
          <ContextMenuItem onClick={() => duplicateSlot(slot)}>
            <span>Duplicate</span>
            <Copy className="ml-auto" />
          </ContextMenuItem>
        )}

        {isLayoutSlot && (
          <ContextMenuItem onClick={handlePaste} disabled={!copiedSlot}>
            <span>Paste</span>
            <ClipboardPaste className="ml-auto" />
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />

        <ContextMenuItem variant="destructive" onClick={() => deleteSlot(slot)}>
          <span>Delete</span>
          <Trash2 className="ml-auto" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

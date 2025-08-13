import sendApiRequest from "@/api-dsl/send-api-request";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useShortcut } from "@/hooks/use-shortcut";
import { ProspectFieldDefinition } from "@/lib/prospects/prospect-data-definition";
import { slotToProspectDataType } from "@/lib/prospects/slot-to-prospect-data-type";
import { useInvalidateProspectTable } from "@/lib/prospects/use-invalidate-prospect-table";
import { useProspectLayout } from "@/lib/prospects/use-prospect-layout";
import { useProspectView } from "@/lib/prospects/use-prospect-view";
import { cn } from "@/lib/utils";
import { useTeamStore } from "@/stores/team-store";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQueryClient } from "@tanstack/react-query";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { motion, useDragControls } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type EditProspectListViewItemDialogProps = {
  isOpen: boolean;
  requestClose: () => void;
};

export default function EditProspectListViewItemDialog({
  isOpen,
  requestClose,
}: EditProspectListViewItemDialogProps) {
  const teamId = useTeamStore((x) => x.activeTeam?.id);
  const [layout] = useProspectLayout();
  const allFields = useMemo(
    () => (layout ? slotToProspectDataType(layout.root) : null),
    [layout],
  );

  const queryClient = useQueryClient();
  const [listView] = useProspectView();
  const invalidateProspectTable = useInvalidateProspectTable();

  const dragControls = useDragControls();
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

  const [selectedFields, setSelectedFields] = useState<
    ProspectFieldDefinition[]
  >([]);
  useEffect(
    () => setSelectedFields((x) => (isOpen ? listView : x)),
    [listView, isOpen],
  );

  const unselectedListItems = useMemo(
    () =>
      allFields?.filter(
        (field) => !selectedFields.some((x) => x.id == field.id),
      ),
    [allFields, selectedFields],
  );

  const [isChoosingField, setIsChoosingField] = useState(false);
  function handleAddField(field: ProspectFieldDefinition) {
    setIsChoosingField(false);
    setSelectedFields([...selectedFields, field]);
  }

  function handleRemoveField(field: ProspectFieldDefinition) {
    setSelectedFields(selectedFields.filter((x) => x.id !== field.id));
  }

  const escapeToCloseEnabled = useRef(false);
  useShortcut({
    key: "Escape",
    callback: () => {
      if (!escapeToCloseEnabled.current) requestClose();
    },
    enabled: isOpen,
    preventDefault: true,
    stopPropagation: true,
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id === over?.id) return;

    const oldIndex = selectedFields.findIndex(
      (x: ProspectFieldDefinition) => x.id === active.id,
    );
    const newIndex = selectedFields.findIndex(
      (x: ProspectFieldDefinition) => x.id === over?.id,
    );

    const newChildren = arrayMove(selectedFields, oldIndex, newIndex);
    setSelectedFields(newChildren);
  }

  async function handleSave() {
    if (selectedFields.length < 1 || !teamId) return;

    const addedFields = selectedFields.filter(
      (field) => !listView.some((x) => x.id === field.id),
    );

    const removedFields = listView.filter(
      (field) => !selectedFields.some((x) => x.id === field.id),
    );

    const movedFields = selectedFields.filter((field, index) => {
      const listViewIndex = listView.findIndex((x) => x.id === field.id);
      return listViewIndex !== -1 && listViewIndex !== index;
    });

    let success = false;

    if (
      movedFields.length > 0 ||
      (removedFields.length > 0 && addedFields.length > 0)
    ) {
      const { isOk } = await sendApiRequest(
        "/prospect-views/{teamId}/replace-all",
        {
          method: "put",
          parameters: {
            teamId,
          },
          payload: {
            items: selectedFields.map((x) => ({
              id: x.id,
              type: x.type,
              teamId,
            })),
          },
        },
      );

      success = isOk;
    } else if (addedFields.length > 0) {
      const { isOk } = await sendApiRequest(
        "/prospect-views",
        {
          method: "post",
          payload: {
            items: addedFields.map((x) => ({
              id: x.id,
              type: x.type,
              teamId,
            })),
          },
        },
        {
          showToast: true,
          toastOptions: {
            loading: "Saving changes to list view, please wait...",
            success: "Successfully saved changes to list view",
            error: (x: Error) =>
              x.message || "Failed to save, please try again",
          },
        },
      );

      success = isOk;
    } else if (removedFields.length > 0) {
      const { isOk } = await sendApiRequest(
        "/prospect-views/{teamId}",
        {
          method: "delete",
          parameters: {
            teamId,
            ids: removedFields.map((x) => x.id).join(","),
          },
        },
        {
          showToast: true,
          toastOptions: {
            loading: "Saving changes to list view, please wait...",
            success: "Successfully saved changes to list view",
            error: (x: Error) =>
              x.message || "Failed to save, please try again",
          },
        },
      );

      success = isOk;
    }

    if (!success) return;

    await queryClient.setQueryData(["default-prospect-view", teamId], {
      items: selectedFields,
    });

    setTimeout(async () => {
      await invalidateProspectTable();
      requestClose();
    }, 150);
  }

  return (
    <motion.div
      className={cn(
        "-translate-1/2 fixed left-1/2 top-1/2",
        !isOpen && "pointer-events-none touch-none",
      )}
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
            <span>Editing List Item</span>

            <GripVertical className="text-muted-foreground size-5" />
          </CardTitle>

          <CardDescription>
            Control what information is displayed about each prospect
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="flex flex-col items-center gap-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={(e) => {
              handleDragEnd(e);
            }}
          >
            <SortableContext
              strategy={verticalListSortingStrategy}
              items={selectedFields}
            >
              {selectedFields.map((x) => (
                <Item
                  key={x.id}
                  item={x}
                  onRemove={() => handleRemoveField(x)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Dialog
            open={isChoosingField}
            onOpenChange={(x) => {
              setIsChoosingField(x);

              if (x) escapeToCloseEnabled.current = true;
              else
                setTimeout(() => {
                  escapeToCloseEnabled.current = x;
                }, 250);
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="mx-auto size-8 rounded-full">
                <Plus className="size-4" />
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose a field</DialogTitle>

                <DialogDescription>
                  Pick one out of all prospect&apos;s data fields
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col">
                {unselectedListItems?.length === 0 && (
                  <p>No fields available</p>
                )}

                {unselectedListItems?.map((field) => (
                  <Button
                    variant="ghost"
                    className="justify-start"
                    key={field.id}
                    onClick={() => handleAddField(field)}
                  >
                    {field.id}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>

        <Separator />

        <CardFooter className="flex-col items-end">
          <div className="space-x-2">
            <Button variant="secondary" onClick={requestClose}>
              Cancel
            </Button>

            <Button onClick={handleSave} disabled={selectedFields.length < 1}>
              Save
            </Button>
          </div>

          {selectedFields.length < 1 && (
            <p className="text-muted-foreground mt-2 text-xs">
              Please select at least one field
            </p>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function Item({
  item,
  onRemove,
}: {
  item: ProspectFieldDefinition;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: item,
    animateLayoutChanges: () => false,
  });

  const draggableStyle = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition: transition,
    }),
    [transform, transition],
  );

  return (
    <div
      className={cn(
        "flex w-full justify-between p-2",
        isDragging && "opacity-50",
      )}
      style={draggableStyle}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <p>{item.id}</p>

      <div className="flex items-center gap-2">
        <GripVertical className="text-muted-foreground hover:text-foreground size-5 transition-colors" />

        <button onClick={onRemove}>
          <Trash2 className="text-muted-foreground hover:text-destructive size-5 transition-colors" />
        </button>
      </div>
    </div>
  );
}

import {
  useSelectedSlot,
  useSlotHoverStack,
} from "@/contexts/slot-edit-context";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { cn } from "@/lib/utils";
import { Edit3, LayoutTemplate, Sparkles, Trash2 } from "lucide-react";
import { ReactNode } from "react";
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
  const { topSlot, addToHoverStack, removeFromHoverStack } =
    useSlotHoverStack();

  const [, selectSlot] = useSelectedSlot();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "outline-border/0 **:disabled:opacity-100 rounded-md outline-dashed outline-2 outline-offset-8 transition-colors",
            topSlot === slot && "outline-border",
          )}
          onPointerEnter={() => {
            addToHoverStack(slot);
          }}
          onPointerLeave={() => {
            removeFromHoverStack(slot);
          }}
        >
          {children}
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        <ContextMenuItem
          onClick={() => {
            setTimeout(() => {
              selectSlot(slot);
            }, 150);
          }}
        >
          <span>Edit</span>
          <Edit3 className="ml-auto" />
        </ContextMenuItem>

        {"content" in slot && Array.isArray(slot.content) && (
          <ContextMenuItem
            onClick={() => {
              console.log("layout", slot.type);
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
            <span>AI</span>
            <Sparkles className="ml-auto" />
          </ContextMenuItem>
        )}

        {slot.type === "card" && (
          <>
            <ContextMenuSeparator />

            <ContextMenuLabel className="text-muted-foreground text-sm">
              Card Options
            </ContextMenuLabel>

            <ContextMenuCheckboxItem checked>
              <span>Header</span>
            </ContextMenuCheckboxItem>

            <ContextMenuCheckboxItem>Footer</ContextMenuCheckboxItem>
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

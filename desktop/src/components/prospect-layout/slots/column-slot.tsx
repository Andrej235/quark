import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import type { ColumnSlot as ColumnSlotType } from "@/lib/prospects/types/slots/column-slot";
import RenderSlot from "../render-slot";

export default function ColumnSlot({ slot }: RenderSlotProps<ColumnSlotType>) {
  return (
    <div
      className="flex flex-col gap-8 p-2"
      style={{
        justifyContent: slot.verticalAlign ?? "stretch",
        alignItems: slot.horizontalAlign ?? "stretch",
      }}
    >
      {slot.content.map((child) =>
        "flex" in child ? (
          <div style={{ flex: child.flex }} key={child.slot.id}>
            <RenderSlot slot={child.slot} />
          </div>
        ) : (
          <RenderSlot slot={child} key={child.id} />
        ),
      )}

      {slot.content.length === 0 && (
        <>
          <div className="bg-muted-foreground/50 min-h-16 min-w-16 rounded-md" />
          <div className="bg-muted-foreground/50 min-h-16 min-w-16 rounded-md" />
          <div className="bg-muted-foreground/50 min-h-16 min-w-16 rounded-md" />
        </>
      )}
    </div>
  );
}

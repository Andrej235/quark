import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import type { RowSlot as RowSlotType } from "@/lib/prospects/types/slots/row-slot";
import RenderSlot from "./render-slot";

export default function RowSlot({ slot }: RenderSlotProps<RowSlotType>) {
  return (
    <div
      className="flex gap-8 p-2"
      style={{
        justifyContent: slot.horizontalAlign ?? "stretch",
        alignItems: slot.verticalAlign ?? "stretch",
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
          <div className="bg-muted-foreground/50 h-16 flex-1 rounded-md" />
          <div className="bg-muted-foreground/50 h-16 flex-1 rounded-md" />
          <div className="bg-muted-foreground/50 h-16 flex-1 rounded-md" />
        </>
      )}
    </div>
  );
}

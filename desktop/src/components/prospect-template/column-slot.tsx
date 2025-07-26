import type { ColumnSlot as ColumnSlotType } from "@/lib/prospect-template/column-slot";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import RenderSlot from "./render-slot";

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
    </div>
  );
}

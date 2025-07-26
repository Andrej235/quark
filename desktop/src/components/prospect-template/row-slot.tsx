import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import type { RowSlot as RowSlotType } from "@/lib/prospect-template/row-slot";
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
    </div>
  );
}

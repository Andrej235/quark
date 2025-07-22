import type { ColumnSlot as ColumnSlotType } from "@/lib/prospect-template/column-slot";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import RenderSlot from "./render-slot";

export default function ColumnSlot({ slot }: RenderSlotProps<ColumnSlotType>) {
  return (
    <div className="flex flex-col gap-8">
      {slot.content.map((member, i) =>
        "flex" in member ? (
          <div style={{ flex: member.flex }} key={i}>
            <RenderSlot slot={member.slot} />
          </div>
        ) : (
          <RenderSlot slot={member} key={i} />
        ),
      )}
    </div>
  );
}

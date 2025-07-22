import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import type { RowSlot as RowSlotType } from "@/lib/prospect-template/row-slot";
import RenderSlot from "./render-slot";

export default function RowSlot({ slot }: RenderSlotProps<RowSlotType>) {
  return (
    <div className="flex gap-8 p-2">
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

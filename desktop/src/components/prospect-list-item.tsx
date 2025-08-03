import { Prospect } from "@/lib/prospects/prospect-data-definition";
import { useProspectsStore } from "@/stores/prospects-store";
import { useMemo } from "react";

type ProspectListItemProps = {
  prospect: Prospect;
};

export default function ProspectListItem({ prospect }: ProspectListItemProps) {
  const listView = useProspectsStore((x) => x.listView);
  const listFields = useMemo(
    () => listView.map((x) => prospect.fields.find((y) => y.id === x.id)),
    [listView, prospect],
  );

  return (
    <div className="flex gap-4">
      {listFields.map((x) => (
        <p key={x?.id}>{x?.value}</p>
      ))}
    </div>
  );
}

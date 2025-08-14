import sendApiRequest from "@/api-dsl/send-api-request";
import useQuery from "@/api-dsl/use-query";
import RenderSlotTree from "@/components/prospect-template/render-slot-tree";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { slotEventSystemContext } from "@/contexts/slot-event-system-context";
import { SlotData } from "@/lib/prospects/slot-data";
import { useInvalidateProspectTable } from "@/lib/prospects/use-invalidate-prospect-table";
import { useProspectLayout } from "@/lib/prospects/use-prospect-layout";
import { useTeamStore } from "@/stores/team-store";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function EditProspectPage() {
  const prospectId = parseInt((useParams().prospectId as string) ?? "0") || 0;
  const teamId = useTeamStore((x) => x.activeTeam?.id);

  const prospect = useQuery("/prospects/{teamId}/{prospectId}", {
    parameters: {
      teamId: teamId || "",
      prospectId: prospectId,
    },
    queryKey: ["prospect", teamId, prospectId],
    enabled: !!teamId && !!prospectId,
  });
  const queryClient = useQueryClient();
  const invalidateProspectTable = useInvalidateProspectTable();
  const isSaving = useRef(false);

  const [template] = useProspectLayout();

  const [onReadSubscribedSlots, setOnReadSubscribedSlots] = useState<
    (() => SlotData | null)[]
  >([]);
  const onReadSubscribe = useCallback(
    (x: () => SlotData | null) =>
      setOnReadSubscribedSlots((prev) => [...prev, x]),
    [],
  );

  const [onSetSubscribedSlots, setOnSetSubscribedSlots] = useState<
    (() => [id: string, setCallback: (newValue: string | null) => void])[]
  >([]);
  const onSetSubscribe = useCallback(
    (x: () => [id: string, setCallback: (newValue: string | null) => void]) =>
      setOnSetSubscribedSlots((prev) => [...prev, x]),
    [],
  );

  const contextValue = useMemo(
    () => ({
      onReadSubscribers: onReadSubscribedSlots,
      onReadSubscribe: onReadSubscribe,

      onSetSubscribers: onSetSubscribedSlots,
      onSetSubscribe: onSetSubscribe,
    }),
    [
      onReadSubscribedSlots,
      onReadSubscribe,
      onSetSubscribedSlots,
      onSetSubscribe,
    ],
  );

  useEffect(() => {
    if (!prospect.data) return;

    onSetSubscribedSlots.forEach((callback) => {
      const [id, set] = callback();
      const value = prospect.data!.fields.find((x) => x.id === id)?.value;
      set(value ?? null);
    });
  }, [onSetSubscribedSlots, prospect]);

  async function handleSave() {
    if (isSaving.current) {
      toast.info("Saving prospect, please wait...", {
        duration: 3000,
      });
      return;
    }

    if (!teamId || !prospect.data) return;
    isSaving.current = true;

    const originalFields = prospect.data.fields;
    const editedFields = onReadSubscribedSlots
      .map((x) => x())
      .filter((x) => !!x);

    const editedFieldIds = editedFields.map((x) => x.id);
    const originalFieldIds = originalFields.map((x) => x.id);

    const editedFieldIdsToCheck = editedFieldIds.filter((id) =>
      originalFieldIds.includes(id),
    );
    const editedFieldsThatChanged = editedFields.filter((x) =>
      editedFieldIdsToCheck.includes(x.id),
    );
    const originalFieldsThatChanged = originalFields.filter((x) =>
      editedFieldIdsToCheck.includes(x.id),
    );

    // const deletedFieldIds = originalFieldIds.filter(
    //   (id) => !editedFieldIds.includes(id),
    // );
    // const addedFieldIds = editedFieldIds.filter(
    //   (id) => !originalFieldIds.includes(id),
    // );
    const changedFields = editedFieldsThatChanged
      .map((edited) => {
        const original = originalFieldsThatChanged.find(
          (x) => x.id === edited.id,
        );

        if (!original || edited.value === original.value) return null;

        return { ...edited, value: edited.value };
      })
      .filter((x) => !!x);

    if (changedFields.length === 0) {
      toast.info("No changes detected, nothing to save", {
        duration: 3000,
      });

      isSaving.current = false;
      return;
    }

    const { isOk } = await sendApiRequest(
      "/prospects",
      {
        method: "patch",
        payload: {
          teamId,
          prospectId,
          fields: changedFields,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Saving prospect, please wait...",
          success: "Prospect saved successfully!",
          error: (x) =>
            x.message || "Failed to save prospect, please try again",
        },
      },
    );

    if (!isOk) {
      isSaving.current = false;
      return;
    }

    await invalidateProspectTable();
    await queryClient.setQueryData(["prospect", teamId, prospectId], {
      ...prospect.data,
      fields: changedFields,
    });
    isSaving.current = false;
  }

  if (!template || !prospect.data) return null;

  if (prospect.data.archived) {
    console.log("archived");

    return (
      <Card className="border-0 bg-transparent">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Archived Prospect</CardTitle>
              <CardDescription>
                This prospect has been archived and cannot be edited.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">New Prospect</CardTitle>
            <CardDescription>
              Create a new prospect by filling out all fields defined in the
              template
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="bg-transparent">
        <slotEventSystemContext.Provider value={contextValue}>
          <RenderSlotTree slot={template.root} />
        </slotEventSystemContext.Provider>
      </CardContent>

      <CardFooter className="justify-end">
        <Button onClick={handleSave}>Save</Button>
      </CardFooter>
    </Card>
  );
}

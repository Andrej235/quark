import { defaultProspectTemplate } from "@/lib/default-prospect-template";
import { ProspectFieldDefinition } from "@/lib/prospects/prospect-data-definition";
import { slotToProspectDataType } from "@/lib/prospects/slot-to-prospect-data-type";
import { Slot } from "@/lib/prospects/slot-types/slot";
import { create } from "zustand";

type ProspectsStore = {
  template: Slot;
  dataFields: ProspectFieldDefinition[];
  setTemplate: (template: Slot) => void;
};

export const useProspectsStore = create<ProspectsStore>()((set) => ({
  template: defaultProspectTemplate,
  dataFields: slotToProspectDataType(defaultProspectTemplate),
  setTemplate: (template: Slot | null) =>
    set({
      template: template ?? defaultProspectTemplate,
      dataFields: slotToProspectDataType(template ?? defaultProspectTemplate),
    }),
}));

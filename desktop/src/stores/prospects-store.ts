import {
  defaultProspectDataFields,
  defaultProspectListView,
  defaultProspectTemplate,
} from "@/lib/default-prospect-template";
import {
  Prospect,
  ProspectFieldDefinition,
} from "@/lib/prospects/prospect-data-definition";
import { slotToProspectDataType } from "@/lib/prospects/slot-to-prospect-data-type";
import { Slot } from "@/lib/prospects/slot-types/slot";
import { create } from "zustand";

type ProspectsStore = {
  template: Slot;
  dataFields: ProspectFieldDefinition[];
  prospects: Prospect[];
  listView: ProspectFieldDefinition[];

  setTemplate: (template: Slot) => void;
  setProspects: (
    prospects: Prospect[] | ((prospects: Prospect[]) => Prospect[]),
  ) => void;
  setListView: (listView: ProspectFieldDefinition[]) => void;
};

export const useProspectsStore = create<ProspectsStore>()((set, get) => ({
  template: defaultProspectTemplate,
  dataFields: defaultProspectDataFields,
  listView: defaultProspectListView,
  prospects: [],

  setTemplate: (template: Slot | null) => {
    const dataFields = slotToProspectDataType(
      template ?? defaultProspectTemplate,
    );

    set((prev) => ({
      template: template ?? defaultProspectTemplate,
      dataFields: dataFields,
      listView: prev.listView || dataFields.slice(0, 5),
    }));
  },
  setProspects: (
    prospects: Prospect[] | ((prospects: Prospect[]) => Prospect[]),
  ) =>
    set({
      prospects: Array.isArray(prospects)
        ? prospects
        : prospects(get().prospects),
    }),
  setListView: (listView: ProspectFieldDefinition[]) => set({ listView }),
}));

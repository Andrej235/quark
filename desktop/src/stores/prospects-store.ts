import {
  defaultProspectDataFields,
  defaultProspectListView,
} from "@/lib/default-prospect-template";
import {
  Prospect,
  ProspectFieldDefinition,
} from "@/lib/prospects/prospect-data-definition";
import { create } from "zustand";

type ProspectsStore = {
  dataFields: ProspectFieldDefinition[];
  prospects: Prospect[];
  listView: ProspectFieldDefinition[];

  setProspects: (
    prospects: Prospect[] | ((prospects: Prospect[]) => Prospect[]),
  ) => void;
  setListView: (listView: ProspectFieldDefinition[]) => void;
};

export const useProspectsStore = create<ProspectsStore>()((set, get) => ({
  dataFields: defaultProspectDataFields,
  listView: defaultProspectListView,
  prospects: [],

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

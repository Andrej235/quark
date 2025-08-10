import {
  defaultProspectDataFields,
  defaultProspectListView,
} from "@/lib/default-prospect-template";
import { ProspectFieldDefinition } from "@/lib/prospects/prospect-data-definition";
import { create } from "zustand";

type ProspectsStore = {
  dataFields: ProspectFieldDefinition[];
  listView: ProspectFieldDefinition[];
  setListView: (listView: ProspectFieldDefinition[]) => void;
};

export const useProspectsStore = create<ProspectsStore>()((set) => ({
  dataFields: defaultProspectDataFields,
  listView: defaultProspectListView,
  setListView: (listView: ProspectFieldDefinition[]) => set({ listView }),
}));

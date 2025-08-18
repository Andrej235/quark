import { ProspectDataType } from "./prospect-data-definition";

export type SlotData = {
  id: string;
  type: ProspectDataType;
  value: string | null;
};

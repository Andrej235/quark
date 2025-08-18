import { SlotData } from "./slot-data";

export type ProspectDataType = "text" | "rich-text" | "image" | "dropdown";

export type ProspectFieldDefinition = {
  type: ProspectDataType;
  id: string;
};

export type Prospect = {
  id: number;
  fields: SlotData[];
};

import { Text } from "slate";

export type VariableElement = {
  type: "variable";
  variable: string;
  children: Text[];
};

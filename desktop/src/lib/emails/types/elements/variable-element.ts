import { Descendant } from "slate";

export type VariableElement = {
  type: "variable";
  variable: string;
  children: Descendant[];
};

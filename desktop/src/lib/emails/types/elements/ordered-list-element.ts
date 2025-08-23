import { Descendant } from "slate";

export type OrderedListElement = {
  type: "ordered-list";
  children: Descendant[];
};

import { Descendant } from "slate";

export type ListItemElement = {
  type: "list-item";
  children: Descendant[];
};

import { Descendant } from "slate";

export type UnorderedListElement = {
  type: "unordered-list";
  children: Descendant[];
};

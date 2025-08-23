import { Descendant } from "slate";

export type LinkElement = {
  type: "link";
  url: string;
  children: Descendant[];
};

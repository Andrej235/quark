import { Descendant } from "slate";

export type ParagraphElement = {
  type: "paragraph";
  align?: "left" | "center" | "right" | "justify";
  children: Descendant[];
};

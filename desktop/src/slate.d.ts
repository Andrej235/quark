import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export type CustomElement =
  | { type: "paragraph"; children: (CustomElement | CustomText)[] }
  | { type: "variable"; name: string; children: CustomText[] };

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
};

// Extend Slate's Editor type
export type CustomEditor = BaseEditor & ReactEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

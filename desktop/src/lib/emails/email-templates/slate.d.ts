import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export type EmailElement =
  | { type: "paragraph"; children: (EmailElement | Text)[] }
  | { type: "variable"; name: string; children: Text[] };

export type Text = {
  text: string;
  bold?: boolean;
  italic?: boolean;
};

export type Editor = BaseEditor & ReactEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: EmailElement;
    Text: Text;
  }
}

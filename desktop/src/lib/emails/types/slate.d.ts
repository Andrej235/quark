import "slate";
import { Editor } from "./editor";
import { EmailElement } from "./email-element";
import { Text } from "./text";

declare module "slate" {
  interface CustomTypes {
    Editor: Editor;
    Element: EmailElement;
    Text: Text;
  }
}

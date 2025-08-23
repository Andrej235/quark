import "slate";
import { Editor } from "./editor";
import { Element } from "./generalized-elements/email-element";
import { Text } from "./generalized-elements/text";

declare module "slate" {
  interface CustomTypes {
    Editor: Editor;
    Element: Element;
    Text: Text;
  }
}

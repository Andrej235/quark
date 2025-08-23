import { RenderElementProps } from "slate-react";
import LinkElement from "./elements/link-element";
import ParagraphElement from "./elements/paragraph-emelent";

export default function RenderElement(props: RenderElementProps) {
  switch (props.element.type) {
    case "link":
      return <LinkElement {...props} />;
    default:
      return <ParagraphElement {...props} />;
  }
}

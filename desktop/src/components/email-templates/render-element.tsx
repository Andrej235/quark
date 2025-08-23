import { RenderElementProps } from "slate-react";
import ParagraphElement from "./elements/paragraph-emelent";

export default function RenderElement(props: RenderElementProps) {
  switch (props.element.type) {
    default:
      return <ParagraphElement {...props} />;
  }
}

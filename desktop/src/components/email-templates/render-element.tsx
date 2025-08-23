import { RenderElementProps } from "slate-react";
import EmailAddressElement from "./elements/email-address-element";
import LinkElement from "./elements/link-element";
import ParagraphElement from "./elements/paragraph-emelent";

export default function RenderElement(props: RenderElementProps) {
  switch (props.element.type) {
    case "link":
      return <LinkElement {...props} />;
    case "email-address":
      return <EmailAddressElement {...props} />;
    default:
      return <ParagraphElement {...props} />;
  }
}

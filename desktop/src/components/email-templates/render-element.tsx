import { RenderElementProps } from "slate-react";
import EmailAddressElement from "./elements/email-address-element";
import LinkElement from "./elements/link-element";
import ListItemElement from "./elements/list-item-element";
import OrderedListElement from "./elements/ordered-list-element";
import ParagraphElement from "./elements/paragraph-emelent";
import UnorderedListElement from "./elements/unordered-list-element";
import VariableElement from "./elements/variable-element";

export default function RenderElement(props: RenderElementProps) {
  switch (props.element.type) {
    case "paragraph":
      return <ParagraphElement {...props} />;
    case "link":
      return <LinkElement {...props} />;
    case "email-address":
      return <EmailAddressElement {...props} />;
    case "unordered-list":
      return <UnorderedListElement {...props} />;
    case "ordered-list":
      return <OrderedListElement {...props} />;
    case "list-item":
      return <ListItemElement {...props} />;
    case "variable":
      return <VariableElement {...props} />;
    default:
      return <ParagraphElement {...props} />;
  }
}

import { EmailAddressElement } from "../elements/email-address-element";
import { LinkElement } from "../elements/link-element";
import { VariableElement } from "../elements/variable-element";

export type InlineElement = LinkElement | EmailAddressElement | VariableElement;

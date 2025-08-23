import { Descendant } from "slate";

export type EmailAddressElement = {
  type: "email-address";
  email: string;
  children: Descendant[];
};

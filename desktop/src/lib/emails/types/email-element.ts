import { Text } from "slate";

export type EmailElement =
  | {
      type: "paragraph";
      children: (EmailElement | Text)[];
    }
  | {
      type: "variable";
      name: string;
      children: Text[];
    };

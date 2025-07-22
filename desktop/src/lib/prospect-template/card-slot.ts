import { CardFooterSlot } from "./card-footer-slot";
import { CardHeaderSlot } from "./card-header-slot";
import { Slot } from "./slot";

export type CardSlot = {
  type: "card";
  header?: CardHeaderSlot;
  content: Slot;
  footer?: CardFooterSlot;
};

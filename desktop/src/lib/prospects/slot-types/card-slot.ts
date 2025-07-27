import { CardFooterSlot } from "./card-footer-slot";
import { CardHeaderSlot } from "./card-header-slot";
import { Slot } from "./slot";

export type CardSlot = {
  id: string;
  type: "card";
  header?: CardHeaderSlot;
  content: Slot | null;
  footer?: CardFooterSlot;
};

import { ButtonSlot } from "./button-slot";

export type CardFooterSlot = {
  id: string;
  type: "card-footer";
  buttons: ButtonSlot[];
};

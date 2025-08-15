import { Slot, SlotType } from "../../types/generalized-slots/slot";

export const defaultSlots: {
  [K in SlotType]: Slot<K>;
} = {
  row: {
    id: "row",
    type: "row",
    content: [],
    horizontalAlign: "stretch",
    verticalAlign: "stretch",
  },
  column: {
    id: "column",
    type: "column",
    content: [],
    horizontalAlign: "stretch",
    verticalAlign: "stretch",
  },
  card: {
    id: "card",
    type: "card",
    header: null,
    content: null,
    footer: null,
  },
  "card-header": {
    id: "card-header",
    type: "card-header",
    title: "Card Header",
  },
  "card-footer": {
    id: "card-footer",
    type: "card-footer",
    buttons: [],
  },
  "image-field": {
    id: "image-field",
    type: "image-field",
    name: "Select an Image",
    compressionQuality: 0.5,
    inputTypes: ["png", "jpg", "webp", "gif", "svg"],
    savedAs: "webp",
  },
  "text-field": {
    id: "text-field",
    type: "text-field",
    name: "Text Field",
    placeholder: "Enter text",
  },
  button: {
    id: "button",
    type: "button",
    label: "Button",
    variant: "default",
    size: "default",
  },
};

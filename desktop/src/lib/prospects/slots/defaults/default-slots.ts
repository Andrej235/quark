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
    required: false,
  },
  "text-field": {
    id: "text-field",
    type: "text-field",
    name: "Text Field",
    placeholder: "Enter text",
    validateFormat: "none",
    formatRegex: '{"source":"^","flags":""}',
    validateFormatError: "",
    required: false,
  },
  dropdown: {
    id: "dropdown",
    type: "dropdown",
    name: "Dropdown",
    placeholder: "Select an option",
    defaultValue: null,
    options: [
      {
        value: "Option 1",
        color: "#0000ff",
      },
      {
        value: "Option 2",
        color: "#00ff00",
      },
    ],
    required: false,
  },
  button: {
    id: "button",
    type: "button",
    label: "Button",
    variant: "default",
    size: "default",
  },
};

export type DropdownSlot = {
  id: string;
  type: "dropdown";
  name: string;
  placeholder: string;
  defaultValue: string | null;
  options: {
    value: string;
    color: string;
  }[];
  required: boolean;
};

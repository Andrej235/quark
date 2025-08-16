export type TextFieldSlot = {
  id: string;
  type: "text-field";
  name: string;
  placeholder: string;
  validateFormat:
    | "none"
    | "custom"
    | "email"
    | "phone"
    | "url"
    | "letters"
    | "numbers"
    | "alphanumeric";
  formatRegex: string;
  validateFormatError: string;
};

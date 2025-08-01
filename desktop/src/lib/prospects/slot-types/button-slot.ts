export type ButtonSlot = {
  id: string;
  type: "button";
  label: string;
  variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  size: "default" | "sm" | "lg";
};

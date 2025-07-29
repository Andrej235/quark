export type ImageFieldSlot = {
  id: string;
  type: "image-field";
  name: string;
  inputTypes: ("png" | "jpg" | "webp" | "gif" | "svg")[];
  savedAs: "png" | "jpg" | "webp" | "gif" | "svg" | null;
  compressionQuality: number;
};

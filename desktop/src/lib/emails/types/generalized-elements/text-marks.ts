import { Text } from "slate";

type ExtractMarks<T> = Extract<
  keyof T,
  keyof T extends infer K
    ? K extends keyof T
      ? boolean extends T[K]
        ? K
        : never
      : never
    : never
>;

export type TextMarks = ExtractMarks<Text>;

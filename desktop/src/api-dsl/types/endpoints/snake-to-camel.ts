import { Split } from "./split-string";

export type SnakeToCamel<T extends string | number | symbol> = T extends string
  ? JoinAsCamelCase<Split<T, "_">>
  : T;

type JoinAsCamelCase<T extends string[]> = T extends [infer L, ...infer R]
  ? L extends string
    ? `${L}${R extends string[] ? Capitalize<JoinAsCamelCase<R>> : ""}`
    : never
  : "";

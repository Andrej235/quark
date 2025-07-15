import { AllSchemaInformation, SchemaNames } from "./endpoints";
import { IsPropertyNullable, ParseSchemaProperty } from "./property-parser";

type Split<
  T extends string,
  Separator extends string = " ",
> = T extends `${infer L}${Separator}${infer R}`
  ? [...Split<L, Separator>, ...Split<R, Separator>]
  : [T];

type LastElement<T extends string[]> = T extends [infer L, ...infer R]
  ? R extends [string, ...string[]]
    ? LastElement<R>
    : L
  : never;

export type Schema<SchemaName extends SchemaNames> = ParseSchema<
  SchemaInfo<SchemaName>
>;

export type SchemaFromString<SchemaName extends string> =
  SchemaName extends SchemaNames ? ParseSchema<SchemaInfo<SchemaName>> : never;

export type SchemaInfo<T extends SchemaNames> = AllSchemaInformation[T];

export type ParseSchema<T extends SchemaInfo<SchemaNames>> =
  "enum" extends keyof T
    ? T["enum"] extends [unknown, ...unknown[]]
      ? T["enum"][number]
      : never
    : "type" extends keyof T
      ? T["type"] extends "object"
        ? ParseSchemaObject<T>
        : never
      : never;

type ParseSchemaObject<T extends SchemaInfo<SchemaNames>> =
  "properties" extends keyof T
    ? "required" extends keyof T
      ? {
          [P in keyof T["properties"] as P extends T["required"][number]
            ? P
            : never]:
            | ParseSchemaProperty<T["properties"][P]>
            | IsPropertyNullable<T["properties"][P]>;
        } & {
          [P in keyof T["properties"] as P extends T["required"][number]
            ? never
            : P]?:
            | ParseSchemaProperty<T["properties"][P]>
            | IsPropertyNullable<T["properties"][P]>;
        }
      : {
          [P in keyof T["properties"]]?:
            | ParseSchemaProperty<T["properties"][P]>
            | IsPropertyNullable<T["properties"][P]>;
        }
    : never;

export type RefToSchemaName<Ref extends string> = LastElement<Split<Ref, "/">>;

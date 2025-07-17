import type { RefToSchemaName, SchemaFromString } from "./schema-parser";

export type ParseSchemaProperty<T> = T extends { type: infer Type }
  ? ParseType<Type, T>
  : T extends { $ref: infer Ref }
    ? Ref extends string
      ? SchemaFromString<RefToSchemaName<Ref>>
      : never
    : never;

type ParseType<Type, Parent> = Type extends [...infer UnionTypes]
  ? ParseType<UnionTypes[number], Parent>
  : Type extends "integer"
    ? number
    : Type extends "number"
      ? number
      : Type extends "string"
        ? string
        : Type extends "boolean"
          ? boolean
          : Type extends "null"
            ? null
            : Type extends "array"
              ? "items" extends keyof Parent
                ? (
                    | ParseSchemaProperty<Parent["items"]>
                    | IsPropertyNullable<Parent["items"]>
                  )[]
                : never
              : never;

export type IsPropertyNullable<T> = T extends { nullable: true } ? null : never;

export type NullableToOptional<T> = {
  [K in keyof T as null extends T[K] ? K : never]?: T[K];
} & {
  [K in keyof T as null extends T[K] ? never : K]: T[K];
};

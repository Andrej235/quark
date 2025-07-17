import { ParseSchemaProperty } from "./property-parser";

export type ParseParameters<ParametersInfo> = ParametersInfo extends [
  infer First,
  ...infer Rest,
]
  ? (First extends {
      required: infer Required;
    }
      ? ParseParameter<First, Required>
      : ParseParameter<First, false>) &
      ParseParameters<Rest>
  : object;

type ParseParameter<Parameter, Required> = Required extends true
  ? {
      [key in keyof Parameter as key extends "name"
        ? Parameter[key] extends string
          ? Parameter[key]
          : never
        : never]: ParameterType<Parameter>;
    }
  : {
      [key in keyof Parameter as key extends "name"
        ? Parameter[key] extends string
          ? Parameter[key]
          : never
        : never]?: ParameterType<Parameter>;
    };

type ParameterType<Parameter> = Parameter extends { schema: infer Schema }
  ? ParseSchemaProperty<Schema>
  : never;

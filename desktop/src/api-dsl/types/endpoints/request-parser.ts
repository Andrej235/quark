import { Endpoints, Paths } from "./endpoints";
import { ParseParameters } from "./parameters-parser";
import { RefToSchemaName, SchemaFromString } from "./schema-parser";
import { Union2Tuple } from "./union-to-tuple";

export type Request<Endpoint extends Endpoints> = RequestHelper<
  Endpoint,
  Union2Tuple<keyof Paths[Endpoint]>
>;

export type RequestHelper<
  Path extends keyof Paths,
  T extends unknown[],
> = T extends [infer First, ...infer Rest]
  ? First extends keyof Paths[Path]
    ?
        | ({
            method: First;
          } & Parameters<Path, First> &
            Payload<Path, First>)
        | RequestHelper<Path, Rest>
    : never
  : never;

export type Parameters<
  Path extends keyof Paths,
  Method extends keyof Paths[Path],
> = "parameters" extends keyof Paths[Path][Method]
  ? Paths[Path][Method]["parameters"] extends object[]
    ? {
        parameters: ParseParameters<Paths[Path][Method]["parameters"]>;
      }
    : object
  : object;

type Payload<
  Path extends keyof Paths,
  Method extends keyof Paths[Path],
> = Paths[Path][Method] extends {
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: infer SchemaName;
        };
      };
    };
  };
}
  ? SchemaName extends string
    ? { payload: SchemaFromString<RefToSchemaName<SchemaName>> }
    : object
  : object;

import { Endpoints, Methods, Paths } from "./endpoints";
import { ParseSchemaProperty } from "./property-parser";

type IsCodeOk<Code> = Code extends `2${number}${infer U}`
  ? U extends `${number}${number}`
    ? never
    : Code
  : never;

export type ApiResponse<
  Endpoint extends Endpoints,
  Method extends Methods<Endpoint>,
> = Paths[Endpoint][Method] extends {
  responses: infer Responses;
}
  ? {
      code: keyof Responses;
      isOk: boolean;
      error:
        | ({
            message: string;
          } & Record<string, unknown>)
        | null;
      response: ParseResponse<Responses[IsCodeOk<keyof Responses>]> | null;
    }
  : null;

export type UnwrappedApiResponse<
  Endpoint extends Endpoints,
  Method extends Methods<Endpoint>,
> = Paths[Endpoint][Method] extends {
  responses: infer Responses;
}
  ? ParseResponse<Responses[IsCodeOk<keyof Responses>]> | null
  : null;

type ParseResponse<Response> = Response extends {
  content: {
    "application/json": {
      schema: infer Schema;
    };
  };
}
  ? ParseSchemaProperty<Schema>
  : object;

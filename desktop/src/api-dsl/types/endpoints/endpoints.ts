import { ApiMap as ApiMap } from "../../api-map";

export type Paths = ApiMap["paths"];
export type Endpoints = keyof Paths;
export type Methods<Endpoint extends Endpoints> = keyof Paths[Endpoint];
export type AllSchemaInformation = ApiMap["components"]["schemas"];
export type SchemaNames = keyof AllSchemaInformation;

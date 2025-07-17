import { ApiSpec } from "../../api-spec";

export type Paths = ApiSpec["paths"];
export type Endpoints = keyof Paths;
export type Methods<Endpoint extends Endpoints> = keyof Paths[Endpoint];
export type AllSchemaInformation = ApiSpec["components"]["schemas"];
export type SchemaNames = keyof AllSchemaInformation;

import { OmitKeyof } from "@tanstack/query-core";
import {
  UseQueryOptions,
  useQuery as useTanQuery,
} from "@tanstack/react-query";
import sendApiRequest from "./send-api-request";
import { Endpoints, Methods } from "./types/endpoints/endpoints";
import { Parameters, Request } from "./types/endpoints/request-parser";
import { UnwrappedApiResponse } from "./types/endpoints/response-parser";

type GetRoutes = keyof {
  [K in Endpoints as Methods<K> extends "get" ? K : never]: undefined;
};

type Options<Route extends GetRoutes> = OmitKeyof<
  UseQueryOptions<unknown, unknown, unknown, unknown[]>,
  "initialData" | "queryFn"
> &
  Parameters<Route, "get">;

export default function useQuery<Route extends GetRoutes>(
  route: Route,
  options?: Options<Route>,
): ReturnType<typeof useTanQuery<UnwrappedApiResponse<Route, "get">>> {
  return useTanQuery({
    queryFn: () =>
      sendApiRequest(route, {
        method: "get",
        parameters:
          options && "parameters" in options ? options.parameters : undefined,
      } as unknown as Request<Route>).then((x) => {
        if (x?.isOk) return x.response;

        throw new Error(x?.error?.message ?? "Something went wrong");
      }),
    ...options,
  }) as ReturnType<typeof useTanQuery<UnwrappedApiResponse<Route, "get">>>;
}

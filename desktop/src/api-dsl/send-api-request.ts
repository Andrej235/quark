import useAuthStore from "@/stores/auth-store";
import { Endpoints, Methods } from "./types/endpoints/endpoints";
import { Request } from "./types/endpoints/request-parser";
import { ApiResponse } from "./types/endpoints/response-parser";
import { apiResponseToToast } from "@/lib/toast-promise";

const baseApiUrl = import.meta.env.VITE_PUBLIC_API_URL as string;
if (!baseApiUrl) throw new Error("VITE_PUBLIC_API_URL not defined");

type Response<
  Endpoint extends Endpoints,
  T extends Request<Endpoint>,
> = T extends {
  method: infer Method;
}
  ? Method extends Methods<Endpoint>
    ? ApiResponse<Endpoint, Method>
    : never
  : never;

type Options = {
  omitCredentials?: boolean;
  abortSignal?: AbortSignal;
} & (
  | {
      showToast: true;
      toastOptions?: Parameters<typeof apiResponseToToast>[1];
    }
  | {
      showToast?: false;
    }
);

export default async function sendApiRequest<
  T extends Request<Endpoint>,
  Endpoint extends Endpoints,
>(
  endpoint: Endpoint,
  request: T,
  options: Options = {},
): Promise<Response<Endpoint, T>> {
  const url = new URL(baseApiUrl.concat(endpoint));
  const requestCopy = structuredClone(request);

  if ("parameters" in requestCopy) {
    const parameters = mapFromCamelToSnake(
      requestCopy.parameters as Record<string, string>,
    );

    for (const key in parameters) {
      if (!url.href.includes("%7B" + key + "%7D")) continue;

      const value = (parameters as Record<string, string>)[key];
      if (value !== undefined)
        url.href = url.href.replace("%7B" + key + "%7D", value);

      delete (parameters as Record<string, string>)[key];
    }

    url.search = new URLSearchParams(
      parameters as Record<string, string>,
    ).toString();
  }

  const body =
    "payload" in requestCopy
      ? JSON.stringify(
          mapFromCamelToSnake(requestCopy.payload as Record<string, unknown>),
        )
      : null;

  const requestInit: RequestInit = {
    method: (requestCopy.method as string).toUpperCase(),
    signal: options.abortSignal,
    body: body,
    headers: {
      "Content-Type": "application/json",
      ...(!options.omitCredentials && {
        Authorization: `Bearer ${await useAuthStore.getState().getJwt()}`,
      }),
    },
  };

  const responsePromise = (async () => {
    const response = await fetch(url, requestInit);
    const code = response.status.toString();
    const isOk = response.ok;
    let data = null;

    try {
      data = mapFromSnakeToCamel(
        (await response.json()) as Record<string, unknown>,
      ) as unknown;
      // eslint-disable-next-line no-empty
    } catch {}

    return isOk
      ? ({ code, isOk, error: null, response: data } as Response<Endpoint, T>)
      : ({ code, isOk, error: data, response: null } as Response<Endpoint, T>);
  })();

  if (options.showToast)
    apiResponseToToast(responsePromise, options.toastOptions || {});

  return await responsePromise;
}

function mapFromCamelToSnake(
  object: Record<string, unknown>,
): Record<string, unknown> {
  const toSnake = (str: string) => str.replace(/([A-Z])/g, "_$1").toLowerCase();

  const result: Record<string, unknown> = {};
  for (const key in object) {
    const value = object[key];
    const snakeKey = toSnake(key);

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result[snakeKey] = mapFromCamelToSnake(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[snakeKey] = value.map((item) =>
        typeof item === "object" && item !== null
          ? mapFromCamelToSnake(item as Record<string, unknown>)
          : (item as Record<string, unknown>),
      );
    } else {
      result[snakeKey] = value;
    }
  }
  return result;
}

function mapFromSnakeToCamel(
  object: Record<string, unknown>,
): Record<string, unknown> {
  const toCamel = (str: string) =>
    str.replace(/_([a-z])/g, (_, letter) => (letter as string).toUpperCase());

  const result: Record<string, unknown> = {};
  for (const key in object) {
    const value = object[key];
    const camelKey = toCamel(key);

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result[camelKey] = mapFromSnakeToCamel(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[camelKey] = value.map((item) =>
        typeof item === "object" && item !== null
          ? mapFromSnakeToCamel(item as Record<string, unknown>)
          : (item as Record<string, unknown>),
      );
    } else {
      result[camelKey] = value;
    }
  }
  return result;
}

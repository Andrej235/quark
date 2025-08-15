import sendApiRequest from "@/api-dsl/send-api-request";
import { appType } from "@/lib/app-type";
import { appDataDir } from "@tauri-apps/api/path";
import { Client, Stronghold } from "@tauri-apps/plugin-stronghold";
import { create } from "zustand";

const REFRESH_TOKEN_KEY = "refresh_token";
const JWT_KEY = "jwt";
const cookieBasedAuth = appType === "web";

type LocalDataStore = {
  get: (key: string) => Promise<Uint8Array | null>;
  insert: (key: string, value: number[]) => Promise<void>;
  remove: (key: string) => Promise<void>;
};

type AuthStore = {
  stronghold: Stronghold | null;
  client: Client | null;
  initStorage: () => Promise<void>;
  localJwt: string | null;
  getStore: () => Promise<LocalDataStore>;
  getJwt: () => Promise<string | null>;
  setJwt: (jwt: string | null) => Promise<void>;
  setRefreshToken: (refreshToken: string | null) => Promise<void>;
  logOut: () => Promise<void>;
  getIsLoggedIn: () => Promise<boolean>;
  refreshPromise: Promise<string | null> | null;
};

const useAuthStore = create<AuthStore>((set, get) => ({
  stronghold: null,
  client: null,
  localJwt: null,
  refreshPromise: null,

  initStorage: async () => {
    if (cookieBasedAuth) return;
    get().stronghold?.unload();

    if (appType !== "desktop") return;

    const VAULT_PATH = `${await appDataDir()}/vault.hold`;
    const VAULT_KEY = "vault-key";
    const CLIENT_NAME = "auth-client";

    try {
      const stronghold = await Stronghold.load(VAULT_PATH, VAULT_KEY);

      let client;
      try {
        client = await stronghold.loadClient(CLIENT_NAME);
      } catch {
        client = await stronghold.createClient(CLIENT_NAME);
      }

      set({ stronghold, client });
    } catch (error) {
      console.error("Failed to initialize Stronghold:", error);
    }
  },

  getJwt: async () => {
    if (cookieBasedAuth) return null;

    try {
      const store = await get().getStore();

      // Get user's current JWT, prioritizing the local one
      let jwt = get().localJwt;
      if (!jwt) {
        const data = await store.get(JWT_KEY);
        if (!data) return null;
        jwt = new TextDecoder().decode(new Uint8Array(data));
      }

      // The user is not logged in
      if (!jwt) return null;

      const [, payloadBase64] = jwt.split(".");

      const payload =
        payloadBase64 &&
        (JSON.parse(
          atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")),
        ) as unknown);

      if (
        !payload ||
        typeof payload !== "object" ||
        !("exp" in payload) ||
        typeof payload.exp !== "number"
      ) {
        // Invalid JWT, delete it and say the user is not logged in
        get().setJwt(null);
        return null;
      }

      // JWT is not expired
      if (payload.exp && Date.now() / 1000 < payload.exp) return jwt;

      const { refreshPromise } = get();
      if (refreshPromise) return await refreshPromise;

      async function refresh() {
        const refreshTokenData = await store.get(REFRESH_TOKEN_KEY);
        if (!refreshTokenData) return null;
        const refreshToken = new TextDecoder().decode(
          new Uint8Array(refreshTokenData),
        );

        // Try to refresh the JWT
        const { error, response, code } = await sendApiRequest(
          "/users/refresh",
          {
            method: "post",
            payload: {
              jwt: jwt!,
              refreshToken: refreshToken,
            },
          },
          {
            omitCredentials: true,
          },
        );

        // Failed to refresh, either the user has mismatched claims or the refresh token is expired, log them out
        if (error || !response) {
          console.error(
            `Failed to refresh JWT (${code.toString()}):`,
            error?.message || "No response",
          );

          get().setJwt(null);
          get().setRefreshToken(null);
          set({ refreshPromise: null });

          return null;
        }

        get().setRefreshToken(response.refreshToken);
        get().setJwt(response.jwt);
        set({ refreshPromise: null });
        return response.jwt;
      }

      const promise = refresh();
      set({ refreshPromise: promise });

      return await promise;
    } catch (error) {
      console.error("Failed to retrieve jwt:", error);
      return null;
    }
  },

  setJwt: async (jwt) => {
    if (cookieBasedAuth) return;
    set({ localJwt: jwt });

    try {
      const store = await get().getStore();

      if (jwt) {
        const data = Array.from(new TextEncoder().encode(jwt));
        await store.insert(JWT_KEY, data);
      } else {
        await store.remove(JWT_KEY);
      }
    } catch (error) {
      console.error("Failed to save jwt:", error);
    }
  },

  setRefreshToken: async (refreshToken) => {
    if (cookieBasedAuth) return;

    try {
      const store = await get().getStore();

      if (!refreshToken) {
        await store.remove(REFRESH_TOKEN_KEY);
        return;
      }

      const data = Array.from(new TextEncoder().encode(refreshToken));
      await store.insert(REFRESH_TOKEN_KEY, data);
    } catch (error) {
      console.error("Failed to save refresh token:", error);
    }
  },

  logOut: async () => {
    try {
      if (cookieBasedAuth) {
        await sendApiRequest(
          "/users/logout/cookie",
          {
            method: "post",
          },
          {
            showToast: true,
            toastOptions: {
              success: "Successfully logged out.",
            },
          },
        );

        return;
      }

      const { client, stronghold } = get();
      if (!client || !stronghold) {
        await get().initStorage();
      }

      const store = await get().getStore();

      const refreshTokenData = await store.get(REFRESH_TOKEN_KEY);
      if (!refreshTokenData) return;
      const refreshToken = new TextDecoder().decode(
        new Uint8Array(refreshTokenData),
      );

      Promise.all([
        sendApiRequest(
          "/users/logout/token",
          {
            method: "post",
            payload: {
              refreshToken,
            },
          },
          {
            showToast: true,
            toastOptions: {
              success: "Successfully logged out.",
            },
          },
        ),
        get().setJwt(null),
        get().setRefreshToken(null),
      ]);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  },

  getStore: async () => {
    if (cookieBasedAuth) return null!;

    const { client, stronghold } = get();
    if (!client || !stronghold) await get().initStorage();
    const store = get().client!.getStore();

    return {
      get: (key: string) => store.get(key),
      insert: async (key: string, value: number[]) => {
        await store.insert(key, value);
        await stronghold!.save();
      },
      remove: async (key: string) => {
        await store.remove(key);
        await stronghold!.save();
      },
    };
  },

  getIsLoggedIn: async () => {
    if (!cookieBasedAuth) {
      const jwt = await get().getJwt();
      return !!jwt;
    }

    const { isOk } = await sendApiRequest("/users/check-auth", {
      method: "get",
    });
    return isOk;
  },
}));

export default useAuthStore;

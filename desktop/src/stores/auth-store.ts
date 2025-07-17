import { create } from "zustand";
import { Stronghold, Client } from "@tauri-apps/plugin-stronghold";
import { appDataDir } from "@tauri-apps/api/path";
import sendApiRequest from "@/api-dsl/send-api-request";

const VAULT_PATH = `${await appDataDir()}/vault.hold`;
const VAULT_KEY = "vault-key";
const CLIENT_NAME = "auth-client";
const REFRESH_TOKEN_KEY = "refresh_token";
const JWT_KEY = "jwt";

type AuthStore = {
  stronghold: Stronghold | null;
  client: Client | null;
  initStronghold: () => Promise<void>;
  localJwt: string | null;
  getJwt: () => Promise<string | null>;
  setJwt: (jwt: string | null) => Promise<void>;
  setRefreshToken: (refreshToken: string | null) => Promise<void>;
};

const useAuthStore = create<AuthStore>((set, get) => ({
  stronghold: null,
  client: null,
  localJwt: null,

  initStronghold: async () => {
    get().stronghold?.unload();

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
    try {
      const { client, stronghold } = get();
      if (!client || !stronghold) await get().initStronghold();
      const store = get().client!.getStore();

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

      const refreshTokenData = await store.get(REFRESH_TOKEN_KEY);
      if (!refreshTokenData) return null;
      const refreshToken = new TextDecoder().decode(
        new Uint8Array(refreshTokenData),
      );

      // Try to refresh the JWT
      const { error, response, code } = await sendApiRequest(
        "/user/refresh",
        {
          method: "post",
          payload: {
            jwtToken: jwt,
            refreshTokenId: refreshToken,
          },
        },
        false,
      );

      // Failed to refresh, either the user has mismatched claims or the refresh token is expired, log them out
      if (error || !response) {
        console.error(
          `Failed to refresh JWT (${code}):`,
          error?.message || "No response",
        );

        get().setJwt(null);
        get().setRefreshToken(null);

        return null;
      }

      get().setRefreshToken(response.refreshTokenId);
      get().setJwt(response.jwtToken);
      return response.jwtToken;
    } catch (error) {
      console.error("Failed to retrieve jwt:", error);
      return null;
    }
  },

  setJwt: async (jwt) => {
    set({ localJwt: jwt });

    try {
      const { client, stronghold } = get();
      if (!client || !stronghold) await get().initStronghold();
      const store = get().client!.getStore();

      if (jwt) {
        const data = Array.from(new TextEncoder().encode(jwt));
        await store.insert(JWT_KEY, data);
      } else {
        await store.remove(JWT_KEY);
      }
      await stronghold!.save();
    } catch (error) {
      console.error("Failed to save jwt:", error);
    }
  },

  setRefreshToken: async (refreshToken) => {
    try {
      const { client, stronghold } = get();
      if (!client || !stronghold) {
        await get().initStronghold();
      }

      const store = get().client!.getStore();

      if (!refreshToken) {
        await store.remove(REFRESH_TOKEN_KEY);
        await stronghold!.save();
        return;
      }

      const data = Array.from(new TextEncoder().encode(refreshToken));
      await store.insert(REFRESH_TOKEN_KEY, data);
      await stronghold!.save();
    } catch (error) {
      console.error("Failed to save refresh token:", error);
    }
  },
}));

export default useAuthStore;

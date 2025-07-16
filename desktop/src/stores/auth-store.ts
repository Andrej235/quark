import { create } from "zustand";
import { Stronghold, Client } from "@tauri-apps/plugin-stronghold";
import { appDataDir } from "@tauri-apps/api/path";

const VAULT_PATH = `${await appDataDir()}/vault.hold`;
const VAULT_KEY = "your-secure-vault-key"; // Replace with a secure key (e.g., user-derived or device-specific)
const CLIENT_NAME = "auth-client";
const REFRESH_TOKEN_KEY = "refresh_token";

type AuthStore = {
  jwt: string | null;
  stronghold: Stronghold | null;
  client: Client | null;
  initStronghold: () => Promise<void>;
  setJwt: (jwt: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => Promise<void>;
  getRefreshToken: () => Promise<string | null>;
};

const useAuthStore = create<AuthStore>((set, get) => ({
  jwt: null,
  stronghold: null,
  client: null,

  initStronghold: async () => {
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

  setJwt: (jwt) => set({ jwt }),

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

  getRefreshToken: async () => {
    try {
      const { client, stronghold } = get();
      if (!client || !stronghold) {
        await get().initStronghold();
      }

      const store = get().client!.getStore();
      const data = await store.get(REFRESH_TOKEN_KEY);
      if (!data) return null;
      return new TextDecoder().decode(new Uint8Array(data));
    } catch (error) {
      console.error("Failed to retrieve refresh token:", error);
      return null;
    }
  },
}));

export default useAuthStore;

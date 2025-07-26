import { LocalDataStore } from "./local-data-store";

export const localStorageStore: LocalDataStore = {
  get(key: string) {
    const item = localStorage.getItem(key);
    if (!item) return Promise.resolve(null);
    try {
      const arr = JSON.parse(item);
      if (Array.isArray(arr)) return Promise.resolve(new Uint8Array(arr));

      return Promise.resolve(null);
    } catch {
      return Promise.resolve(null);
    }
  },
  insert(key: string, value: number[]) {
    localStorage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  },
  remove(key: string) {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

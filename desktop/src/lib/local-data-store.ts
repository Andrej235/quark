export type LocalDataStore = {
  get: (key: string) => Promise<Uint8Array | null>;
  insert: (key: string, value: number[]) => Promise<void>;
  remove: (key: string) => Promise<void>;
};

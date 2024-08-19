import { atomWithStorage, createJSONStorage } from "jotai/utils";
import * as SecureStore from "expo-secure-store";

const secureStore = createJSONStorage<string | null>(() => ({
  getItem: async (key: string) => {
    const value = await SecureStore.getItemAsync(key);
    return value !== null ? value : "";
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
}));

export const tokenAtom = atomWithStorage<string | null>(
  "token",
  null,
  secureStore
);

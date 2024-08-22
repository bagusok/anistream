import { atomWithStorage, createJSONStorage } from "jotai/utils";
import * as SecureStore from "expo-secure-store";
import { atomWithQuery } from "jotai-tanstack-query";
import { axiosIn } from "@/utils/axios";
import { API_URL } from "@/constants/Strings";

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

export const userAtom = atomWithQuery<User>((get) => ({
  queryKey: ["users", get(tokenAtom)],
  queryFn: async () => {
    const token = await get(tokenAtom);
    console.info(
      "Token",
      typeof token === "string" ? token : JSON.stringify(token)
    );

    const authorization = token ? { Authorization: `Bearer ${token}` } : {};
    console.info("Authorization", authorization);

    return axiosIn
      .get(`${API_URL}/anime/user/ping`, {
        headers: { ...authorization },
      })
      .then((res) => {
        console.info("User data", res.data?.data);
        return res.data?.data ?? null;
      })
      .catch((err) => {
        console.info("Error fetching user data", err.response.data);
        return err?.response?.data?.message ?? "Error fetching user data";
      });
  },
}));

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export enum UserRole {
  USER = "USER",
  GUEST = "GUEST",
}

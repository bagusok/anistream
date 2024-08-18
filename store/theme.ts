import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { Colors } from "@/constants/Colors";

const THEME_KEY = "theme";
export enum ThemeType {
  Light = "light",
  Dark = "dark",
}

export const themeAtom = atomWithStorage<ThemeType>(THEME_KEY, ThemeType.Dark);

export const colorsAtom = atom((get) => {
  const theme = get(themeAtom);
  return theme == ThemeType.Light ? Colors.light : Colors.dark;
});

import { colorsAtom } from "@/store/theme";
import { useAtomValue } from "jotai";

export const useColors = () => {
  const colors = useAtomValue(colorsAtom);
  return colors;
};

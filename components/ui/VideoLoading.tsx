import { useColors } from "@/hooks/useColors";
import { ActivityIndicator, View } from "react-native";
import { Link } from "expo-router";
import CustomText from "./Text";

export default function VideoLoading() {
  const colors = useColors();

  return (
    <View
      style={{
        width: "100%",
        aspectRatio: 16 / 9,
        height: "auto",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
        padding: 14,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

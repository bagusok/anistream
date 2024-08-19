import { useColors } from "@/hooks/useColors";
import { ActivityIndicator, View } from "react-native";
import CustomText from "./Text";

export default function FloatingLoading({
  title,
  isLoading = false,
}: {
  title?: string;
  isLoading?: boolean;
}) {
  const colors = useColors();

  if (!isLoading) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 999,
      }}
    >
      <View
        style={{
          paddingHorizontal: 50,
          paddingVertical: 20,
          backgroundColor: colors.white,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        {title && (
          <CustomText style={{ marginTop: 10 }} color={colors.black}>
            {title}
          </CustomText>
        )}
      </View>
    </View>
  );
}

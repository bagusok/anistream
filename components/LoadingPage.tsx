import { useColors } from "@/hooks/useColors";
import { ActivityIndicator, View } from "react-native";
import { CustomText } from "./ui";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoadingPage() {
  const colors = useColors();
  return (
    <SafeAreaView>
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
          zIndex: 999,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </SafeAreaView>
  );
}

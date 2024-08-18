import { useColors } from "@/hooks/useColors";
import { View } from "react-native";
import CustomText from "../Text";
import { Link } from "expo-router";

export default function StreamUrlNotFound() {
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
      <CustomText fontStyle="semibold" size={14}>
        Video Source Not Found
      </CustomText>
      <CustomText size={11} style={{ marginTop: 8 }}>
        Episode baru mungkin butuh beberapa saat untuk diupload, Jadi Tunggu
        Aja. Atau Lapor Ke Admin
      </CustomText>
      <Link
        href="/(home)/"
        style={{
          marginTop: 16,
          backgroundColor: colors.muted,
          paddingHorizontal: 16,
          paddingVertical: 5,
          borderRadius: 5,
        }}
      >
        <CustomText>Lapor Ke Admin</CustomText>
      </Link>
    </View>
  );
}

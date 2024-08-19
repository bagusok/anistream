import GoogleLogin from "@/components/auth/GoogleLogin";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { CustomText } from "@/components/ui";
import { useColors } from "@/hooks/useColors";
import { tokenAtom, userAtom, UserRole } from "@/store/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { Alert, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function AllAnime() {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);

  const colors = useColors();

  if (!token || user.data?.role != UserRole.USER) {
    return <Redirect href="/pages/login" />;
  }

  return (
    <SafeAreaWrapper
      style={{
        paddingHorizontal: 14,
      }}
    >
      <View
        style={{
          marginTop: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 20,
          backgroundColor: colors.muted,
          padding: 14,
          borderRadius: 20,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
          }}
        >
          <Image
            source={require("./../../assets/images/avatar.png")}
            contentFit="cover"
            style={{ borderRadius: 20, height: "100%", width: "100%" }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomText size={14} fontStyle="medium">
            {user?.data?.name}
          </CustomText>
        </View>
        <View style={{}}></View>
      </View>

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={async () => {
          await GoogleSignin.signOut();

          setToken(null);
          Alert.alert("Sign out success!");
        }}
      >
        <CustomText
          style={{ textAlign: "center" }}
          fontStyle="semibold"
          size={14}
          color={colors.red[500]}
        >
          Sign Out
        </CustomText>
      </TouchableOpacity>
    </SafeAreaWrapper>
  );
}

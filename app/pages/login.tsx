import GoogleLogin from "@/components/auth/GoogleLogin";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { CustomText } from "@/components/ui";
import FloatingLoading from "@/components/ui/FloatingLoading";
import { View } from "react-native";

export default function LoginPage() {
  return (
    <SafeAreaWrapper>
      <View style={{ height: "100%" }}>
        <CustomText
          size={20}
          fontStyle="semibold"
          style={{
            textAlign: "center",
            marginTop: 60,
          }}
        >
          Login Page
        </CustomText>
        <CustomText
          style={{
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Login dulu untuk menonton anime
        </CustomText>

        <GoogleLogin style={{ alignSelf: "center", marginTop: 40 }} />

        <CustomText
          style={{
            marginTop: "auto",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Miramine v1.0.0
        </CustomText>
      </View>
      {/* <FloatingLoading /> */}
    </SafeAreaWrapper>
  );
}

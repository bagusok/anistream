import GoogleLogin from "@/components/auth/GoogleLogin";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { CustomText } from "@/components/ui";
import { tokenAtom } from "@/store/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useAtom, useAtomValue } from "jotai";
import { Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function AllAnime() {
  const [token, setToken] = useAtom(tokenAtom);

  return (
    <SafeAreaWrapper>
      <CustomText>All Anime</CustomText>

      {!token ? <GoogleLogin /> : <CustomText>Logged in</CustomText>}
      <TouchableOpacity
        onPress={async () => {
          await GoogleSignin.signOut();

          setToken(null);
          Alert.alert("Sign out success!");
        }}
      >
        <CustomText>Sign Out</CustomText>
      </TouchableOpacity>
    </SafeAreaWrapper>
  );
}

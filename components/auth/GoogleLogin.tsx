import { ToastAndroid, View } from "react-native";
import { API_URL } from "@/constants/Strings";
import { axiosIn } from "@/utils/axios";
import { supabase } from "@/utils/supabase";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import { useSetAtom } from "jotai";
import { tokenAtom } from "@/store/auth";
import FloatingLoading from "../ui/FloatingLoading";
import { useState } from "react";
import { router } from "expo-router";

interface GoogleLoginProps extends React.ComponentProps<typeof View> {}

export default function GoogleLogin(props: GoogleLoginProps) {
  const setToken = useSetAtom(tokenAtom);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <View {...props}>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={async () => {
            try {
              await GoogleSignin.hasPlayServices();
              const userInfo = await GoogleSignin.signIn();

              setIsLoading(true);
              if (userInfo.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                  provider: "google",
                  token: userInfo.idToken,
                });

                if (error) {
                  console.log("ERROR SUPABASE LOGIN: ", error);
                  Alert.alert("Error logging in with Supabase!");
                } else {
                  const getToken = await axiosIn.post(
                    `${API_URL}/anime/auth/login`,
                    {
                      email: data.user.email,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${data.session.access_token}`,
                      },
                    }
                  );

                  if (getToken.data && getToken.data.status == true) {
                    console.log("TOKEN: ", getToken.data);
                    setToken(getToken.data.data.token);
                    ToastAndroid.show("Login berhasil!", ToastAndroid.SHORT);
                    router.push("/(home)/");
                  } else {
                    console.log("NO TOKEN: ", getToken.data);
                    Alert.alert("No token found!");
                  }
                }
              } else {
                throw new Error("no ID token present!");
              }

              setIsLoading(false);
            } catch (error: any) {
              setIsLoading(false);
              console.log(error);
              if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
              } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
              } else if (
                error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
              ) {
                // play services not available or outdated
              } else {
                // some other error happened
              }
            }
          }}
        />
      </View>
      <FloatingLoading title="Sedang Login..." isLoading={isLoading} />
    </>
  );
}

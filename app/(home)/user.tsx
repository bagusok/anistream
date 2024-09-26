import GoogleLogin from "@/components/auth/GoogleLogin";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { CustomText } from "@/components/ui";
import { ThemeColors } from "@/constants/Colors";
import { SAWERIA_URL } from "@/constants/Strings";
import { useColors } from "@/hooks/useColors";
import { tokenAtom, userAtom, UserRole } from "@/store/auth";
import { themeAtom, ThemeType } from "@/store/theme";
import { Feather } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { Alert, Linking, StyleSheet, Switch, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function AllAnime() {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);

  const colors = useColors();
  const styles = createStyle(colors);

  const [theme, setTheme] = useAtom(themeAtom);

  if (!token || user.data?.role != UserRole.USER) {
    return <Redirect href="/pages/login" />;
  }

  const toggleTheme = () => {
    if (theme == ThemeType.Dark) {
      setTheme(ThemeType.Light);
    } else {
      setTheme(ThemeType.Dark);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.header}></View>
      <View style={styles.container}>
        <View
          style={[
            styles.card,
            { flexDirection: "row", justifyContent: "space-between", gap: 20 },
          ]}
        >
          <View
            style={{
              width: 60,
              height: 60,
            }}
          >
            <Image
              source={
                user.data?.avatar ?? require("./../../assets/images/avatar.png")
              }
              contentFit="cover"
              style={{ borderRadius: 50, height: "100%", width: "100%" }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <CustomText size={14} fontStyle="medium">
              {user?.data?.name}
            </CustomText>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.card, styles.mt20, styles.row]}
          onPress={() => Linking.openURL(SAWERIA_URL)}
        >
          <CustomText fontStyle="medium" size={14}>
            Sawer dulu ngab! Buat beli dev console
          </CustomText>
          <CustomText>
            <Feather name="chevron-right" size={16} />
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.mt20, styles.row]} onPress={() => toggleTheme()}>
          <CustomText size={14} fontStyle="semibold">
            Darkmode
            <CustomText size={12} color={colors.text}>
              &nbsp; (Jangan Diklik Ntar Jelek)
            </CustomText>
          </CustomText>
          <Switch
            thumbColor={colors.primary}
            style={{
              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
            }}
            value={theme == ThemeType.Dark}
          />
        </TouchableOpacity>

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
      </View>
    </SafeAreaWrapper>
  );
}

const createStyle = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 14,
    },
    card: {
      backgroundColor: colors.muted,
      padding: 14,
      borderRadius: 10,
    },
    row: {
      flexDirection: "row",
      gap: 20,
      justifyContent: "space-between",
      alignItems: "center",
    },
    mt20: {
      marginTop: 20,
    },
    header: {
      height: 60,
    },
  });

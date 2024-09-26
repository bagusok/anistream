import {
  StyleSheet,
  Platform,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { CustomText } from "@/components/ui";
import { useColors } from "@/hooks/useColors";
import { ThemeColors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosIn } from "@/utils/axios";
import { API_URL, GITHUB_REPO_URL } from "@/constants/Strings";
import { useEffect, useRef, useState } from "react";
import { CardAnimeOngoing } from "@/components/ui/card-anime";
import CardAnimeHorizontal from "@/components/ui/card-anime/CardAnimeHorizontal";
import { router } from "expo-router";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { useAtomValue } from "jotai";
import { tokenAtom, userAtom, UserRole } from "@/store/auth";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {
  const colors = useColors();
  const styles = createStyle(colors);
  const [expoPushToken, setExpoPushToken] = useState("");

  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);

  const getAnimeHome = useQuery({
    queryKey: ["animeHome"],
    queryFn: async () =>
      axiosIn
        .get(`${API_URL}/anime/home`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          console.error(err);
          return err;
        }),
  });

  const registerNotification = useMutation({
    mutationKey: ["registerNotification", expoPushToken],
    mutationFn: () =>
      axiosIn
        .post(
          `${API_URL}/anime/user/notification/register`,
          {
            token: expoPushToken,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("Reg Notofication Res: ", res.data);
          return res.data;
        })
        .catch((err) => {
          console.log("Reg Notofication Err: ", err);
          throw new Error(err);
        }),
  });

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => token && setExpoPushToken(token))
      .catch((error: any) => {
        console.error("Error Expo Notif: ", error);
        setExpoPushToken("");
      });
  }, []);

  useEffect(() => {
    if (user.data?.role !== UserRole.GUEST && expoPushToken) {
      registerNotification.mutate();
    }
  }, [user?.data, expoPushToken]);

  return (
    <SafeAreaWrapper
      style={{
        paddingBottom: 70,
      }}
      headerStyle={{
        paddingHorizontal: 14,
      }}
      header={
        <View style={styles.header}>
          <CustomText color={colors.primary} fontStyle="bold" size="18">
            Miramine
          </CustomText>
          <TouchableOpacity onPress={() => router.push("/pages/search")}>
            <Feather name="search" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={getAnimeHome.isRefetching}
          onRefresh={getAnimeHome.refetch}
        />
      }
    >
      <View style={styles.container}>
        <View style={[styles.card]}>
          <CustomText fontStyle="semibold" size={14}>
            Support me!
          </CustomText>
          <CustomText fontStyle="regular">
            Support dengan like repo di github dan share ke teman-teman kalian.
            <CustomText
              onPress={() => Linking.openURL(GITHUB_REPO_URL)}
              fontStyle="medium"
              color={colors.primary}
              style={{
                textDecorationLine: "underline",
              }}
            >
              &nbsp; Klik disini
            </CustomText>
          </CustomText>
        </View>
        <View style={styles.mt20}>
          <View style={styles.animeSectionHeader}>
            <CustomText fontStyle="semibold" size={18}>
              Latest Update
            </CustomText>
            <CustomText fontStyle="regular" size={11}>
              See more &gt;
            </CustomText>
          </View>

          <View style={styles.sectionAnimeVertical}>
            {getAnimeHome?.data?.latestUpdate?.map(
              (anime: any, index: number) => {
                return <CardAnimeOngoing anime={anime} key={index} />;
              }
            )}
          </View>
        </View>
        <View style={styles.mt20}>
          <View style={styles.animeSectionHeader}>
            <CustomText fontStyle="semibold" size={18}>
              Most Viewed
            </CustomText>
            <CustomText fontStyle="regular" size={11}>
              See more &gt;
            </CustomText>
          </View>

          <ScrollView horizontal contentContainerStyle={styles.row}>
            {getAnimeHome?.data?.mostViewed?.map(
              (anime: any, index: number) => (
                <CardAnimeHorizontal anime={anime} key={index} />
              )
            )}
          </ScrollView>
        </View>
        <View style={styles.mt20}>
          <View style={styles.animeSectionHeader}>
            <CustomText fontStyle="semibold" size={18}>
              Ongoing
            </CustomText>
            <CustomText fontStyle="regular" size={11}>
              See more &gt;
            </CustomText>
          </View>

          <ScrollView horizontal contentContainerStyle={styles.row}>
            {getAnimeHome?.data?.ongoing?.map((anime: any, index: number) => (
              <CardAnimeHorizontal anime={anime} key={index} />
            ))}
          </ScrollView>
        </View>
        <View style={styles.mt20}>
          <View style={styles.animeSectionHeader}>
            <CustomText fontStyle="semibold" size={18}>
              Completed
            </CustomText>
            <CustomText fontStyle="regular" size={11}>
              See more &gt;
            </CustomText>
          </View>

          <ScrollView horizontal contentContainerStyle={styles.row}>
            {getAnimeHome?.data?.completed?.map((anime: any, index: number) => (
              <CardAnimeHorizontal anime={anime} key={index} />
            ))}
          </ScrollView>
        </View>
        <View
          style={{
            backgroundColor: colors.background,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            paddingTop: 100,
            alignItems: "center",
            display: getAnimeHome.isLoading ? "flex" : "none",
          }}
        >
          <CustomText>Loading...</CustomText>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

const createStyle = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      height: 60,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      position: "static",
    },
    container: {
      paddingHorizontal: 14,
    },
    card: {
      backgroundColor: colors.muted,
      borderRadius: 14,
      padding: 12,
    },
    donateButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    sectionAnimeVertical: {
      flexDirection: "row",
      flexWrap: "wrap",
    },

    sectionAnimeHorizontal: {
      flexDirection: "row",
      flexWrap: "wrap",
    },

    mt20: {
      marginTop: 24,
    },

    animeSectionHeader: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    },
    row: {
      flexDirection: "row",
    },
  });

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      // console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

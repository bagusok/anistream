import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
import "react-native-reanimated";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_500Medium,
  Poppins_400Regular_Italic,
} from "@expo-google-fonts/poppins";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();
ScreenOrientation.unlockAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  useNotificationObserver();
  GoogleSignin.configure({
    // scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_500Medium,
    Poppins_400Regular_Italic,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      ScreenOrientation.unlockAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Stack
            initialRouteName="/index"
            screenOptions={{
              headerShown: false,
            }}
          />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.pathname;
      const animeId = notification.request.content.data?.animeId;
      const episodeId = notification.request.content.data?.episodeId;
      const actionType = notification.request.content.data?.actionType;
      switch (actionType) {
        case "ANIME_DETAIL":
          router.push({
            pathname: `/pages/anime-detail`,
            params: { animeId },
          });
          break;
        case "EPISODE_DETAIL":
          router.push({
            pathname: `/pages/(protected)/anime-stream`,
            params: { episodeId },
          });
          break;
        default:
          router.push(url);
          break;
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

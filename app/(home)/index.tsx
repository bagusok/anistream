import {
  StyleSheet,
  Platform,
  Button,
  View,
  ScrollView,
  Pressable,
} from "react-native";

import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { CustomText } from "@/components/ui";
import { useColors } from "@/hooks/useColors";
import { ThemeColors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosIn } from "@/utils/axios";
import { API_URL } from "@/constants/Strings";
import { useEffect } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { CardAnimeOngoing } from "@/components/ui/card-anime";
import CardAnimeHorizontal from "@/components/ui/card-anime/CardAnimeHorizontal";
import { router } from "expo-router";

export default function HomeScreen() {
  const colors = useColors();
  const styles = createStyle(colors);

  const getAnimeHome = useQuery({
    queryKey: ["animeHome"],
    queryFn: async () =>
      axiosIn
        .get(`${API_URL}/anime/home`)
        .then((res) => {
          // console.log(res.data);
          return res.data.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        }),
  });

  useEffect(() => {
    if (getAnimeHome.data) {
      // console.log(getAnimeHome.data);
      console.log("datassas");
    } else if (getAnimeHome.error) {
      console.log("error");
    } else if (getAnimeHome.isPending) {
      console.log("pending");
    } else {
      console.log("else");
    }
  }, [getAnimeHome]);

  return (
    <SafeAreaWrapper
      style={{
        paddingHorizontal: 14,
        paddingBottom: 70,
      }}
      headerStyle={{
        paddingHorizontal: 20,
      }}
      header={
        <View style={styles.header}>
          <CustomText color={colors.primary} fontStyle="bold" size="18">
            Animeku
          </CustomText>
          {/* @ts-ignore */}
          <Pressable onPress={() => router.push("/pages/search")}>
            <Feather name="search" size={20} color={colors.text} />
          </Pressable>
        </View>
      }
    >
      <View style={[styles.card]}>
        <CustomText fontStyle="semibold" size={14}>
          Donate Ngab!
        </CustomText>
        <CustomText fontStyle="regular">
          Buat beli vps sama domain bang! 🥺
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
          {getAnimeHome?.data?.mostViewed?.map((anime: any, index: number) => (
            <CardAnimeHorizontal anime={anime} key={index} />
          ))}
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
    </SafeAreaWrapper>
  );
}

const createStyle = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      height: 56,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      position: "static",
    },
    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
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

import LoadingPage from "@/components/LoadingPage";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { CustomText } from "@/components/ui";
import CardAnimeSearch from "@/components/ui/card-anime/CardAnimeSearch";
import { ThemeColors } from "@/constants/Colors";
import { API_URL } from "@/constants/Strings";
import { useColors } from "@/hooks/useColors";
import { axiosIn } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function AllAnime() {
  const colors = useColors();
  const styles = createStyles(colors);

  const [selectedDay, setSelectedDay] = useState({
    day: "Mondays",
    index: 0,
  });

  const schedule = useQuery({
    queryKey: ["schedule"],
    queryFn: () =>
      axiosIn
        .get(`${API_URL}/anime/schedule`)
        .then((res) => res.data.data)
        .catch((err) => err),
  });

  if (schedule.isLoading) {
    return <LoadingPage />;
  }

  return (
    <SafeAreaWrapper
      header={
        <View style={styles.header}>
          <CustomText fontStyle="semibold" size={16}>
            Schedule
          </CustomText>
        </View>
      }
    >
      <View style={styles.container}>
        <ScrollView horizontal>
          <View style={styles.tabHeader}>
            {schedule?.data?.map((item: any, index: number) => (
              <TouchableWithoutFeedback
                onPress={() =>
                  setSelectedDay({
                    day: item.day,
                    index,
                  })
                }
                key={item.day}
                style={[
                  styles.tabHeaderItem,
                  {
                    backgroundColor:
                      selectedDay.day === item.day
                        ? colors.muted
                        : colors.background,
                  },
                ]}
              >
                <CustomText fontStyle="medium">{item.day}</CustomText>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </ScrollView>
        <View style={[styles.tabBody]}>
          {schedule?.data[selectedDay.index]?.data?.map((anime: any) => (
            <CardAnimeSearch key={anime.id} anime={anime} />
          ))}
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      height: 50,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    container: {
      gap: 14,
      paddingHorizontal: 14,
      paddingBottom: 100,
      backgroundColor: colors.background,
    },
    tabHeader: {
      flexDirection: "row",
      gap: 14,
      marginTop: 14,
    },
    tabHeaderItem: {
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 14,
      // backgroundColor: colors.muted,
    },
    tabBody: {
      flexWrap: "wrap",
      flexDirection: "row",
    },
    cardAnime: {
      flexDirection: "row",
      gap: 14,
    },
    cardAnimeImage: {
      width: 60,
      height: 100,
      borderRadius: 14,
    },
    cardAnimeContent: {},
  });

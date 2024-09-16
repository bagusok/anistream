import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { CustomText } from "@/components/ui";
import CardAllAnime from "@/components/ui/card-anime/CardAllAnime";
import { ThemeColors } from "@/constants/Colors";
import { API_URL } from "@/constants/Strings";
import { useColors } from "@/hooks/useColors";
import { axiosIn } from "@/utils/axios";
import { Feather } from "@expo/vector-icons";

import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AllAnime() {
  const colors = useColors();
  const style = createStyles(colors);

  const allAnime = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["allAnime"],
    queryFn: async ({ pageParam }) =>
      axiosIn
        .get(`${API_URL}/anime?page=${pageParam}`)
        .then((res) => res.data)
        .catch((err) => {
          console.error(err);
          throw new Error(err);
        }),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pagination.page + 1;
      return nextPage <= lastPage.pagination.totalPage ? nextPage : null;
    },
  });

  const flatData = useMemo(
    () => allAnime.data?.pages.flatMap((page) => page.data) ?? [],
    [allAnime.data]
  );

  if (allAnime.isLoading) {
    return <LoadingPage />;
  }

  if (allAnime.isError) {
    return <ErrorPage />;
  }

  return (
    <SafeAreaView>
      <View style={style.header}>
        <CustomText fontStyle="semibold" size={18}>
          All Anime
        </CustomText>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/pages/search",
            })
          }
        >
          <Feather name="search" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={style.container}>
        <FlatList
          data={flatData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CardAllAnime key={item.id} item={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
          onEndReached={() => {
            if (allAnime.hasNextPage) {
              allAnime.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          ListFooterComponent={
            allAnime.isFetchingNextPage ? (
              <ActivityIndicator color={colors.primary} />
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      height: 60,
      paddingHorizontal: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    container: {
      gap: 14,
      paddingHorizontal: 14,
      paddingBottom: 100,
      backgroundColor: colors.background,
    },
    cardAnime: {
      flexDirection: "row",
      gap: 14,
    },
  });

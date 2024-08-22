import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { CustomText } from "@/components/ui";
import CardAnimeSearch from "@/components/ui/card-anime/CardAnimeSearch";
import { ThemeColors } from "@/constants/Colors";
import { API_URL } from "@/constants/Strings";
import { useColors } from "@/hooks/useColors";
import { tokenAtom } from "@/store/auth";
import { axiosIn } from "@/utils/axios";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookmarkPage() {
  const colors = useColors();
  const style = createStyles(colors);
  const token = useAtomValue(tokenAtom);

  if (!token) {
    return <Redirect href="/pages/login" />;
  }

  const allBookmark = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["bookmark"],
    queryFn: async ({ pageParam }) =>
      axiosIn
        .get(`${API_URL}/anime/user/bookmark?page=${pageParam}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          //   console.log(res.data.data);
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        }),
    getNextPageParam: (lastPage) => {
      const nextPage = (lastPage?.pagination?.page ?? 0) + 1;
      return nextPage <= lastPage?.pagination?.totalPage ? nextPage : null;
    },
  });

  const flatData = useMemo(
    () => allBookmark.data?.pages.flatMap((page) => page.data) ?? [],
    [allBookmark.data]
  );

  if (allBookmark.isLoading) {
    return <LoadingPage />;
  }

  if (allBookmark.isError) {
    return <ErrorPage />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={style.header}>
        <CustomText fontStyle="semibold" size={18}>
          Bookmark
        </CustomText>
      </View>
      <View style={style.container}>
        <View style={style.tabHeader}>
          <CustomText
            style={[style.tabHeaderItem, { backgroundColor: colors.muted }]}
          >
            All
          </CustomText>
        </View>
        <FlatList
          data={flatData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardAnimeSearch key={item.id} anime={item} />
          )}
          onEndReached={() => {
            if (allBookmark.hasNextPage) {
              allBookmark.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          numColumns={3}
          ListFooterComponent={
            allBookmark.isFetchingNextPage ? (
              <ActivityIndicator color={colors.primary} />
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={allBookmark.isRefetching}
              onRefresh={allBookmark.refetch}
            />
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
      flex: 1,
    },
    tabHeader: {
      flexDirection: "row",
      gap: 14,
    },
    tabHeaderItem: {
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 14,
    },
    cardAnime: {
      flexDirection: "row",
      gap: 14,
    },
  });

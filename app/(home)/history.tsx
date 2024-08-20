import LoadingPage from "@/components/LoadingPage";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { CustomText } from "@/components/ui";
import { ThemeColors } from "@/constants/Colors";
import { API_URL } from "@/constants/Strings";
import { useColors } from "@/hooks/useColors";
import { tokenAtom } from "@/store/auth";
import { axiosIn } from "@/utils/axios";
import { dateFormat, secondToMinutes } from "@/utils/format";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CustomRefreshControlProps {
  refreshing: boolean;
  style?: StyleProp<ViewStyle>;
}

const CustomRefreshControl: React.FC<CustomRefreshControlProps> = ({
  refreshing,
  style,
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {refreshing && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

export default function HistoryPage() {
  const colors = useColors();
  const style = createStyles(colors);

  const token = useAtomValue(tokenAtom);

  const history = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["anime-history"],
    queryFn: async ({ pageParam }) =>
      axiosIn
        .get(`${API_URL}/anime/user/history?page=${pageParam}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          throw new Error(err?.response?.data?.message || err);
        }),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pagination.page + 1;
      return nextPage <= lastPage.pagination.totalPage ? nextPage : null;
    },
  });

  useEffect(() => {
    console.log("aaa");
  }, []);

  const flatData = useMemo(
    () => history.data?.pages.flatMap((page) => page.data) ?? [],
    [history.data]
  );

  if (history.isLoading) {
    return <LoadingPage />;
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const paddingToBottom = 20;
    const isCloseToBottom =
      event.nativeEvent.layoutMeasurement.height +
        event.nativeEvent.contentOffset.y >=
      event.nativeEvent.contentSize.height - paddingToBottom;

    if (isCloseToBottom && !history.isFetchingNextPage && history.hasNextPage) {
      history.fetchNextPage();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        onScroll={handleScroll}
        style={{
          backgroundColor: colors.background,
          flex: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={history.isRefetching}
            onRefresh={() => history.refetch()}
          />
        }
      >
        <View style={style.header}>
          <CustomText fontStyle="semibold" size={16}>
            History
          </CustomText>
        </View>
        <View style={style.container}>
          {flatData.map((item, index) => (
            <Fragment key={item.id}>
              {dateFormat(item.createdAt) !==
                dateFormat(flatData[index - 1]?.createdAt) && (
                <CustomText
                  size={16}
                  fontStyle="semibold"
                  style={{ marginTop: 10 }}
                >
                  {dateFormat(item.createdAt)}
                </CustomText>
              )}
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/pages/(protected)/anime-stream",
                    params: {
                      episodeId: item.EpisodeHistory[0].episodeId,
                    },
                  })
                }
              >
                <View style={style.cardAnime}>
                  <View
                    style={{
                      width: 100,
                      height: 150,
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={item.anime.imageUrl}
                      contentFit="cover"
                      style={{
                        width: "100%",
                        height: "100%",
                        aspectRatio: 2 / 3,
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <CustomText size={14} fontStyle="semibold">
                      {item.anime.title}
                    </CustomText>

                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        marginTop: 20,
                        justifyContent: "space-between",
                      }}
                    >
                      <CustomText>Episode {item.lastEpisode}</CustomText>
                      <View style={{ flexDirection: "row", gap: 2 }}>
                        <CustomText size={10}>
                          {secondToMinutes(
                            item.EpisodeHistory[0].watchingDuration
                          )}
                        </CustomText>
                        <CustomText size={10}>/</CustomText>
                        <CustomText size={10} style={{ opacity: 0.8 }}>
                          {secondToMinutes(
                            item.EpisodeHistory[0].episodeDuration
                          )}
                        </CustomText>
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: 2,
                        width: "100%",
                        backgroundColor: colors.gray[500],
                        height: 2,
                        position: "relative",
                        zIndex: 0,
                      }}
                    >
                      <View
                        style={{
                          width: `${
                            (item.EpisodeHistory[0].watchingDuration /
                              item.EpisodeHistory[0].episodeDuration) *
                            100
                          }%`,
                          backgroundColor: colors.primary,
                          height: 2,
                          position: "absolute",
                          top: 0,
                          left: 0,
                          zIndex: 1,
                        }}
                      ></View>
                    </View>
                  </View>
                </View>
              </Pressable>
            </Fragment>
          ))}
          {history.isFetchingNextPage ? (
            <ActivityIndicator color={colors.primary} />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      height: 50,
      paddingHorizontal: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    container: {
      gap: 14,
      paddingHorizontal: 14,
      paddingBottom: 60,
    },
    cardAnime: {
      flexDirection: "row",
      gap: 14,
    },
  });

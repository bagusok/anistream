import { useColors } from "@/hooks/useColors";
import { Image } from "expo-image";
import {
  Pressable,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import CustomText from "../Text";
import { Entypo } from "@expo/vector-icons";
import { ThemeColors } from "@/constants/Colors";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { API_URL } from "@/constants/Strings";
import { useAtomValue } from "jotai";
import { tokenAtom } from "@/store/auth";
import { axiosIn } from "@/utils/axios";
import { useEffect, useMemo } from "react";
import { dateFormatAgo } from "@/utils/format";

export default function CommentsSection({ animeId }: { animeId: string }) {
  const colors = useColors();
  const styles = createStyles(colors);

  const token = useAtomValue(tokenAtom);

  const getComments = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["all-comments", animeId],
    queryFn: async ({ pageParam }) =>
      axiosIn
        .get(
          `${API_URL}/anime/${animeId}/comments?page=${pageParam}&limit=30`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => res.data)
        .catch((err) => err?.response?.data?.message),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pagination.page + 1;
      return nextPage <= lastPage.pagination.totalPage ? nextPage : null;
    },
  });

  const flatData = useMemo(
    () => getComments.data?.pages.flatMap((page) => page.data) ?? [],
    [getComments.data]
  );

  if (getComments.isLoading) {
    <ActivityIndicator size="large" color={colors.primary} />;
  } else if (getComments.isError) {
    return <CustomText>{getComments.error.toString()}</CustomText>;
  } else if (flatData.length > 0) {
    return (
      <View
        style={{
          backgroundColor: colors.background,
          padding: 10,
          flex: 1,
          zIndex: 9999999,
        }}
      >
        <FlatList
          data={flatData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.cardComment]}>
              <View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                }}
              >
                <Image
                  source={
                    item?.user?.avatar ??
                    require("./../../../assets/images/avatar.png")
                  }
                  contentFit="cover"
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: 20,
                  }}
                />
              </View>
              <View style={[{ flex: 1 }]}>
                <View style={[styles.row]}>
                  <CustomText fontStyle="medium" size={10}>
                    {item?.user?.name ?? "Anonymous"}
                  </CustomText>
                  <CustomText size={10}>
                    - {dateFormatAgo(item.createdAt) ?? "Kapan hari"}
                  </CustomText>
                </View>
                <CustomText size={11} style={{ marginTop: 2 }}>
                  {item.text}
                </CustomText>
                <View style={[styles.row, { marginTop: 5 }]}>
                  <CustomText fontStyle="medium" size={12} color={colors.muted}>
                    Like
                  </CustomText>
                  <CustomText> | </CustomText>
                  <CustomText
                    fontStyle="medium"
                    size={12}
                    color={colors.primary}
                  >
                    Reply
                  </CustomText>
                </View>
              </View>
              <View>
                <Pressable>
                  <Entypo
                    name="dots-three-vertical"
                    size={14}
                    color={colors.text}
                  />
                </Pressable>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          onEndReached={() => {
            if (getComments.hasNextPage) {
              getComments.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          ListFooterComponent={
            getComments.isFetchingNextPage ? (
              <ActivityIndicator color={colors.primary} />
            ) : null
          }
        />
      </View>
    );
  } else {
    return (
      <View
        style={{
          backgroundColor: colors.background,
          padding: 10,
          flex: 1,
          zIndex: 9999999,
        }}
      >
        <CustomText
          fontStyle="medium"
          size={12}
          style={{ textAlign: "center" }}
        >
          Belum ada komentar
        </CustomText>
      </View>
    );
  }
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    cardRowH30: {
      flexDirection: "row",
      alignItems: "center",
      alignContent: "center",
      gap: 5,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: colors.muted,
      height: 30,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    cardEpisode: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
    },
    cardComment: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.muted,
    },
  });

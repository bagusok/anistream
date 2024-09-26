import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import { CustomText, CustomTextInput } from "@/components/ui";
import CommentsSection from "@/components/ui/comments/CommentsSection";
import StreamUrlNotFound from "@/components/ui/error/StreamUrlNotFound";
import VideoPlayer from "@/components/VideoPlayer";
import { ThemeColors } from "@/constants/Colors";
import { API_URL } from "@/constants/Strings";
import { useColors } from "@/hooks/useColors";
import { tokenAtom } from "@/store/auth";
import { axiosIn } from "@/utils/axios";
import { dateFormat } from "@/utils/format";
import { AntDesign, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import VideoLoading from "@/components/ui/VideoLoading";
import LikeDislikeAnime from "@/components/LikeDislikeAnime";

interface Episode {
  id: string;
  episode: string;
}

export default function AnimeStreamPage() {
  const { episodeId: id, indexNow, indexMax } = useLocalSearchParams();
  const [episodeId, setEpisodeId] = useState(id);
  const [episodeIndex, setEpisodeIndex] = useState({
    indexNow: Number(indexNow),
    indexMax: Number(indexMax),
  });
  const [animeId, setAnimeId] = useState<string>("");
  const [animeTitle, setAnimeTitle] = useState<string>("");

  const [listEpisode, setListEpisode] = useState<any>([]);

  const queryClient = useQueryClient();
  const token = useAtomValue(tokenAtom);

  const colors = useColors();
  const styles = createStyles(colors);

  const flatListRef = useRef<Animated.FlatList<Episode>>(null);

  useEffect(() => {
    if (flatListRef.current) {
      const activeIndex = listEpisode.findIndex(
        (item: any) => item.id === episodeId
      );
      if (activeIndex !== -1) {
        setEpisodeIndex({
          indexNow: activeIndex,
          indexMax: listEpisode.length - 1,
        });
        flatListRef.current.scrollToIndex({
          index: activeIndex,
          animated: true,
          viewOffset: 0,
        });
      }
    }
  }, [episodeId]);

  const handleInitialSrollIndex = () => {
    const activeIndex = listEpisode.findIndex(
      (item: any) => item.id === episodeId
    );
    if (activeIndex === -1) {
      return 0;
    }
    return activeIndex;
  };

  const onScrollToIndexFailed = (error: any) => {
    flatListRef.current?.scrollToOffset({
      offset: error.averageItemLength * error.index,
      animated: true,
    });
  };

  const addComment = useMutation({
    mutationKey: ["addComment"],
    mutationFn: async ({
      animeId,
      comment,
    }: {
      animeId: string;
      comment: string;
    }) =>
      axiosIn
        .post(
          `${API_URL}/anime/comments/add`,
          {
            animeId: animeId,
            comment: comment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          Alert.alert("Comment added successfully");
          queryClient.invalidateQueries({
            queryKey: ["all-comments", res.data.data.animeId],
            exact: true,
            refetchType: "active",
          });
          return res.data;
        })
        .catch((err) => {
          Alert.alert(err?.response?.data?.message || "Network Error");
          return err?.response?.data;
        }),
  });

  const episodeDetail = useQuery({
    queryKey: ["episode", episodeId],
    queryFn: async (id) =>
      axiosIn
        .get(`${API_URL}/anime/episode/${episodeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setListEpisode(res.data?.data?.anime?.Episode);
          setAnimeId(res.data?.data?.animeId);
          setAnimeTitle(res.data?.data?.anime?.title);
          return res.data?.data;
        })
        .catch((err) => {
          throw new Error(err?.response?.data?.message || "Network Error");
        }),
  });

  // SHARING BUTTON

  const shareUrl = async (
    episodeId: string,
    animeTitle: string,
    episode: string
  ) => {
    try {
      const result = await Share.share({
        url: `https://anime.bagusok.dev/`,
        title: "Nonton Anime Gratis",
        message: `Nonton ${animeTitle} - Episode ${episode} di Miramine! \n\nhttps://anime.bagusok.dev/`,
      });
    } catch (error: any) {
      Alert.alert("Error", error.toString());
    }
  };

  // END SHARING BUTTON

  const isHaveNextEpisode = () => episodeIndex.indexNow < episodeIndex.indexMax;

  const isHavePrevEpisode = () => episodeIndex.indexNow > 0;

  const nextEpisode = () => {
    if (isHaveNextEpisode()) {
      setEpisodeId(listEpisode[episodeIndex.indexNow + 1].id);
    }
  };

  const prevEpisode = () => {
    if (isHavePrevEpisode()) {
      setEpisodeId(listEpisode[episodeIndex.indexNow - 1].id);
    }
  };

  if (episodeDetail.isLoading && listEpisode.length == 0) {
    return <LoadingPage />;
  }

  if (episodeDetail.isError) {
    return <ErrorPage message={episodeDetail.error?.message} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {episodeDetail.data ? (
          <VideoPlayer
            episodeId={episodeDetail.data.id}
            title={`${episodeDetail.data.anime?.title} - Episode ${episodeDetail.data.episode}`}
            data={episodeDetail.data.stream.direct}
            isHaveNextEpisode={isHaveNextEpisode()}
            isHavePrevEpisode={isHavePrevEpisode()}
            nextEpisode={nextEpisode}
            prevEpisode={prevEpisode}
          />
        ) : (
          <VideoLoading />
        )}

        <View
          style={{
            backgroundColor: colors.background,
            padding: 10,
          }}
        >
          <CustomText fontStyle="medium" size={20}>
            {animeTitle}
          </CustomText>

          <View style={[styles.row]}>
            {episodeDetail.data ? (
              <CustomText>Episode {episodeDetail.data.episode}</CustomText>
            ) : (
              <CustomText>Loading..</CustomText>
            )}
            <Entypo name="dot-single" size={12} color={colors.text} />
            <Feather name="eye" size={12} color={colors.text} />
            <CustomText fontStyle="regular">
              {episodeDetail?.data?.views ?? 0}
            </CustomText>
            <Entypo name="dot-single" size={12} color={colors.text} />
            <CustomText>
              {dateFormat(episodeDetail?.data?.createdAt) ?? 0}
            </CustomText>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 20,
            }}
          >
            <LikeDislikeAnime animeId={animeId} />

            <TouchableOpacity style={styles.cardRowH30}>
              <Feather name="download" size={14} color={colors.text} />
              <CustomText>Download</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cardRowH30}
              onPress={() =>
                shareUrl(
                  episodeDetail.data.id,
                  episodeDetail.data.anime.title,
                  episodeDetail.data.episode
                )
              }
            >
              <FontAwesome name="share" size={14} color={colors.text} />
              <CustomText>Share</CustomText>
            </TouchableOpacity>
          </View>

          {/* Episode List */}
          <CustomText
            fontStyle="medium"
            size={16}
            style={{ marginTop: 20, marginBottom: 10 }}
          >
            Episode
          </CustomText>

          <Animated.FlatList
            ref={flatListRef}
            horizontal
            data={listEpisode}
            keyExtractor={(item) => item.id}
            renderItem={({ item: episode, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setEpisodeId(episode.id);
                }}
                key={episode.id}
                style={[
                  styles.cardEpisode,
                  {
                    backgroundColor:
                      episodeId === episode.id ? colors.primary : colors.muted,
                  },
                ]}
              >
                <CustomText>{episode.episode}</CustomText>
              </TouchableOpacity>
            )}
            getItemLayout={(data, index) => ({
              length: 40 + 10, // Tambahkan margin ke panjang item
              offset: (40 + 10) * index, // Tambahkan margin ke offset
              index,
            })}
            initialScrollIndex={handleInitialSrollIndex()}
            onScrollToIndexFailed={onScrollToIndexFailed}
            initialNumToRender={30}
            maxToRenderPerBatch={30}
            onEndReachedThreshold={0.5}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            snapToInterval={40 + 10}
            decelerationRate="fast"
          />

          {/* Comments */}
          <CustomText fontStyle="medium" size={16} style={{ marginTop: 20 }}>
            Comments
          </CustomText>

          {!addComment.isPending && listEpisode.length > 0 ? (
            <CustomTextInput
              onSubmitEditing={(e) =>
                addComment.mutate({
                  animeId: episodeDetail.data.animeId,
                  comment: e.nativeEvent.text,
                })
              }
              placeholder="Komen disini"
              style={{ marginTop: 10 }}
            />
          ) : (
            <ActivityIndicator size="large" color={colors.primary} />
          )}
        </View>
        {listEpisode.length > 0 && animeId !== "" && (
          <CommentsSection animeId={animeId} />
        )}
      </View>
    </SafeAreaView>
  );
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
      marginRight: 10,
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

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
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnimeStreamPage() {
  const { episodeId: id } = useLocalSearchParams();
  const [episodeId, setEpisodeId] = useState(id);
  const colors = useColors();
  const styles = createStyles(colors);

  const queryClient = useQueryClient();

  const token = useAtomValue(tokenAtom);

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
          return res.data?.data;
        })
        .catch((err) => {
          throw new Error(err?.response?.data?.message || "Network Error");
        }),
  });

  if (episodeDetail.isLoading) {
    return <LoadingPage />;
  }

  if (episodeDetail.isError) {
    return <ErrorPage message={episodeDetail.error?.message} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {episodeDetail.data?.stream?.direct?.length > 0 &&
      episodeDetail.data?.stream?.direct[0]?.source?.length > 0 ? (
        <VideoPlayer
          src={episodeDetail.data.stream.direct[0].source[0].url}
          title={`${episodeDetail.data.anime?.title} - Episode ${episodeDetail.data.episode}`}
          data={episodeDetail.data.stream.direct}
        />
      ) : (
        <StreamUrlNotFound />
      )}
      <View
        style={{
          backgroundColor: colors.background,
          padding: 10,
        }}
      >
        <CustomText fontStyle="medium" size={20}>
          {episodeDetail.data.anime?.title}
        </CustomText>

        <View style={[styles.row]}>
          <CustomText>Episode {episodeDetail.data.episode}</CustomText>
          <Entypo name="dot-single" size={12} color={colors.text} />
          <Feather name="eye" size={12} color={colors.text} />
          <CustomText fontStyle="regular">
            {episodeDetail.data.views}
          </CustomText>
          <Entypo name="dot-single" size={12} color={colors.text} />
          <CustomText>{dateFormat(episodeDetail.data.createdAt)}</CustomText>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginTop: 20,
          }}
        >
          <View style={styles.cardRowH30}>
            <TouchableWithoutFeedback>
              <AntDesign name="like2" size={16} color={colors.text} />
            </TouchableWithoutFeedback>
            <CustomText>|</CustomText>
            <CustomText>1K</CustomText>
            <Entypo name="dot-single" size={16} color={colors.text} />
            <CustomText>0</CustomText>
            <CustomText>|</CustomText>
            <TouchableWithoutFeedback>
              <AntDesign name="dislike2" size={16} color={colors.text} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.cardRowH30}>
            <FontAwesome name="share" size={14} color={colors.text} />
            <CustomText>Share</CustomText>
          </View>
          <View style={styles.cardRowH30}>
            <Feather name="download" size={14} color={colors.text} />
            <CustomText>Download</CustomText>
          </View>
        </View>

        {/* Episode List */}
        <CustomText fontStyle="medium" size={16} style={{ marginTop: 20 }}>
          Episode
        </CustomText>
        <ScrollView
          horizontal
          contentContainerStyle={{
            flexDirection: "row",
            gap: 10,
            marginTop: 10,
          }}
        >
          {episodeDetail.data.anime?.Episode.map((episode: any) => (
            <TouchableWithoutFeedback
              onPress={() => setEpisodeId(episode.id)}
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
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>

        {/* Comments */}
        <CustomText fontStyle="medium" size={16} style={{ marginTop: 20 }}>
          Comments
        </CustomText>

        {!addComment.isPending ? (
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
      <CommentsSection animeId={episodeDetail.data.animeId} />
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

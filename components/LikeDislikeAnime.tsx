import { API_URL } from "@/constants/Strings";
import { useColors } from "@/hooks/useColors";
import { tokenAtom } from "@/store/auth";
import { axiosIn } from "@/utils/axios";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Alert, TouchableOpacity, View } from "react-native";
import { CustomText } from "./ui";
import { formatLike } from "@/utils/format";

interface LikeDislikeAnimeProps {
  animeId: string;
}

interface AnimeLikeDislikeData {
  likes: number;
  dislikes: number;
  userLike: "LIKE" | "DISLIKE" | null;
}

export default function LikeDislikeAnime({ animeId }: LikeDislikeAnimeProps) {
  if (!animeId) {
    return null;
  }

  const colors = useColors();
  const token = useAtomValue(tokenAtom);
  const queryClient = useQueryClient();

  const getAnimeLikeDislike = useQuery<AnimeLikeDislikeData>({
    queryKey: ["getAnimeLikeDislike", animeId],
    queryFn: async () =>
      axiosIn
        .get(`${API_URL}/anime/${animeId}/likes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data.data)
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        }),
  });

  const likeDislikeAnime = useMutation<
    AnimeLikeDislikeData,
    Error,
    "LIKE" | "DISLIKE",
    { previousData: AnimeLikeDislikeData | undefined }
  >({
    mutationKey: ["likeDislikeAnime"],
    mutationFn: async (actionType: "LIKE" | "DISLIKE") => {
      return axiosIn
        .post(
          `${API_URL}/anime/${actionType === "LIKE" ? "like" : "dislike"}`,
          {
            animeId: animeId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => res.data.data)
        .catch((err) => {
          Alert.alert(err?.response?.data?.message || "Network Error");
          throw new Error(err?.response?.data?.message || "Network Error");
        });
    },
    onMutate: async (actionType: "LIKE" | "DISLIKE") => {
      // Cancel ongoing refetches to prevent overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: ["getAnimeLikeDislike", animeId],
      });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<AnimeLikeDislikeData>([
        "getAnimeLikeDislike",
        animeId,
      ]);

      // Optimistically update data
      queryClient.setQueryData<AnimeLikeDislikeData>(
        ["getAnimeLikeDislike", animeId],
        (oldData) => {
          if (!oldData) return oldData;

          const isLike = actionType === "LIKE";
          const userLike = isLike ? "LIKE" : "DISLIKE";
          const likes = isLike ? oldData.likes + 1 : oldData.likes - 1;
          const dislikes = isLike ? oldData.dislikes - 1 : oldData.dislikes + 1;

          return {
            ...oldData,
            userLike,
            likes: Math.max(0, likes),
            dislikes: Math.max(0, dislikes),
          };
        }
      );

      return { previousData };
    },
    onError: (err, actionType, context) => {
      // Revert to previous data on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ["getAnimeLikeDislike", animeId],
          context.previousData
        );
      }
      Alert.alert(err.message || "Network Error");
    },
    onSettled: () => {
      // Refetch after mutation is either successful or fails
      queryClient.invalidateQueries({
        queryKey: ["getAnimeLikeDislike", animeId],
      });
    },
  });

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        gap: 5,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: colors.muted,
        height: 30,
      }}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", gap: 5 }}
        onPress={() => likeDislikeAnime.mutate("LIKE")}
      >
        <AntDesign
          name={
            getAnimeLikeDislike.data?.userLike === "LIKE" ? "like1" : "like2"
          }
          size={16}
          color={colors.text}
        />
        <CustomText>|</CustomText>
        <CustomText>{formatLike(getAnimeLikeDislike.data?.likes)}</CustomText>
      </TouchableOpacity>
      <Entypo name="dot-single" size={12} color={colors.text} />
      <TouchableOpacity
        style={{ flexDirection: "row", gap: 5 }}
        onPress={() => likeDislikeAnime.mutate("DISLIKE")}
      >
        <CustomText>
          {formatLike(getAnimeLikeDislike.data?.dislikes)}
        </CustomText>
        <CustomText>|</CustomText>
        <AntDesign
          name={
            getAnimeLikeDislike.data?.userLike === "DISLIKE"
              ? "dislike1"
              : "dislike2"
          }
          size={16}
          color={colors.text}
        />
      </TouchableOpacity>
    </View>
  );
}

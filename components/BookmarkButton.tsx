import { API_URL } from "@/constants/Strings";
import { useColors } from "@/hooks/useColors";
import { tokenAtom, userAtom, UserRole } from "@/store/auth";
import { axiosIn } from "@/utils/axios";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function BookmarkButton({ animeId }: { animeId: string }) {
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);

  const colors = useColors();

  const getBookmark = useMutation({
    mutationKey: ["getBookmark", animeId],
    mutationFn: () =>
      axiosIn
        .post(
          `${API_URL}/anime/user/bookmark/check`,
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
          throw new Error(err.response.data.message || err.message);
        }),
  });

  const addBookmark = useMutation({
    mutationKey: ["addBookmark", animeId],
    mutationFn: () =>
      axiosIn
        .post(
          `${API_URL}/anime/user/bookmark/add`,
          { animeId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          getBookmark.mutate();
          return res.data.data;
        })
        .catch((err) => {
          console.log(err.response.data.message || err.message);
          throw new Error(err.response.data.message || err.message);
        }),
  });

  useEffect(() => {
    if (user?.data?.role !== UserRole.GUEST && token && animeId) {
      getBookmark.mutate();
    }
  }, [animeId]);

  if (getBookmark.isPending || addBookmark.isPending) {
    return <ActivityIndicator size="small" color={colors.primary} />;
  }

  if (
    getBookmark.isError ||
    addBookmark.isError ||
    user?.data?.role === UserRole.GUEST ||
    !token
  ) {
    return null;
  }

  if (getBookmark.isSuccess && getBookmark.data.isBookmark) {
    return (
      <TouchableOpacity onPress={() => addBookmark.mutate()}>
        <FontAwesome name="bookmark" size={18} color={colors.primary} />
      </TouchableOpacity>
    );
  }

  if (getBookmark.isSuccess && !getBookmark.data.isBookmark) {
    return (
      <TouchableOpacity onPress={() => addBookmark.mutate()}>
        <FontAwesome name="bookmark-o" size={18} color={colors.primary} />
      </TouchableOpacity>
    );
  }
}

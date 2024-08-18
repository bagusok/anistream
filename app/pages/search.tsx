import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { CustomText, CustomTextInput } from "@/components/ui";
import CardAnimeSearch from "@/components/ui/card-anime/CardAnimeSearch";
import { API_URL } from "@/constants/Strings";
import { useColors } from "@/hooks/useColors";
import { axiosIn } from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function SearchPage() {
  const colors = useColors();

  const [searchQuery, setSearchQuery] = useState("");
  const search = useMutation({
    mutationKey: ["search", searchQuery],
    mutationFn: () =>
      axiosIn
        .get(`${API_URL}/anime/search?q=${searchQuery}`)
        .then((res) => res.data.data)
        .catch((err) => err.response.data),
  });

  return (
    <SafeAreaWrapper
      style={{
        paddingHorizontal: 10,
        paddingVertical: 20,
      }}
    >
      <CustomTextInput
        placeholder="Bordog"
        style={{ marginTop: 40 }}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={() => search.mutate()}
      ></CustomTextInput>

      {search.isPending && (
        <ActivityIndicator
          color={colors.primary}
          style={{
            marginTop: 20,
          }}
          size="large"
        />
      )}

      {search?.data && (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {search.data.map((anime: any) => (
            <CardAnimeSearch anime={anime} key={anime.id} />
          ))}
        </View>
      )}
    </SafeAreaWrapper>
  );
}

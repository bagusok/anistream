import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { CustomText, CustomTextInput } from "@/components/ui";
import CardAnimeSearch from "@/components/ui/card-anime/CardAnimeSearch";
import { API_URL } from "@/constants/Strings";
import { useColors } from "@/hooks/useColors";
import { axiosIn } from "@/utils/axios";
import { Feather } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

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
    <SafeAreaWrapper>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: 60,
          paddingHorizontal: 14,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <CustomText fontStyle="bold" size={18}>
          Search
        </CustomText>
        <View
          style={{
            width: 24,
          }}
        ></View>
      </View>
      <View
        style={{
          paddingHorizontal: 14,
          paddingVertical: 14,
        }}
      >
        <CustomTextInput
          placeholder="Bordog"
          style={{ marginTop: 10 }}
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
              marginTop: 20,
            }}
          >
            {search.data.map((anime: any) => (
              <CardAnimeSearch anime={anime} key={anime.id} />
            ))}
          </View>
        )}
      </View>
    </SafeAreaWrapper>
  );
}

import LoadingPage from "@/components/LoadingPage";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Button, CustomText } from "@/components/ui";
import { ThemeColors } from "@/constants/Colors";
import { API_URL } from "@/constants/Strings";
import { useColors } from "@/hooks/useColors";

import { axiosIn } from "@/utils/axios";
import { dateFormat } from "@/utils/format";
import { Entypo, Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AnimeDetailPage() {
  const params = useLocalSearchParams();
  const colors = useColors();

  console.log(params);

  const animeDetail = useQuery({
    queryKey: ["animeDetail", params.animeId],
    queryFn: async () =>
      axiosIn
        .get(`${API_URL}/anime/detail/${params.animeId}`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => err),
  });

  if (animeDetail.isError) {
    return <Text>Error</Text>;
  }

  if (animeDetail.isLoading) {
    return <LoadingPage />;
  }

  if (!animeDetail.data) {
    return <Text>Data not found</Text>;
  }

  return (
    <ParallaxScrollView
      headerImage={
        <>
          <Image
            source={animeDetail.data?.imageUrl}
            style={{
              width: "100%",
              height: "100%",
            }}
            contentFit="cover"
          />
          <View
            style={{
              position: "absolute",
              top: 10,
              left: 0,
              right: 0,
              height: 50,
              zIndex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <Pressable onPress={() => router.back()}>
              <View
                style={{
                  borderRadius: 50,
                  backgroundColor: colors.white,
                  padding: 4,
                  shadowColor: colors.black,
                  shadowRadius: 2,
                  shadowOffset: {
                    height: 2,
                    width: 2,
                  },
                }}
              >
                <Feather name="arrow-left" size={24} color={colors.gray[500]} />
              </View>
            </Pressable>
            <Pressable onPress={() => router.back()}>
              <View
                style={{
                  borderRadius: 50,
                  backgroundColor: colors.white,
                  padding: 7,
                  shadowColor: colors.black,
                  shadowRadius: 2,
                  shadowOffset: {
                    height: 2,
                    width: 2,
                  },
                }}
              >
                <Feather name="heart" size={20} color={colors.gray[500]} />
              </View>
            </Pressable>
          </View>
          <LinearGradient
            colors={["transparent", colors.background]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "100%", // Adjust height as needed
              // borderRadius: 10,
            }}
          />
          <LinearGradient
            colors={[colors.background, "transparent"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%", // Adjust height as needed
              // borderRadius: 10,
            }}
          />
        </>
      }
    >
      <View
        style={{
          position: "relative",
          paddingHorizontal: 20,
        }}
      >
        <CustomText size={24} fontStyle="medium">
          {animeDetail.data?.titleShow ?? animeDetail.data.title}
        </CustomText>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <CustomText
            size={12}
            fontStyle="regular"
            color={colors.gray[500]}
            style={{
              flex: 1,
            }}
          >
            {animeDetail.data.title}
          </CustomText>
          <Pressable>
            <Feather name="bookmark" size={16} color={colors.gray[500]} />
          </Pressable>
        </View>
        <LinearGradient
          colors={["transparent", colors.background]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100%",
            zIndex: -1,
          }}
        />
      </View>

      <View
        style={{ paddingHorizontal: 20, backgroundColor: colors.background }}
      >
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
            }}
          >
            <Feather name="star" size={12} color={colors.primary} />
            <CustomText size={11}>
              {animeDetail.data?.malData?.score}
            </CustomText>
          </View>
          <Entypo name="dot-single" size={12} color={colors.gray[500]} />
          <CustomText size={11}>{animeDetail.data?.malData?.year}</CustomText>
          <Entypo name="dot-single" size={12} color={colors.gray[500]} />
          <CustomText size={11}>{animeDetail.data?.malData?.rating}</CustomText>
        </View>
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {animeDetail.data?.genres?.map((genre: any) => (
            <TouchableOpacity
              key={genre.id}
              style={{
                borderWidth: 1,
                borderColor: colors.primary,
                paddingHorizontal: 10,
                borderRadius: 10,
              }}
            >
              <CustomText size={10}>{genre.name}</CustomText>
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={{
            marginTop: 30,
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: colors.yellow[500],
              borderRadius: 20,
              paddingVertical: 10,
            }}
          >
            <CustomText
              fontStyle="semibold"
              size={16}
              style={{ textAlign: "center" }}
            >
              Tonton Sekarang
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          paddingTop: 20,
          paddingHorizontal: 20,
          backgroundColor: colors.background,
        }}
      >
        <CustomText size={18} fontStyle="semibold">
          Sinopsis
        </CustomText>
        <CustomText size={12} fontStyle="regular" style={{ marginTop: 10 }}>
          {animeDetail.data.synopsis}
        </CustomText>
      </View>

      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 20,
          gap: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
          }}
        >
          <CustomText size={18} fontStyle="semibold">
            Episodes
          </CustomText>
          <Feather name="chevron-right" size={20} color={colors.gray[500]} />
        </View>

        {animeDetail.data.Episode.map((episode: any) => (
          <Pressable
            key={episode.id}
            onPress={() =>
              router.push({
                // @ts-ignore
                pathname: "/pages/anime-stream",
                params: {
                  episodeId: episode.id,
                },
              })
            }
          >
            <View
              style={{
                padding: 10,
                borderRadius: 12,
                borderWidth: 1,
                backgroundColor: colors.muted,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 5,
                }}
              >
                <CustomText fontStyle="semibold" size={14}>
                  {episode.episode}.
                </CustomText>
                <CustomText
                  fontStyle="semibold"
                  numberOfLines={2}
                  style={{ flex: 1 }}
                >
                  {episode.title}
                </CustomText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 20,
                  marginTop: 4,
                }}
              >
                <CustomText
                  size={11}
                  fontStyle="regular"
                  color={colors.gray[400]}
                >
                  {dateFormat(episode.createdAt)}
                </CustomText>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                  }}
                >
                  <Feather name="eye" size={12} color={colors.gray[500]} />
                  <CustomText
                    size={11}
                    fontStyle="regular"
                    color={colors.gray[400]}
                  >
                    {episode.views}x ditonton
                  </CustomText>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

const createStyle = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {},
  });

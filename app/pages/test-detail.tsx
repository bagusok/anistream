import LoadingPage from "@/components/LoadingPage";
import ParallaxHeader from "@/components/ParallaxHeader";
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
import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: windowWidth } = Dimensions.get("window");
const HEADER_HEIGHT = 250;

export default function TestDetailPage() {
  const params = useLocalSearchParams();
  const colors = useColors();
  const styles = createStyle(colors);

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

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

  const shareUrl = async (animeId: string, animeTitle: string) => {
    try {
      const result = await Share.share({
        url: `https://anime.bagusok.dev/anime/${animeId}`,
        title: "Nonton Anime Gratis",
        message: `Nonton ${animeTitle} hanya di Miramine! \n\nhttps://anime.bagusok.dev/anime/${animeId}`,
      });
    } catch (error: any) {
      Alert.alert("Error", error.toString());
    }
  };

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
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Animated.FlatList
        ListHeaderComponent={
          <ParallaxHeader
            headerImage={
              <Animated.View style={[styles.header, headerAnimatedStyle]}>
                <Image
                  source={{ uri: animeDetail.data.imageUrl }}
                  style={{ width: "100%", height: "100%" }}
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
                      <Feather
                        name="arrow-left"
                        size={24}
                        color={colors.gray[500]}
                      />
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      shareUrl(animeDetail.data.id, animeDetail.data.title)
                    }
                  >
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
                      <Feather
                        name="share-2"
                        size={20}
                        color={colors.gray[500]}
                      />
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
              </Animated.View>
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
              style={{
                paddingHorizontal: 20,
                backgroundColor: colors.background,
              }}
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
                <CustomText size={11}>
                  {animeDetail.data?.malData?.year}
                </CustomText>
                <Entypo name="dot-single" size={12} color={colors.gray[500]} />
                <CustomText size={11}>
                  {animeDetail.data?.malData?.rating}
                </CustomText>
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
                paddingVertical: 10,
                backgroundColor: colors.background,
              }}
            >
              <CustomText size={18} fontStyle="semibold">
                Sinopsis
              </CustomText>
              <CustomText
                size={12}
                fontStyle="regular"
                style={{ marginTop: 10 }}
              >
                {animeDetail.data.synopsis}
              </CustomText>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
                paddingHorizontal: 20,
                paddingVertical: 20,
                backgroundColor: colors.background,
              }}
            >
              <CustomText size={18} fontStyle="semibold">
                Episodes
              </CustomText>
              <Feather
                name="chevron-right"
                size={20}
                color={colors.gray[500]}
              />
            </View>
          </ParallaxHeader>
        }
        data={animeDetail.data.Episode}
        keyExtractor={(item) => item.id}
        renderItem={({ item: episode }) => (
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
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <View
                style={{
                  borderRadius: 12,
                  backgroundColor: colors.muted,
                  padding: 10,
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
            </View>
          </Pressable>
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          backgroundColor: colors.background,
        }}
      />
    </SafeAreaView>
  );
}

const createStyle = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      width: windowWidth,
      backgroundColor: colors.background,
      position: "relative",
    },
  });

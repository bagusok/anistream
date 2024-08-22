import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import CustomText from "../Text";
import { useColors } from "@/hooks/useColors";
import { ThemeColors } from "@/constants/Colors";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const CardAllAnime = memo(({ item }: { item: any }) => {
  const colors = useColors();
  const style = createStyles(colors);

  return (
    <Pressable
      key={item.id}
      onPress={() =>
        router.push({
          pathname: "/pages/anime-detail",
          params: {
            animeId: item.id,
          },
        })
      }
    >
      <View style={style.cardAnime} key={item.id}>
        <View
          style={{
            height: 150,
            width: 100,
            borderRadius: 16,
            position: "relative",
          }}
        >
          <Image
            source={item.imageUrl}
            style={{ width: "100%", height: "100%", borderRadius: 5 }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", colors.background]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "100%",
              zIndex: 1,
            }}
          />
          <CustomText
            fontStyle="semibold"
            style={{
              position: "absolute",
              bottom: 5,
              left: 8,
              zIndex: 2,
            }}
          >
            {item.lastEpisode} eps
          </CustomText>
        </View>
        <View style={{ flex: 1 }}>
          <CustomText fontStyle="medium" size={14}>
            {item.title}
          </CustomText>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                paddingHorizontal: 10,
                paddingVertical: 2,
                backgroundColor: colors.muted,
                borderRadius: 10,
              }}
            >
              <Feather name="star" size={14} color={colors.yellow[600]} />
              <CustomText fontStyle="medium">
                {item.score?.toString()}
              </CustomText>
            </View>
            <CustomText
              fontStyle="medium"
              style={{
                paddingHorizontal: 10,
                paddingVertical: 2,
                backgroundColor: colors.muted,
                borderRadius: 10,
              }}
            >
              {item.rating}
            </CustomText>
          </View>
        </View>
      </View>
    </Pressable>
  );
});

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
      paddingBottom: 100,
      backgroundColor: colors.background,
    },
    cardAnime: {
      flexDirection: "row",
      gap: 14,
    },
  });

export default CardAllAnime;

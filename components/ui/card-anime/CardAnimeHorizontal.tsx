import { ThemeColors } from "@/constants/Colors";
import { useColors } from "@/hooks/useColors";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";
import CustomText from "../Text";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function CardAnimeHorizontal({ anime }: { anime: any }) {
  const colors = useColors();
  const styles = createStyle(colors);

  return (
    <View key={anime.id} style={styles.animeCard}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/pages/anime-detail",
            params: { animeId: anime.id },
          })
        }
      >
        <View style={{ height: 200 }}>
          <Image
            source={{ uri: anime.imageUrl }}
            style={styles.animeCardImage}
            contentFit="cover"
            onLoad={() => console.log("loaded")}
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              paddingLeft: 12,
              paddingRight: 16,
              backgroundColor: colors.yellow[500],
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <CustomText fontStyle="bold" size={14}>
              {anime.lastEpisode}
            </CustomText>
          </View>
          <LinearGradient
            colors={["transparent", colors.background]}
            style={styles.imageShadow}
          />
        </View>

        <CustomText numberOfLines={2}>{anime.title}</CustomText>
      </Pressable>
    </View>
  );
}

const createStyle = (colors: ThemeColors) =>
  StyleSheet.create({
    animeCard: {
      width: 115,
      marginBottom: 10,
      borderRadius: 8,
      margin: 4,
      position: "relative",
      overflow: "hidden",
    },
    animeCardImage: {
      width: "100%",
      height: "100%",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 100,
    },
    imageShadow: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 100,
    },
  });

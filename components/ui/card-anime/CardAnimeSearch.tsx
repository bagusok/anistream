import { ThemeColors } from "@/constants/Colors";
import { useColors } from "@/hooks/useColors";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";
import CustomText from "../Text";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function CardAnimeSearch({ anime }: { anime: any }) {
  const colors = useColors();
  const styles = createStyle(colors);

  const router = useRouter();

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
          />
          <View
            style={{
              position: "absolute",
              bottom: 14,
              left: 0,
              zIndex: 100,
              paddingLeft: 5,
              paddingRight: 16,
              //   backgroundColor: colors.yellow[600],
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <CustomText fontStyle="bold" size={11}>
              Episode {anime.lastEpisode}
            </CustomText>
          </View>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              paddingLeft: 12,
              paddingRight: 16,
              backgroundColor: colors.yellow[600],
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <CustomText fontStyle="bold" size={11}>
              {anime.status}
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
      // backgroundColor: colors.red[500],
      width: "31%",
      margin: "1%",
      marginBottom: 10,
      marginTop: 20,
      borderRadius: 8,
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
      height: 100, // Adjust height as needed
      // borderRadius: 10,
    },
  });

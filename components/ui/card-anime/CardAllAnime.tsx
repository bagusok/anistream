import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import CustomText from "../Text";
import { useColors } from "@/hooks/useColors";
import { ThemeColors } from "@/constants/Colors";
import { router } from "expo-router";

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
        <View style={{ height: 80, width: 60, borderRadius: 16 }}>
          <Image
            source={item.imageUrl}
            style={{ width: "100%", height: "100%", borderRadius: 5 }}
            contentFit="cover"
          />
        </View>
        <CustomText style={{ flex: 1 }} fontStyle="medium">
          {item.title}
        </CustomText>
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

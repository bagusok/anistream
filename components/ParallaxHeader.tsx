import { useColors } from "@/hooks/useColors";
import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  useWindowDimensions,
} from "react-native";
import Animated from "react-native-reanimated";

const { width: windowWidth } = Dimensions.get("window");
const HEADER_HEIGHT = 250;

type ParallaxHeaderProps = {
  headerImage: React.ReactElement;
  children: React.ReactNode;
};

export default function ParallaxHeader({
  headerImage,
  children,
}: ParallaxHeaderProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Animated.View style={[styles.header]}>{headerImage}</Animated.View>
      <View style={[styles.content, {}]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    overflow: "hidden",
    backgroundColor: "white",
  },
  header: {
    height: Dimensions.get("window").height / 2,
    width: windowWidth,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -999,
  },
  content: {
    marginTop: HEADER_HEIGHT,
  },
});

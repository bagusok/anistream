import { useColors } from "@/hooks/useColors";
import { Image } from "expo-image";
import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
}>;

export default function ParallaxScrollView({ children, headerImage }: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const colors = useColors();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <SafeAreaView>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        style={{
          minHeight: "100%",
          backgroundColor: colors.background,
        }}
      >
        <Animated.View
          style={[
            styles.header,
            // { backgroundColor: colors.background },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
        </Animated.View>

        {children}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    overflow: "hidden",
    position: "relative",
    zIndex: -999,
  },
  content: {
    flex: 1,
    // padding: 32,
    gap: 16,
    overflow: "hidden",
  },
});

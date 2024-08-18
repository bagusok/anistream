import { SafeAreaView } from "react-native-safe-area-context";
// import GlobalLoading from "./GlobalLoading";
import {
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { BaseColors, ThemeColors } from "@/constants/Colors";
import Animated from "react-native-reanimated";
// import ToastManager from "toastify-react-native";

interface SafeAreaWrapperProps extends ScrollViewProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  headerStyle?: ViewProps["style"];
}

export default function SafeAreaWrapper(props: SafeAreaWrapperProps) {
  const colors = useColors();

  const styles = createStyle(colors);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* <GlobalLoading />
      <ToastManager position="top" /> */}
      {props.header && (
        <View
          style={[
            props.headerStyle,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          {props.header}
        </View>
      )}
      <ScrollView contentContainerStyle={[styles.scrollView, props.style]}>
        {props.children}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyle = (colors: ThemeColors) =>
  StyleSheet.create({
    safeAreaView: {
      position: "relative",
      minHeight: "100%",
      width: "100%",
    },
    scrollView: {
      minHeight: "100%",
      zIndex: 1,
      backgroundColor: colors.background,
      position: "relative",
      width: "100%",
    },
  });

// CustomButton.tsx
import { BaseColors, ColorsType } from "@/constants/Colors";
import { useColors } from "@/hooks/useColors";
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { TouchableOpacityProps } from "react-native-gesture-handler";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  disabled?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  onPress?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  buttonStyle,
  textStyle,
  children,
}) => {
  const colors = useColors();

  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        disabled ? styles.buttonDisabled : styles.buttonDefault,
        buttonStyle,
      ]}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (colors: BaseColors) =>
  StyleSheet.create({
    button: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    buttonDefault: {
      backgroundColor: colors.primary,
    },
    buttonPressed: {
      backgroundColor: "#0056b3",
    },
    buttonDisabled: {
      backgroundColor: colors.muted,
    },
    buttonText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default CustomButton;

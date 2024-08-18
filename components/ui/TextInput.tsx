// CustomTextInput.tsx
import { BaseColors } from "@/constants/Colors";
import { useColors } from "@/hooks/useColors";
import React, { useState, FocusEvent } from "react";
import { TextInput, View, StyleSheet, TextInputProps } from "react-native";

// Tipe untuk props komponen
interface CustomTextInputProps extends TextInputProps {
  // Anda bisa menambahkan props tambahan di sini jika diperlukan
}

const CustomTextInput: React.FC<CustomTextInputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  // Event handler untuk fokus
  const handleFocus = () => setIsFocused(true);

  // Event handler untuk kehilangan fokus
  const handleBlur = () => setIsFocused(false);

  const colors = useColors();
  const styles = createStyles(colors);

  return (
    <TextInput
      {...props} // Menyebarkan props ke TextInput
      style={[styles.input, props.style, isFocused && styles.inputFocused]}
      placeholderTextColor={colors.text}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

const createStyles = (colors: BaseColors) =>
  StyleSheet.create({
    input: {
      width: "100%",
      height: 50,
      borderRadius: 22,
      paddingHorizontal: 14,
      backgroundColor: colors.muted,
      color: colors.text,
      tintColor: colors.text,
    },
    inputFocused: {
      borderColor: colors.primary,
      borderWidth: 1.5,
    },
  });

export default CustomTextInput;

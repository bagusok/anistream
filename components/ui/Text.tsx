import { useColors } from "@/hooks/useColors";
import React from "react";
import { Text, TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  fontStyle?: "regular" | "medium" | "semibold" | "bold" | "italic"; // Tambahkan prop fontStyle
  size?: number | string;
  color?: string;
}

const CustomText: React.FC<CustomTextProps> = ({
  children,
  style,
  fontStyle = "regular", // Set default value untuk fontStyle
  size = 12,
  color,
  ...rest
}) => {
  const colors = useColors();

  // Map fontStyle ke fontFamily yang sesuai
  const fontFamilies = {
    regular: "Poppins_400Regular",
    medium: "Poppins_500Medium",
    semibold: "Poppins_600SemiBold",
    bold: "Poppins_700Bold",
    italic: "Poppins_400Regular_Italic",
  };

  return (
    <Text
      {...rest}
      style={[
        style,
        {
          fontFamily: fontFamilies[fontStyle] || "Poppins_400Regular",
          fontSize: Number(size),
          color: color || colors.text,
          lineHeight: Number(size) * 1.5,
        },
      ]}
    >
      {children}
    </Text>
  );
};

export default CustomText;

import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { Button, CustomText } from "@/components/ui";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <SafeAreaWrapper>
      <View
        style={{
          alignItems: "center",
        }}
      >
        <CustomText
          size="24"
          fontStyle="bold"
          style={{
            marginTop: 100,
          }}
        >
          404
        </CustomText>
        <CustomText size="16">Page not found</CustomText>
        <Button
          title="Go back to home"
          style={{ marginTop: 10 }}
          onPress={() => {
            router.push("/(home)/");
          }}
        />
      </View>
    </SafeAreaWrapper>
  );
}

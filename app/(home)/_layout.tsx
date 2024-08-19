import { Tabs } from "expo-router";
import React from "react";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { userAtom } from "@/store/auth";
import LoadingPage from "@/components/LoadingPage";
import ErrorPage from "@/components/ErrorPage";

export default function TabLayout() {
  const colors = useColors();

  const [user, setUser] = useAtom(userAtom);

  if (user.isLoading) {
    return <LoadingPage />;
  }

  if (user.error) {
    return <ErrorPage message={user?.error?.message} />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="all-anime"
        options={{
          title: "All",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="clock" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "User",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

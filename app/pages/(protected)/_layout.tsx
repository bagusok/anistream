import { userAtom, UserRole } from "@/store/auth";
import { useAtomValue } from "jotai";
import LoginPage from "../login";
import { Redirect, Slot } from "expo-router";
import LoadingPage from "@/components/LoadingPage";
import ErrorPage from "@/components/ErrorPage";

export default function ProtectedLayout() {
  const user = useAtomValue(userAtom);

  if (user.isLoading) {
    return <LoadingPage />;
  }

  if (user.data?.role == UserRole.GUEST) {
    return <Redirect href="/pages/login" />;
  }

  if (user.data?.role == UserRole.USER) {
    return <Slot />;
  }

  if (user.error) {
    return <ErrorPage message={user?.error?.message} />;
  }
}

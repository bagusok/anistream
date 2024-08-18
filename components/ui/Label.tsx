import CustomText from "./Text";

export default function Label({ children }: { children: React.ReactNode }) {
  return <CustomText style={{ fontSize: 12 }}>{children}</CustomText>;
}

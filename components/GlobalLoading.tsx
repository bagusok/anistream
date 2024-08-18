// import { globalLoadingAtom } from "@/store/loading";
// import { useAtomValue } from "jotai";
// import { Text, View } from "react-native";

// export default function GlobalLoading() {
//   const isGlobalLoading = useAtomValue(globalLoadingAtom);

//   return (
//     <View
//       style={{
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//         display: isGlobalLoading ? "flex" : "none",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 999,
//       }}
//     >
//       <View
//         style={{
//           padding: 20,
//           borderRadius: 14,
//           backgroundColor: "white",
//         }}
//       >
//         <Text>Loading...</Text>
//       </View>
//     </View>
//   );
// }

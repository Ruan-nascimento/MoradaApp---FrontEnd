import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Text, View, Pressable } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-off-white gap-5 px-6">
      <Text className="text-blue-detail text-6xl font-bold"> Morada App </Text>
      <StatusBar style="dark" />
    </View>
  );
}
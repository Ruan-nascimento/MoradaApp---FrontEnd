import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Text, View, Pressable } from "react-native";
import { BackgroundLogin } from "./components/background";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-off-white">
      <BackgroundLogin />
    </View>
  );
}
import './global.css';
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./contexts/authContext";
import { BackgroundLogin } from "./components/background";
import { BottomNavigation } from "./components/bottomNavigation";


function AuthGate() {
  const { isAuthenticated, isLoadingToken } = useAuth();

  if (isLoadingToken) {
    return (
      <View className="flex-1 items-center justify-center bg-main">
        <ActivityIndicator color="#F2B705" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <BackgroundLogin />;
  }

  return (
    <NavigationContainer>
      <BottomNavigation />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
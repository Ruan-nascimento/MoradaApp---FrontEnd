import './global.css';
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./contexts/authContext";
import { BackgroundLogin } from "./components/background";
import { BottomNavigation } from "./components/bottomNavigation";
import { ImovelDetalhesPage } from "./pages/imovelDetalhes";


const Stack = createNativeStackNavigator();


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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomNavigation} />

        <Stack.Screen
          name="ImovelDetalhes"
          component={ImovelDetalhesPage}
          options={{ animation: "slide_from_right" }}
        />
      </Stack.Navigator>
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
import './global.css';
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./contexts/authContext";
import { BackgroundLogin } from "./components/background";
import { HomePage } from "./pages/homepage";

function Routes() {
  const { isAuthenticated, isLoadingToken } = useAuth();

  if (isLoadingToken) {
    return (
      <View className="flex-1 items-center justify-center bg-main">
        <ActivityIndicator color="#F2B705" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <HomePage />;
  }

  return <BackgroundLogin />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
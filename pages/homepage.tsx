import { Pressable, Text, View } from "react-native";
import { useAuth } from "../contexts/authContext";


export const HomePage = () => {
  const { removeToken } = useAuth();

  async function handleLogout() {
    try {
      await removeToken();
      console.log("Logout realizado com sucesso");
    } catch (error) {
      console.log("Erro ao fazer logout:", error);
    }
  }

  return (
    <View className="flex-1 bg-main items-center justify-center px-6">
      <Text className="text-white text-3xl font-bold mb-2">
        Home
      </Text>

      <Text className="text-off-white/60 text-base mb-8 text-center">
        Você está logado no Morada.
      </Text>

      <Pressable onPress={handleLogout}>
        {({ pressed }) => (
          <View
            className={`
              h-14 px-8 items-center justify-center rounded-2xl border
              ${
                pressed
                  ? "bg-red-500 border-red-500"
                  : "bg-transparent border-red-400"
              }
            `}
          >
            <Text
              className={`
                text-base font-bold
                ${pressed ? "text-white" : "text-red-400"}
              `}
            >
              Sair da conta
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};
import { Pressable, Text, View } from "react-native";
import { useAuth } from "../contexts/authContext";
import { GetUserAuthResponse, useUser } from "../hooks/useUser";
import { useEffect, useState } from "react";

export const ProfilePage = () => {
  const { removeToken, token, isLoadingToken } = useAuth();
  const { getUserAuth } = useUser();

  const [user, setUser] = useState<GetUserAuthResponse | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoadingUser(true);

        if (!token) return;

        const userData = await getUserAuth(token);
        setUser(userData);
      } catch (error) {
        console.error("Erro ao obter dados do usuário:", error);
      } finally {
        setIsLoadingUser(false);
      }
    }

    if (!isLoadingToken && token) {
      fetchUserData();
    }
  }, [isLoadingToken, token]);

  async function handleLogout() {
    try {
      await removeToken();
      setUser(null);
    } catch (error) {
      console.log("Erro ao fazer logout:", error);
    }
  }

  const isLoading = isLoadingToken || isLoadingUser;

  return (
    <View className="flex-1 bg-main items-center justify-center px-6">
      <Text className="text-warm-yellow text-4xl mb-2">👤</Text>

      <Text className="text-white text-3xl font-bold mb-2">
        Perfil
      </Text>

      <Text className="text-off-white/60 text-base mb-8 text-center">
        {isLoading
          ? "Carregando informações do usuário..."
          : user?.user?.name
          ? `Bem-vindo, ${user.user.name}!`
          : "Não foi possível carregar os dados do usuário."}
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

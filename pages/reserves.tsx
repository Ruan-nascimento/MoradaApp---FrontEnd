import { Text, View } from "react-native";

export const ReservesPage = () => {
  return (
    <View className="flex-1 bg-main items-center justify-center px-6">
      <Text className="text-warm-yellow text-4xl mb-2">📅</Text>

      <Text className="text-white text-3xl font-bold mb-2">
        Reservas
      </Text>

      <Text className="text-off-white/60 text-base text-center">
        Gerencie suas reservas de imóveis aqui.
      </Text>
    </View>
  );
};

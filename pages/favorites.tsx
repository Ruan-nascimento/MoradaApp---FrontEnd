import { Text, View } from "react-native";

export const FavoritesPage = () => {
  return (
    <View className="flex-1 bg-main items-center justify-center px-6">
      <Text className="text-warm-yellow text-4xl mb-2">💛</Text>

      <Text className="text-white text-3xl font-bold mb-2">
        Favoritos
      </Text>

      <Text className="text-off-white/60 text-base text-center">
        Seus imóveis favoritos aparecerão aqui.
      </Text>
    </View>
  );
};

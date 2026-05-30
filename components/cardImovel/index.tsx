import { Image, Text, View, TouchableOpacity } from "react-native";


interface CardImovelProps {
  name: string;
  location: string;
  totalStars: number;
  totalReviews: number;
  price: number;
  image?: string;
  onPress?: () => void;
}


function formatName(name: string): string {
  if (name.length > 30) {
    return name.substring(0, 30) + "...";
  }
  return name;
}


function formatPrice(price: number): string {
  if (price >= 10000) {
    return "R$ 10k+";
  }
  return `R$ ${price.toLocaleString("pt-BR")}`;
}


function formatStars(totalStars: number, totalReviews: number): string {
  if (totalReviews === 0) return "0,0";
  const average = totalStars / totalReviews;
  return average.toFixed(1).replace(".", ",");
}


export const CardImovel = ({
  name,
  location,
  totalStars,
  totalReviews,
  price,
  image,
  onPress,
}: CardImovelProps) => {
  const displayName = formatName(name);
  const displayPrice = formatPrice(price);
  const displayStars = formatStars(totalStars, totalReviews);

  return (
    <TouchableOpacity
      className="flex-1 bg-second rounded-2xl p-3 border border-third"
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <View className="w-full h-[200px] bg-third rounded-2xl overflow-hidden border border-third">
        {image ? (
          <Image
            source={{ uri: image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-third" />
        )}
      </View>

      <Text className="text-white text-lg font-bold mt-3" numberOfLines={2}>
        {displayName}
      </Text>

      <Text className="text-off-white/60 text-sm mt-1">
        {location}
      </Text>

      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-row items-center gap-1">
          <Text className="text-warm-yellow text-base">★</Text>
          <Text className="text-off-white text-sm">
            {displayStars} ({totalReviews})
          </Text>
        </View>

        <View className="flex-row items-baseline gap-0.5">
          <Text className="text-warm-yellow text-xl font-bold">
            {displayPrice}/
          </Text>
          <Text className="text-off-white/60 text-sm">
            noite
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


export const SkeletonImovel = () => {
  return (
    <View className="flex-1 bg-second rounded-2xl p-3 border border-third opacity-50">
      <View className="w-full h-[200px] bg-third rounded-2xl" />
      <View className="h-5 bg-third rounded mt-3 w-3/4" />
      <View className="h-4 bg-third rounded mt-1 w-1/2" />
      <View className="flex-row items-center justify-between mt-3">
        <View className="h-4 bg-third rounded w-1/4" />
        <View className="h-5 bg-third rounded w-1/4" />
      </View>
    </View>
  );
};
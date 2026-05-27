import { Image, Text, View } from "react-native";

interface CardImovelProps {
    name: string;
    location: string;
    totalStars: number;
    totalReviews: number;
    price: number;
    image?: string;
}

/**
 * Trunca o nome se passar de 30 caracteres
 */
function formatName(name: string): string {
    if (name.length > 30) {
        return name.substring(0, 30) + "...";
    }
    return name;
}

/**
 * Formata preço: se >= 10000 mostra "10k+", senão mostra "R$ X"
 */
function formatPrice(price: number): string {
    if (price >= 10000) {
        return "R$ 10k+";
    }
    return `R$ ${price.toLocaleString("pt-BR")}`;
}

/**
 * Calcula a média de estrelas (totalStars / totalReviews)
 * e formata com 1 casa decimal no padrão brasileiro
 */
function formatStars(totalStars: number, totalReviews: number): string {
    if (totalReviews === 0) return "0,0";
    const average = totalStars / totalReviews;
    return average.toFixed(1).replace(".", ",");
}

export const CardImovel = ({ name, location, totalStars, totalReviews, price, image }: CardImovelProps) => {
    const displayName = formatName(name);
    const displayPrice = formatPrice(price);
    const displayStars = formatStars(totalStars, totalReviews);

    return (
        <View className="flex-1 bg-second rounded-2xl p-3 border border-third">
            {/* Área da imagem com bordas arredondadas */}
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

            {/* Nome do imóvel */}
            <Text className="text-white text-lg font-bold mt-3" numberOfLines={2}>
                {displayName}
            </Text>

            {/* Localização */}
            <Text className="text-off-white/60 text-sm mt-1">
                {location}
            </Text>

            {/* Estrelas e Preço */}
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
        </View>
    );
}

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
}
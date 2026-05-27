import { View, FlatList, StyleSheet } from "react-native";
import { useAuth } from "../contexts/authContext";
import { GetUserAuthResponse, useUser } from "../hooks/useUser";
import { useEffect, useState, useCallback } from "react";
import { CardImovel, SkeletonImovel } from "../components/cardImovel";
import { SearchBar } from "../components/searchBar";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import { useImoveis } from "../hooks/useImoveis";
import { Imovel } from "../utils/interfaces/imoveis";
import { ActivityIndicator, RefreshControl } from "react-native";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const SEARCH_BAR_HEIGHT = 100;

export const HomePage = () => {
  const { token, isLoadingToken } = useAuth();
  const { getUserAuth } = useUser();
  const { imoveis, loading, error, fetchImoveis, refresh } = useImoveis();

  const [user, setUser] = useState<GetUserAuthResponse | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [searchText, setSearchText] = useState("");

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const blurContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 60], [0.85, 1], "clamp"),
  }));

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

  useEffect(() => {
    fetchImoveis(true);
  }, [fetchImoveis]);

  return (
    <View className="flex-1 bg-main">
      <Animated.ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={loading && imoveis.length === 0}
            onRefresh={refresh}
          />
        }
      >
        <View style={styles.gridContainer}>
          {imoveis.map((item, index) => {
            const totalReviews = item.reviews?.length || 0;
            const totalStars = item.reviews?.reduce((acc, curr) => acc + curr.stars, 0) || 0;

            return (
              <View key={item?.id ? `${item.id}-${index}` : index} style={styles.cardWrapper}>
                <CardImovel
                  name={item.title}
                  location={`${item.city} - ${item.uf}`}
                  totalStars={totalStars}
                  totalReviews={totalReviews}
                  price={item.price}
                  image={item.photo}
                />
              </View>
            );
          })}
        </View>

        {loading && imoveis.length === 0 && (
          <View style={styles.gridContainer}>
            <View style={styles.cardWrapper}>
              <SkeletonImovel />
            </View>
            <View style={styles.cardWrapper}>
              <SkeletonImovel />
            </View>
          </View>
        )}
      </Animated.ScrollView>

      <Animated.View style={[styles.searchBarContainer, blurContainerStyle]}>
        <BlurView intensity={40} tint="dark" style={styles.blurView}>
          <View className="px-4 pb-3 pt-2">
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  blurView: {
    paddingTop: 50,
  },
  listContent: {
    paddingTop: SEARCH_BAR_HEIGHT + 40,
    paddingHorizontal: 8,
    paddingBottom: 96,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 8,
  },
});
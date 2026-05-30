import { View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/authContext";
import { GetUserAuthResponse, useUser } from "../hooks/useUser";
import { useEffect, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
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
import { RefreshControl } from "react-native";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Imovel>);

const SEARCH_BAR_HEIGHT = 100;

export const HomePage = () => {
  const { token, isLoadingToken } = useAuth();
  const { getUserAuth } = useUser();
  const {
    imoveis,
    loading,
    error,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    refresh,
  } = useImoveis();

  const [user, setUser] = useState<GetUserAuthResponse | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [searchText, setSearchText] = useState("");

  const scrollY = useSharedValue(0);
  const flatListRef = useCallback((ref: any) => {
    // Guardamos a ref para scroll to top em troca de página
    flatListRefCurrent = ref;
  }, []);
  let flatListRefCurrent: any = null;

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

  // Carrega a primeira página ao montar
  useEffect(() => {
    goToPage(1);
  }, []);

  const navigation = useNavigation<any>();

  /** Renderiza cada card no grid */
  const renderItem = useCallback(({ item, index }: { item: Imovel; index: number }) => {
    const totalReviews = item.reviews?.length || 0;
    const totalStars = item.reviews?.reduce((acc, curr) => acc + curr.stars, 0) || 0;

    return (
      <View style={styles.cardWrapper}>
        <CardImovel
          name={item.title}
          location={`${item.city} - ${item.uf}`}
          totalStars={totalStars}
          totalReviews={totalReviews}
          price={item.price}
          image={item.photo}
          onPress={() => navigation.navigate("ImovelDetalhes", { id: item.id })}
        />
      </View>
    );
  }, [navigation]);

  /** Extrai chave única para cada item */
  const keyExtractor = useCallback((item: Imovel, index: number) => {
    return item?.id ? `${item.id}` : `imovel-${index}`;
  }, []);

  /** Footer: controles de paginação */
  const renderFooter = useCallback(() => {
    if (imoveis.length === 0) return null;

    return (
      <View style={styles.paginationContainer}>
        {/* Botão Anterior */}
        <TouchableOpacity
          style={[styles.pageButton, !hasPreviousPage && styles.pageButtonDisabled]}
          onPress={previousPage}
          disabled={!hasPreviousPage || loading}
          activeOpacity={0.7}
        >
          <Text style={[styles.pageButtonText, !hasPreviousPage && styles.pageButtonTextDisabled]}>
            ← Anterior
          </Text>
        </TouchableOpacity>

        {/* Indicador de página */}
        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {currentPage} / {totalPages}
          </Text>
        </View>

        {/* Botão Próxima */}
        <TouchableOpacity
          style={[styles.pageButton, !hasNextPage && styles.pageButtonDisabled]}
          onPress={nextPage}
          disabled={!hasNextPage || loading}
          activeOpacity={0.7}
        >
          <Text style={[styles.pageButtonText, !hasNextPage && styles.pageButtonTextDisabled]}>
            Próxima →
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [currentPage, totalPages, hasNextPage, hasPreviousPage, loading, imoveis.length, nextPage, previousPage]);

  /** Empty state: skeletons durante loading inicial */
  const renderEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.gridContainer}>
          <View style={styles.cardWrapper}>
            <SkeletonImovel />
          </View>
          <View style={styles.cardWrapper}>
            <SkeletonImovel />
          </View>
        </View>
      );
    }

    if (!loading && imoveis.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum imóvel encontrado</Text>
        </View>
      );
    }

    return null;
  }, [loading, imoveis.length]);

  return (
    <View className="flex-1 bg-main">
      <AnimatedFlatList
        data={imoveis}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        // Pull-to-refresh: recarrega a página atual
        refreshControl={
          <RefreshControl
            refreshing={loading && imoveis.length === 0}
            onRefresh={refresh}
          />
        }
        // Footer com controles de paginação
        ListFooterComponent={renderFooter}
        // Empty state com skeletons
        ListEmptyComponent={renderEmpty}
      />

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
  columnWrapper: {
    gap: 8,
    marginBottom: 8,
  },
  cardWrapper: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 16,
  },
  pageButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(245, 197, 24, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(245, 197, 24, 0.4)",
  },
  pageButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  pageButtonText: {
    color: "#F5C518",
    fontSize: 14,
    fontWeight: "600",
  },
  pageButtonTextDisabled: {
    color: "rgba(255, 255, 255, 0.25)",
  },
  pageIndicator: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  pageIndicatorText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 16,
  },
});
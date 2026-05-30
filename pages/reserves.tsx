import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useReservas } from "../hooks/useReservas";
import { formatarPreco } from "../utils/formatters";

interface ReservaItem {
  id: string;
  imoveisId: string;
  userId: string;
  chekIn: string;
  chekOut: string;
  finalValue: number;
  createdAt: string;
  imoveis: {
    id: string;
    title: string;
    photo: string;
    city: string;
    uf: string;
    price: number;
  };
}

export const ReservesPage = () => {
  const { listarReservas, cancelarReserva } = useReservas();
  const [reservas, setReservas] = useState<ReservaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservas = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await listarReservas();
      if (res.success && res.data) {
        setReservas(res.data as any);
      }
    } catch (err: any) {
      console.error("Erro ao carregar reservas:", err);
      Alert.alert("Erro", "Não foi possível carregar as reservas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Re-fetch toda vez que a aba focar (ex: redirecionado após pagamento)
  useFocusEffect(
    useCallback(() => {
      fetchReservas(true);
    }, [])
  );

  const handleCancelar = (id: string) => {
    Alert.alert(
      "Cancelar Reserva",
      "Tem certeza de que deseja cancelar esta reserva?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, Cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await cancelarReserva(id);
              if (res.success) {
                Alert.alert("Sucesso", "Sua reserva foi cancelada.");
                fetchReservas(false);
              }
            } catch (err: any) {
              Alert.alert("Erro", err.message || "Erro ao cancelar a reserva.");
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReservas(false);
  };

  const formatarDataLocal = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("pt-BR");
  };

  const renderItem = ({ item }: { item: ReservaItem }) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.imoveis.photo }} style={styles.cardImage} />
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.imoveis.title}</Text>
          <Text style={styles.cardLocation}>{item.imoveis.city} - {item.imoveis.uf}</Text>

          <View style={styles.divider} />

          <View style={styles.detailsRow}>
            <View>
              <Text style={styles.detailLabel}>Check-In (12:00)</Text>
              <Text style={styles.detailValue}>{formatarDataLocal(item.chekIn)}</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Check-Out (12:00)</Text>
              <Text style={styles.detailValue}>{formatarDataLocal(item.chekOut)}</Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View>
              <Text style={styles.detailLabel}>Pagamento</Text>
              <Text style={styles.detailValue}>⚡ PIX</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Valor Pago</Text>
              <Text style={styles.priceValue}>{formatarPreco(item.finalValue)}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleCancelar(item.id)}
            style={styles.cancelBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelBtnText}>Cancelar Reserva</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#F2B705" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Minhas Reservas</Text>

      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F2B705" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>Você não possui nenhuma reserva feita.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181B",
    paddingTop: 60,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  loaderContainer: {
    flex: 1,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },

  cardImage: {
    width: "100%",
    height: 180,
  },

  cardContent: {
    padding: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  cardLocation: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 12,
  },

  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  detailLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.4)",
    marginBottom: 2,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  priceValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F2B705",
  },

  cancelBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  cancelBtnText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "700",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },

  emptyText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
});

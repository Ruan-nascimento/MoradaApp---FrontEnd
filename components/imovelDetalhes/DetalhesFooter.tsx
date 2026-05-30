import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatarPreco, calcularMediaEstrelas, formatarMediaEstrelas } from "../../utils/formatters";


interface DetalhesFooterProps {
  preco: number;
  reviews: { stars: number }[];
  onReservar: () => void;
}


export function DetalhesFooter({ preco, reviews, onReservar }: DetalhesFooterProps) {
  const insets = useSafeAreaInsets();
  const precoFormatado = formatarPreco(preco);
  const media = calcularMediaEstrelas(reviews);
  const mediaFormatada = formatarMediaEstrelas(media);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
      <View style={styles.precoContainer}>
        <View style={styles.precoRow}>
          <Text style={styles.preco}>{precoFormatado}</Text>
          <Text style={styles.porNoite}> / noite</Text>
        </View>

        <View style={styles.estrelasRow}>
          <Text style={styles.estrelaIcon}>★</Text>
          <Text style={styles.estrelasTexto}>
            {mediaFormatada} ({reviews.length})
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.botaoReservar}
        onPress={onReservar}
        activeOpacity={0.8}
      >
        <Text style={styles.botaoTexto}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#18181B",
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },

  precoContainer: {
    gap: 2,
  },

  precoRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  preco: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F2B705",
  },

  porNoite: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
  },

  estrelasRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  estrelaIcon: {
    fontSize: 13,
    color: "#F2B705",
  },

  estrelasTexto: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
  },

  botaoReservar: {
    backgroundColor: "#F2B705",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },

  botaoTexto: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18181B",
  },
});

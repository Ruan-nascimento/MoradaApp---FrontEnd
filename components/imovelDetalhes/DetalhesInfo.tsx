import { View, Text, StyleSheet } from "react-native";
import { calcularMediaEstrelas, formatarMediaEstrelas } from "../../utils/formatters";


interface DetalhesInfoProps {
  titulo: string;
  cidade: string;
  uf: string;
  reviews: { stars: number }[];
}


export function DetalhesInfo({ titulo, cidade, uf, reviews }: DetalhesInfoProps) {
  const media = calcularMediaEstrelas(reviews);
  const mediaFormatada = formatarMediaEstrelas(media);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>

      <View style={styles.localizacaoRow}>
        <Text style={styles.pinIcon}>📍</Text>
        <Text style={styles.localizacao}>{cidade}, {uf}</Text>
      </View>

      <View style={styles.estrelasRow}>
        <Text style={styles.estrelaIcon}>★</Text>
        <Text style={styles.estrelasTexto}>
          {mediaFormatada} ({reviews.length})
        </Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  localizacaoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },

  pinIcon: {
    fontSize: 14,
  },

  localizacao: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.65)",
  },

  estrelasRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  estrelaIcon: {
    fontSize: 16,
    color: "#F2B705",
  },

  estrelasTexto: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
});

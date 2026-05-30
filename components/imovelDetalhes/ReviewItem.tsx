import { View, Text, Image, StyleSheet } from "react-native";
import { Review } from "../../utils/interfaces/imoveis";
import { formatarData } from "../../utils/formatters";


interface ReviewItemProps {
  review: Review;
}


export function ReviewItem({ review }: ReviewItemProps) {
  const dataFormatada = formatarData(review.createdAt);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: review.imgUser }}
          style={styles.foto}
        />

        <View style={styles.headerTextos}>
          <Text style={styles.nome}>{review.name}</Text>
          <Text style={styles.data}>{dataFormatada}</Text>
        </View>
      </View>

      <Text style={styles.comentario}>{review.comment}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.06)",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  foto: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#3F3F46",
  },

  headerTextos: {
    marginLeft: 12,
  },

  nome: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },

  data: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.45)",
  },

  comentario: {
    fontSize: 14,
    lineHeight: 21,
    color: "rgba(255, 255, 255, 0.75)",
  },
});

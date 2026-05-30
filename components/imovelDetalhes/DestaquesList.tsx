import { View, Text, StyleSheet } from "react-native";
import { Highlight } from "../../utils/interfaces/imoveis";


interface DestaquesListProps {
  highlights: Highlight[];
}


function DestaqueItem({ nome }: { nome: string }) {
  return (
    <View style={styles.item}>
      <View style={styles.bolinha} />
      <Text style={styles.itemTexto}>{nome}</Text>
    </View>
  );
}


export function DestaquesList({ highlights }: DestaquesListProps) {
  if (highlights.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Destaques</Text>

      {highlights.map((h) => (
        <DestaqueItem key={h.id} nome={h.name} />
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },

  titulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 14,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F2B705",
  },

  itemTexto: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.85)",
  },
});

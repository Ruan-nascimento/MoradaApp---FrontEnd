import { View, Text, StyleSheet } from "react-native";
import { Review } from "../../utils/interfaces/imoveis";
import {
  calcularMediaEstrelas,
  formatarMediaEstrelas,
  contarEstrelasPorNivel,
} from "../../utils/formatters";


interface AvaliacaoResumoProps {
  reviews: Review[];
}


function BarraEstrela({ nivel, quantidade, maximo }: { nivel: number; quantidade: number; maximo: number }) {
  const largura = maximo > 0 ? (quantidade / maximo) * 100 : 0;

  return (
    <View style={styles.barraRow}>
      <Text style={styles.barraNumero}>{nivel}</Text>

      <View style={styles.barraFundo}>
        <View style={[styles.barraPreenchida, { width: `${largura}%` }]} />
      </View>
    </View>
  );
}


export function AvaliacaoResumo({ reviews }: AvaliacaoResumoProps) {
  if (reviews.length === 0) return null;

  const media = calcularMediaEstrelas(reviews);
  const mediaFormatada = formatarMediaEstrelas(media);
  const contagem = contarEstrelasPorNivel(reviews);
  const maximo = Math.max(...contagem);

  return (
    <View style={styles.container}>
      <View style={styles.conteudo}>
        <View style={styles.mediaContainer}>
          <Text style={styles.mediaNumero}>{mediaFormatada}</Text>
          <Text style={styles.estrelas}>★★★★★</Text>
        </View>

        <View style={styles.barrasContainer}>
          {[5, 4, 3, 2, 1].map((nivel) => (
            <BarraEstrela
              key={nivel}
              nivel={nivel}
              quantidade={contagem[nivel - 1]}
              maximo={maximo}
            />
          ))}
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },

  conteudo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },

  mediaContainer: {
    alignItems: "center",
    gap: 4,
  },

  mediaNumero: {
    fontSize: 48,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  estrelas: {
    fontSize: 18,
    color: "#F2B705",
    letterSpacing: 2,
  },

  barrasContainer: {
    flex: 1,
    gap: 6,
  },

  barraRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  barraNumero: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
    width: 14,
    textAlign: "center",
  },

  barraFundo: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
  },

  barraPreenchida: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#F2B705",
  },
});

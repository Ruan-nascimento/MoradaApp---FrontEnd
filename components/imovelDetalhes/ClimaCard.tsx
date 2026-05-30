import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { ClimaData } from "../../utils/interfaces/imoveis";


interface ClimaCardProps {
  cidade: string;
  clima: ClimaData | null;
  loading: boolean;
  error: string | null;
}


function ClimaLoading() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator color="#F2B705" size="small" />
      <Text style={styles.loadingTexto}>Buscando clima...</Text>
    </View>
  );
}


function ClimaErro() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.erroTexto}>Clima indisponível</Text>
    </View>
  );
}


export function ClimaCard({ cidade, clima, loading, error }: ClimaCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Clima em {cidade}</Text>

      {loading && <ClimaLoading />}

      {error && !loading && <ClimaErro />}

      {clima && !loading && (
        <View style={styles.conteudo}>
          <View style={styles.temperaturaRow}>
            <Text style={styles.icone}>{clima.icone}</Text>
            <Text style={styles.temperatura}>{clima.temperatura}°</Text>

            <View style={styles.separador} />

            <View style={styles.detalhes}>
              <Text style={styles.descricao}>{clima.descricao}</Text>
              <Text style={styles.maxMin}>
                Max {clima.maxima}°  Min {clima.minima}°
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },

  titulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },

  conteudo: {
    alignItems: "center",
  },

  temperaturaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  icone: {
    fontSize: 42,
  },

  temperatura: {
    fontSize: 42,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  separador: {
    width: 1,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 8,
  },

  detalhes: {
    gap: 4,
  },

  descricao: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  maxMin: {
    fontSize: 13,
    color: "#F2B705",
    fontWeight: "500",
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },

  loadingTexto: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
  },

  erroTexto: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.4)",
  },
});
